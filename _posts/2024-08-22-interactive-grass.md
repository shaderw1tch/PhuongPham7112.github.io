---
layout: post
title:  "GPU-driven Interactive Realtime Grass"
summary: "My touch-grass-simulator"
preview: /assets/grass/preview.webp
tags: [physics-simulation, Unity, HLSL, C#, computer-animation]
---

Inspired by this research paper, I'm building a procedural grass system with physics simulation driven by the GPU Compute Shader in Unity.Each blade of grass is represented as a quadratic Bezier curve, and the tip of the grass blade is affected by natural forces (wind + stiffness + gravity) and collision. I made a slight improvement on top of the Bezier curve representation for the grass, using legendre-gauss solution for better approximation of the arc length (i.e. the grass length).

## Demo

### Physics

![Grass](/assets/grass/interactive-grass.gif)

### Culling

I then integrated grass culling thanks to the power of compute shader (for calculating the number of grass and which grass to render) and indirect rendering.

<iframe width="800" height="450" src="https://www.youtube.com/embed/sC0xbtpJkTs?si=C6yHEhDa48w09iiq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Links

🔗 [Responsive Real-Time Grass Rendering for General 3D Scenes](https://www.cg.tuwien.ac.at/research/publications/2017/JAHRMANN-2017-RRTG/JAHRMANN-2017-RRTG-draft.pdf) \
🔗 [Bezier Arc Length](https://pomax.github.io/bezierinfo/#arclength)

## 🛠️ Tools used

- C#
- HLSL
- Unity