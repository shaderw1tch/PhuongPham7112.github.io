---
layout: post
title: "Toonshading in Lanesplitterz"
summary: "Making effects for a stylized bowling game"
preview: /assets/lanesplitterz/preview.webp
tags: [shaders, HLSL, Unity, game-dev, tech-art]
---

Lanesplitterz was my first time trying out a project that's very stylized. Since my art team wanted a flatter cartoon-ish look, I made a toon outline & shading post-processing effect using Sobel edge detection algorithm based on normal, depth, and color. With some cel-shading on top and a LOT of tuning, we had a pretty cool effect that feels like a comic book. The game is released on [Steam](https://store.steampowered.com/app/3290110/Lanesplitterz/) now!

![Toon shading](/assets/lanesplitterz/content.webp)

## Implementation

The basic idea is to use edge detection to notice big changes in color, depth, and normal of an object. I calculated this with Sobel filter and use the result to lerp and blend the screen filter however I liked, such as tuning the color depending on the depth or the intensity of the line art.

![Shadergraph](/assets/lanesplitterz/image.png)

```cpp
// EdgeDetectionOutlines.hlsl
static float2 sobelSamplePoints[9] = {
    float2(-1, 1), float2(0, 1), float2(1, 1),
    float2(-1, 0), float2(0, 0), float2(1, 0),
    float2(-1, -1), float2(0, -1), float2(1, -1)
};

// the weight matrixes
static float sobelXWeights[9] = {
    1, 0, -1,
    2, 0, -2,
    1, 0, -1
};

static float sobelYWeights[9] = {
    1, 2, 1,
    0, 0, 0,
    -1, -2, -1
};

// runs Sobel over depth texture
void DepthSobel_float(float2 UV, float DepthLineThickness, out float Out)
{
    float2 sobel = 0;
    // get depth values
    [unroll] for (int i = 0; i < 9; i++)
    {
        float2 sampleUV = UV + sobelSamplePoints[i] * DepthLineThickness;
        float depth = SHADERGRAPH_SAMPLE_SCENE_DEPTH(sampleUV);
        sobel += depth * float2(sobelXWeights[i], sobelYWeights[i]);
    }
    Out = length(sobel);
}

void ColorSobel_float(float2 UV, float ColorLineThickness, out float Out)
{
    float2 sobelRed = 0;
    float2 sobelGreen = 0;
    float2 sobelBlue = 0;
    // get color values
    [unroll] for (int i = 0; i < 9; i++)
    {
        float2 sampleUV = UV + sobelSamplePoints[i] * ColorLineThickness;
        float3 color = SHADERGRAPH_SAMPLE_SCENE_COLOR(sampleUV);
        sobelRed += color.r * float2(sobelXWeights[i], sobelYWeights[i]);
        sobelGreen += color.g * float2(sobelXWeights[i], sobelYWeights[i]);
        sobelBlue += color.b * float2(sobelXWeights[i], sobelYWeights[i]);
    }
    Out = max(length(sobelRed), max(length(sobelGreen), length(sobelBlue)));
}
```

## Adding VFX Juice

The rest is just adding some stylized VFXs whipped up from VFX Graph and Particle Systems.

<iframe width="800" height="450" src="https://www.youtube.com/embed/hfwO2Cd6g7I?si=PiMZvkYjdBDN9OF1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Tools Used

- C#
- HLSL
- Unity
- Procreate
- Figma
