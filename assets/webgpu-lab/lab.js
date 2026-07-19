const $ = (selector) => document.querySelector(selector);

const presets = {
  orbit: {
    label: 'FIRST MOTION', title: 'A force, a velocity, a position.',
    body: 'Each invocation updates one particle in parallel. The shader pulls it toward the pointer, applies damping, and writes the next state back to GPU memory.',
    shader: `// 01 — First motion: gravity + damping
@compute @workgroup_size(64)
fn simulate(@builtin(global_invocation_id) id: vec3u) {
  let i = id.x;
  if (i >= params.count) { return; }

  var p = particles[i];
  let toPointer = params.pointer - p.position;
  let distance = max(length(toPointer), 0.08);
  let gravity = normalize(toPointer) * 0.22 / distance;

  p.velocity += gravity * params.delta;
  p.velocity *= 0.992;
  p.position += p.velocity * params.delta;
  wrapParticle(&p);
  particles[i] = p;
}`
  },
  flow: {
    label: 'FLOW FIELD', title: 'Turn noise into a current.',
    body: 'A time-varying vector field steers every particle. Pointer pressure bends the current, producing complex motion from a few trigonometric functions.',
    shader: `// 02 — Flow field: curl-like directional forces
@compute @workgroup_size(64)
fn simulate(@builtin(global_invocation_id) id: vec3u) {
  let i = id.x;
  if (i >= params.count) { return; }

  var p = particles[i];
  let t = params.time * 0.28;
  let angle = sin(p.position.y * 2.8 + t) * 2.2
            + cos(p.position.x * 3.4 - t * 1.3);
  let flow = vec2f(cos(angle), sin(angle));
  let offset = params.pointer - p.position;
  let influence = exp(-dot(offset, offset) * 1.8);

  p.velocity += (flow * 0.32 + offset * influence * 1.7)
              * params.delta;
  p.velocity *= 0.975;
  p.position += p.velocity * params.delta;
  wrapParticle(&p);
  particles[i] = p;
}`
  },
  flock: {
    label: 'EMERGENT FLOCK', title: 'Local rules, collective intelligence.',
    body: 'Each particle samples nearby agents for separation, alignment, and cohesion. No particle knows the whole shape—the flock emerges from local decisions.',
    shader: `// 03 — Flocking: sample neighbors, then combine three rules
@compute @workgroup_size(64)
fn simulate(@builtin(global_invocation_id) id: vec3u) {
  let i = id.x;
  if (i >= params.count) { return; }

  var p = particles[i];
  var separation = vec2f(0.0);
  var alignment = vec2f(0.0);
  var cohesion = vec2f(0.0);
  var neighbors = 0.0;

  // Fixed-stride sampling keeps the demo fast at large particle counts.
  for (var s = 1u; s <= 24u; s++) {
    let j = (i + s * 97u) % params.count;
    let other = particles[j];
    let delta = other.position - p.position;
    let d2 = dot(delta, delta);
    if (d2 < 0.16 && d2 > 0.0001) {
      separation -= delta / d2;
      alignment += other.velocity;
      cohesion += other.position;
      neighbors += 1.0;
    }
  }
  if (neighbors > 0.0) {
    alignment = alignment / neighbors - p.velocity;
    cohesion = cohesion / neighbors - p.position;
    p.velocity += (separation * 0.016 + alignment * 0.11
                  + cohesion * 0.08) * params.delta;
  }
  let pointerForce = params.pointer - p.position;
  p.velocity += pointerForce * 0.035 * params.delta;
  let speed = length(p.velocity);
  if (speed > 0.55) { p.velocity = p.velocity / speed * 0.55; }
  p.position += p.velocity * params.delta;
  wrapParticle(&p);
  particles[i] = p;
}`
  }
};

const sharedWGSL = `
struct Particle { position: vec2f, velocity: vec2f }
struct Params { time: f32, delta: f32, pointer: vec2f, count: u32, aspect: f32, _pad: vec2f }
@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform> params: Params;

fn wrapParticle(p: ptr<function, Particle>) {
  if ((*p).position.x > params.aspect) { (*p).position.x = -params.aspect; }
  if ((*p).position.x < -params.aspect) { (*p).position.x = params.aspect; }
  if ((*p).position.y > 1.0) { (*p).position.y = -1.0; }
  if ((*p).position.y < -1.0) { (*p).position.y = 1.0; }
}
`;

