---
layout: post
title:  "Triplanar Mapping for Landscape"
summary: "A tool for procedural landscape texturing"
preview: /assets/procedural_texture/preview.webp
tags: [Unreal, shaders, procedural]
---

While working on DuoQ - a stylized 3D FPS game my schoolmates and I are building - one of the more technical tasks my art leads asked for is creating an easy landscape system for artists in Unreal. Specifically on hills and slopes, they want the grass texture to always be on top and the sides of the slopes to have rocky texture. After looking at their reference, I immediately dove into triplanar mapping. 

# Triplanar Mapping
Normally when we texture an object, we do so by its UV coordinate. In this case, the object is a landscape malleable to artists' sculpting work, so the object will be of arbitrary shapes. Triplanar mapping is a texture mapping technique that utilizes world-space or object-space position in place of the missing UV coordinate to determine how we can apply textures. 

For DuoQ, I created a generic triplanar mapping texture that follows this simple rule:
- Grass albedo + normal mapping on Y axis
- Rock albedo + normal mapping on every other axis

The basic idea behind triplanar mapping is to project the texture onto a surface from three different directions:
- X-axis projection → Uses the YZ coordinates
- Y-axis projection → Uses the XZ coordinates
- Z-axis projection → Uses the XY coordinates

To make the material as flexible as possible for artists, I implemented six-way triplanar mapping that considers both positive and negative directions along every axis, which allows users to specify textures for each direction. The final texture color at a point is computed as a blend of the three projections based on the surface normal.

# Landscape Material
The procedural material MI_Landscape has the following parameters to tune:
- BlendSharpness: how blended are the materials together
- Tiling: the tiling of textures used in this material
- UseSixPlanes: correct 
- Offset: the offset of textures used in this material
- Texture parameters: each projection direction(+X, -X, +Y, -Y, +Z, -Z) has a slot for diffuse and normal textures, offering complete control over what we want each side of an object to look like

Assign this material MI_Landscape on the Landscape object by dragging the material to the Landscape object’s material slot. Once assigned, the default material would be the procedural grass/rock, whereas the other materials can be used for painting on the Landscape with the painting tool in Landscape mode.

![Landscape](/assets/procedural_texture/image.png)
![Sculpt](</assets/procedural_texture/sculpt.gif>)

# Performance
The proceduralism aspect of this material requires expensive texture lookups and calculation. I recommend only using this texture on small landscape objects that will have a lot of hills and deformations. If need be, I can create a less expensive specific to only top projection instead of a six-way projection on each side.
