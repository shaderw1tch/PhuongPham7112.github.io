---
layout: post
title: "The Veiled Ones"
summary: "A horror exorcism experience"
date: 2024-03-11
preview: /assets/the_veiled_ones/preview.webp
tags: [Unity, game-dev, USC, AGP, Steam]
---

<iframe width="800" height="450" src="https://www.youtube.com/embed/M2wKEU77y4Q?si=5wfn8yishXLE-Gxw&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

I worked on a horror game with fellow USC students as a first-time technical artist. The game is available for free on [Steam](https://store.steampowered.com/app/2858390/The_Veiled_Ones/) right now! Below are some of my favorite effects I have made as a newbie in graphics programmer and VFX artist:D

## Implementation

### Magic Looking Glass

<iframe width="800" height="450" src="https://www.youtube.com/embed/I249mMw8_0c?si=eAu5maRifYZt60DK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Screen FX

<iframe width="800" height="450" src="https://www.youtube.com/embed/wHDN_bBg90o?si=Gn_1FmxFx33rYXRI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Flashlight

An auto adjusting flashlight based on the screen's luminance.

<iframe width="800" height="450" src="https://www.youtube.com/embed/1ceNOvTyEPo?si=f33ZQruQmlwywAcJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Candles

<iframe width="800" height="450" src="https://www.youtube.com/embed/7EwhWIKyCQE?si=hZkarkK4cSedqxwM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Cloth physics and shader

<iframe width="800" height="450" src="https://www.youtube.com/embed/wckqksqCzh4?si=Hht1-pEZbRHQhVGN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Exorcism VFX

<iframe width="800" height="450" src="https://www.youtube.com/embed/Eug50cLfX1A?si=5I2yimuzkS9DnyyR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Footstep FX

<iframe width="800" height="450" src="https://www.youtube.com/embed/cNkogolSyks?si=OUZ39ZmpN38bUb1i" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Performance and optimization

- Reduce overdraw from smoke VFX.
- Decrease flashlight's auto adjust mechanism from 20ms to sub 0.1ms.
- Set up occlusion culling.

[Things I learned about Perf](https://docs.google.com/document/d/e/2PACX-1vSWB8wU6kuQabpcm0mmU0ulQYmDAeaVWgHQ_QouRzUsffZbfX1QxToSWSGg6fMCqJgkLrlr7aceHm1Q/pub)

## Tools Used

- C#
- HLSL
- Unity