const renderWGSL = `
struct Particle { position: vec2f, velocity: vec2f }
struct Params { time: f32, delta: f32, pointer: vec2f, count: u32, aspect: f32, _pad: vec2f }
@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform> params: Params;
struct Out { @builtin(position) position: vec4f, @location(0) speed: f32 }
@vertex fn vs(@builtin(vertex_index) vertex: u32, @builtin(instance_index) instance: u32) -> Out {
  let corners = array<vec2f, 3>(vec2f(-0.9,-0.55), vec2f(0.9,-0.55), vec2f(0.0,1.0));
  let p = particles[instance];
  let velocity = p.velocity;
  let direction = select(vec2f(0.0,1.0), normalize(velocity), length(velocity) > 0.001);
  let side = vec2f(-direction.y, direction.x);
  let local = corners[vertex];
  let size = 0.006 + min(length(velocity), 0.5) * 0.018;
  let world = p.position + (side * local.x + direction * local.y) * size;
  var out: Out;
  out.position = vec4f(world.x / params.aspect, world.y, 0.0, 1.0);
  out.speed = min(length(velocity) * 2.5, 1.0);
  return out;
}
@fragment fn fs(in: Out) -> @location(0) vec4f {
  let slow = vec3f(0.39, 0.52, 0.47);
  let fast = vec3f(0.78, 1.0, 0.25);
  return vec4f(mix(slow, fast, in.speed), 0.76);
}`;

let device, context, format, particleBuffer, uniformBuffer, bindGroup, renderPipeline, computePipeline;
let particleCount = 8192, activePreset = 'orbit', running = true, lastTime = performance.now(), elapsed = 0, frameCounter = 0, fpsStamp = performance.now();
let pointer = { x: 0, y: 0 }, speed = 1;

function setStatus(text, kind = '') { $('#gpuStatus').className = `status ${kind}`; $('#gpuStatus span:last-child').textContent = text; }
function updateLines() { const lines = $('#shaderEditor').value.split('\n').length; $('#lineNumbers').textContent = Array.from({length: lines}, (_, i) => i + 1).join('\n'); }
function setPreset(name) {
  activePreset = name; const preset = presets[name];
  $('.stage-tab.active')?.classList.remove('active');
  document.querySelector(`[data-preset="${name}"]`).classList.add('active');
  document.querySelectorAll('.stage-tab').forEach(tab => tab.setAttribute('aria-selected', tab.dataset.preset === name));
  $('#sceneLabel').textContent = preset.label; $('#noteTitle').textContent = preset.title; $('#noteBody').textContent = preset.body;
  $('#shaderEditor').value = preset.shader; $('#dirtyDot').classList.remove('visible'); updateLines(); compileShader();
}

async function init() {
  if (!navigator.gpu) { showFallback('WebGPU unavailable'); return; }
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error('No compatible GPU adapter found');
    device = await adapter.requestDevice();
    device.lost.then(info => showFallback(`GPU device lost: ${info.message || 'reload to retry'}`));
    context = $('#gpuCanvas').getContext('webgpu'); format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({device, format, alphaMode: 'opaque'});
    uniformBuffer = device.createBuffer({size: 32, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST});
    createParticles(); createRenderPipeline(); await compileShader(); resize(); setStatus('WebGPU active', 'ready'); requestAnimationFrame(frame);
  } catch (error) { console.error(error); showFallback(error.message); }
}

