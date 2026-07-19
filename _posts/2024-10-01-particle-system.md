---
layout: post
title: "Particle Systems in Prime Engine"
summary: "Making of a particle system from scratch"
preview: /assets/prime_engine/preview.webp
tags: [game-engine, C++, particle-system]
---

Been working on the Prime Engine, an engine in CSCI 522 by my professor.

## Particle System

A basic particle system with flipbook animation support. These additions bring a lot more visual fidelity and dynamic effects to the engine.

### CPU-Based Particle System

I created a foundational particle system that runs on the CPU. This system includes two main components: particle emitters and individual particles.
This setup allows for flexible and controllable particle effects, laying the groundwork for more complex simulations in the future (particularly GPU-support and optimization).

### Transparency Rendering

To support the visual requirements of particle effects, I implemented a new blend state in the rendering pipeline. This enhancement enables transparency rendering for particles, which is crucial for creating realistic smoke, fire, and other semi-transparent effects.

### Comprehensive Particle Properties

The particle system now supports all basic particle properties. These include age, position, velocity, and other essential attributes. This comprehensive approach allows for diverse and dynamic particle behaviors, enhancing the realism of particle effects.

### Texture Mapping for Particles

I added support for both diffuse and normal mapping on particles. This feature allows for more detailed and realistic textures on each particle.

### Flipbook Animation Support

I implemented flipbook animation functionality, enabling more complex and detailed animated effects using sprite sheets. By dividing a texture into a grid of frames and cycling through them over time, I can now create fluid animations for particles, such as explosions or magical effects, without the need for multiple textures or complex shader logic.

### Attached Emitter Functionality

As a practical application of the new particle system, I created an emitter that can attach to a target object. Specifically, I implemented a smoke effect that emits from a target as it walks. This demonstrates the system's capability to create dynamic, movement-based particle effects.

### Particle Physics Collision

Utilizing a physics system that I built beforehand, I applied a physics box on each particle that has been marked as physics-based, creating some bouncing effect + decrease age on the particle upon collision with other physical objects.

### Curves

As someone who has spent a lot of time tweaking the dynamic shape of a particle over time, I really want to add something more than just "linearly increase the size over time", so I added smoother curve options such as sine, quadratic, and cubic.

<iframe width="800" height="450" src="https://www.youtube.com/embed/D19m8r-Nh8o?si=jbx6l7EmMQYdw_r6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Frustum Culling

Made progress on optimizing the rendering pipeline of Prime Engine by implementing frustum culling. This feature will greatly improve performance by reducing the number of draw calls for objects outside the player's view. Here's a breakdown of what I implemented:

### AABB Bounding Box Generation

I enhanced the MeshManager::getAsset() function to create Axis-Aligned Bounding Boxes (AABB) for each mesh. This process involves calculating the minimum and maximum corners of the mesh. To ensure accuracy for each mesh instance, I implemented a system where the AABB is transformed by the world matrix, giving each instance its unique bounding box in world space.

### View Frustum Generation

I added functionality to generate a view frustum every frame within the Camera's do_TRANSFORM_CALCULATIONS event. The Frustum struct I created consists of six planes (top, bottom, right, left, near, and far), each defined by a normal vector and a negative distance constant. This allows for efficient frustum checks against object bounding boxes.

### Frustum Culling Implementation

During the draw call gathering process, I implemented a test to check if each mesh's AABB is on or in front of all frustum planes. This ensures that only meshes within the player's view are rendered. Meshes failing this test are culled out, significantly reducing unnecessary draw calls and improving overall performance.

### Testing and Verification

To verify the effectiveness of the frustum culling system, I set up a test scenario by spawning 100 imrod meshes in the game world. This allowed me to observe the culling in action and confirm that meshes outside the view frustum were indeed being culled correctly.

<iframe width="800" height="450" src="https://www.youtube.com/embed/-g9rPlzY6xc?si=77GmDF3oPNVoAlDq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Physics Collision

I created a centralized physics manager that houses all essential physics component classes, including Sphere, AABB, and OBB. This manager also contains the necessary physics math utilities, providing a streamlined approach to handling physics calculations.

### Bounding Volume Initialization

I implemented an automatic registration system for bounding volumes. Now, whenever I create a mesh, an OBB (Oriented Bounding Box) is automatically registered with the physics manager. Similarly, each Soldier NPC spawned in the game world is assigned a Sphere collision volume.

### Collision Detection

My collision detection system now runs every frame, efficiently checking for intersections between Spheres and OBBs. The algorithm calculates the closest point on the OBB to the Sphere's center. A collision is registered if this distance is less than the Sphere's radius.

### Collision Response

Upon detecting a collision, I implemented a response system that determines the collision normal and identifies the axis with the largest magnitude. This information is used to adjust the Sphere's position, ensuring realistic interactions between objects.

### Gravity and Ground Detection

I added a ground detection feature that applies gravity to Spheres when they're not in contact with ground OBBs. This simulates falling and adds a new layer of realism to character movement.

<iframe width="800" height="450" src="https://www.youtube.com/embed/DYLmoc5cBxc?si=JJmaGEYI7T1LlYUt" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Tools Used

- C++
- Prime Engine
