---
layout: post
title:  "Raytracer"
summary: "CSCI 420: Building a simple raytracer with recursive reflections"
date:   2023-04-24
preview: /assets/raytracer_img/preview.webp
tags: [raytracer, OpenGL, computer-graphics]
---

First time learning to build raytracer from scratch using OpenGL.

## Raytracing Logic

1. Shoot a primary ray from the camera pixel by pixel within a frame
2. Calculate to determine whether the ray hits any object, two types of geometry in the scene was Triangle and Sphere 
3. If the primary doesn't hit anything, then there's nothing to render
4. If the primary does hit something, send a secondary ray from the hit spot to the light source to determine whether the object is in shadow
5. If in shadow, render black. If not in shadow, render the color using Phong shading
6. Shoot recursive reflection from that hit spot as well, rinse and repeat

## Demo

Below are some of the result pictures:
![Picture 1](/assets/raytracer_img/test1.webp)
![Picture 2](/assets/raytracer_img/test2.webp)
![Picture 3](/assets/raytracer_img/snow.webp)
![Picture 4](/assets/raytracer_img/spheres.webp)
![Picture 5](/assets/raytracer_img/SIGGRAPH.webp)

## Sources

🔗 [Github code](https://github.com/PhuongPham7112/airi-graphics-programming/tree/main/airi-raytracer)

## 🛠️ Tools used

- C++
- OpenGL