function showFallback(message) { setStatus(message, 'error'); $('#fallback').hidden = false; }
function createParticles() {
  const data = new Float32Array(particleCount * 4); const aspect = getAspect();
  for (let i = 0; i < particleCount; i++) { const r = Math.sqrt(Math.random()) * .72; const a = Math.random() * Math.PI * 2; data[i*4] = Math.cos(a)*r*aspect; data[i*4+1] = Math.sin(a)*r; data[i*4+2] = -Math.sin(a)*.06; data[i*4+3] = Math.cos(a)*.06; }
  particleBuffer?.destroy(); particleBuffer = device.createBuffer({size: data.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST}); device.queue.writeBuffer(particleBuffer, 0, data);
  rebuildBindGroup(); $('#particleMetric').textContent = `${particleCount.toLocaleString()} particles`;
}
function rebuildBindGroup() {
  if (!device || !particleBuffer || !uniformBuffer) return;
  if (!window.sharedLayout) window.sharedLayout = device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE|GPUShaderStage.VERTEX,buffer:{type:'storage'}},{binding:1,visibility:GPUShaderStage.COMPUTE|GPUShaderStage.VERTEX,buffer:{type:'uniform'}}]});
  bindGroup = device.createBindGroup({layout:window.sharedLayout,entries:[{binding:0,resource:{buffer:particleBuffer}},{binding:1,resource:{buffer:uniformBuffer}}]});
  if (!renderPipeline) createRenderPipeline();
}
function createRenderPipeline() {
  if (!device || !window.sharedLayout) return; const module = device.createShaderModule({code:renderWGSL});
  renderPipeline = device.createRenderPipeline({layout:device.createPipelineLayout({bindGroupLayouts:[window.sharedLayout]}),vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'src-alpha',dstFactor:'one',operation:'add'},alpha:{srcFactor:'one',dstFactor:'one',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
}
async function compileShader() {
  if (!device || !window.sharedLayout) return;
  const message = $('#compileMessage'); message.className = 'compile-message'; message.textContent = 'Compiling…';
  try {
    const module = device.createShaderModule({code: sharedWGSL + $('#shaderEditor').value}); const info = await module.getCompilationInfo(); const errors = info.messages.filter(m => m.type === 'error');
    if (errors.length) throw new Error(errors[0].message);
    const pipeline = await device.createComputePipelineAsync({layout:device.createPipelineLayout({bindGroupLayouts:[window.sharedLayout]}),compute:{module,entryPoint:'simulate'}});
    computePipeline = pipeline; message.className = 'compile-message success'; message.textContent = '✓ Shader compiled successfully'; $('#dirtyDot').classList.remove('visible');
  } catch (error) { message.className = 'compile-message error'; message.textContent = `× ${error.message}`; }
}
function getAspect() { const box = $('#canvasWrap').getBoundingClientRect(); return box.width / Math.max(box.height, 1); }
function resize() { if (!device) return; const canvas = $('#gpuCanvas'); const box = canvas.parentElement.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio, 2); const w = Math.max(1, Math.floor(box.width*dpr)), h = Math.max(1, Math.floor(box.height*dpr)); if (canvas.width !== w || canvas.height !== h) { canvas.width=w; canvas.height=h; } }
function frame(now) {
  if (!device) return; resize(); const rawDelta = Math.min((now-lastTime)/1000,.033); lastTime=now; if(running) elapsed += rawDelta*speed;
  const params = new ArrayBuffer(32); const f = new Float32Array(params); const u = new Uint32Array(params); f[0]=elapsed; f[1]=running?rawDelta*speed:0; f[2]=pointer.x; f[3]=pointer.y; u[4]=particleCount; f[5]=getAspect(); device.queue.writeBuffer(uniformBuffer,0,params);
  const encoder=device.createCommandEncoder(); if(running&&computePipeline){const pass=encoder.beginComputePass();pass.setPipeline(computePipeline);pass.setBindGroup(0,bindGroup);pass.dispatchWorkgroups(Math.ceil(particleCount/64));pass.end();}
  if(renderPipeline){const view=context.getCurrentTexture().createView();const pass=encoder.beginRenderPass({colorAttachments:[{view,clearValue:{r:.018,g:.025,b:.035,a:1},loadOp:'clear',storeOp:'store'}]});pass.setPipeline(renderPipeline);pass.setBindGroup(0,bindGroup);pass.draw(3,particleCount);pass.end();} device.queue.submit([encoder.finish()]);
  frameCounter++; if(now-fpsStamp>500){$('#fpsMetric').textContent=`${Math.round(frameCounter*1000/(now-fpsStamp))} fps`;frameCounter=0;fpsStamp=now;} requestAnimationFrame(frame);
}

document.querySelectorAll('.stage-tab').forEach(tab => tab.addEventListener('click',()=>setPreset(tab.dataset.preset)));
$('#shaderEditor').addEventListener('input',()=>{updateLines();$('#dirtyDot').classList.add('visible');});
$('#shaderEditor').addEventListener('scroll',e=>{$('#lineNumbers').scrollTop=e.target.scrollTop;});
$('#shaderEditor').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const s=e.target.selectionStart;e.target.setRangeText('  ',s,e.target.selectionEnd,'end');updateLines();}if(e.ctrlKey&&e.key==='Enter')compileShader();});
$('#applyButton').addEventListener('click',compileShader);
$('#copyButton').addEventListener('click',async()=>{await navigator.clipboard.writeText($('#shaderEditor').value);$('#copyButton').textContent='Copied';setTimeout(()=>$('#copyButton').textContent='Copy',1000);});
$('#playButton').addEventListener('click',()=>{running=!running;$('#playIcon').textContent=running?'Ⅱ':'▶';$('#playButton').setAttribute('aria-label',running?'Pause simulation':'Play simulation');});
$('#resetButton').addEventListener('click',()=>{elapsed=0;if(device)createParticles();});
$('#speedRange').addEventListener('input',e=>{speed=Number(e.target.value);$('#speedValue').textContent=`${speed.toFixed(1)}×`;});
$('#particleRange').addEventListener('change',e=>{particleCount=2**Number(e.target.value);$('#particleValue').textContent=`${particleCount/1024}K`;if(device)createParticles();});
$('#canvasWrap').addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width*2-1)*getAspect();pointer.y=-((e.clientY-r.top)/r.height*2-1);$('#pointerHint').style.opacity='0';});
$('#canvasWrap').addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0;});
window.addEventListener('resize',resize);
$('#shaderEditor').value=presets.orbit.shader;updateLines();init();
