---
layout: post
title:  "Roller coaster"
summary: "CSCI 420: Making a roller coaster ride in OpenGL"
date: 2023-07-15
preview: /assets/roller_coaster_img/preview.webp
---

## Implementation

- Built a roller coaster in OpenGL using the Catmull-Rom spline formula to create the curve of the rails. To make the spline smoother, I utilized recursion to vary the drawing step size.
- Made a T-shape cross-section rail, it was just copy-pasting the points but placing them perpendicular to one another.
- The fun part was making the camera move along the rail! I basically calculated the forward, normal, and binormal vectors to adjust the camera's view at a position based on the previous position.
- Well, the rider should be able to tell where it's up and down, so I added a ground plane textured with my chosen image (ice ground).
- Finally, calculate Phong shading combining diffuse and specular light on the rail to add that metallic finishing touch.

## Demo

![Enjoy](/assets/roller_coaster_img/roller_coaster_ride.gif)

## 🛠️ Tools used

- C++
- OpenGL