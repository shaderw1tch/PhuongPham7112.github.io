---
layout: post
title: "Something Fishy"
summary: "An underwater mystery puzzle"
date: 2024-02-21
preview: /assets/something_fishy/preview.webp
tags: [game-dev, puzzle, Unity, C#]
---

## Demo

<iframe width="800" height="450" src="https://www.youtube.com/embed/YiQPrDfEPb4?si=djqmNO2iCzb15hnx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[🎮 Download the game here!](https://gumball7112.itch.io/something-fishy)

## Implementation

* Player movement
* Inventory system using object pooling architecture
* Puzzle solving mechanism using keyboard/mouse inputs
* Events and state changes

## Process

At the start of the semester, I got back into game development after a whole summer doing software engineering. I found myself asking what if there was a game simulating the experience of being Ariel, full of curiousity for the human world? I ran through a lot iterations for conveying such an idea.\
What if there was a crime taking place by a coast, and you're a fish witnessing it, wanting to piece the truth together?\
What if you're mermaid transformed human thrusted into this murder mystery?\
After some thoughts, I ultimately settled on an idea that I could iterate on faster: the player is a fish stuck in a sunken house, and to find a way out, the fish has to collect clues and keys that unravel the story behind the house. And that's "Something Fishy".

"Something Fishy" took me longer than expected. There was a lot I had to re-learn and learn like using the shader graph to recreate underwater environment, implementing object pooling to optimize the object inspection system, etc. I'll list all the materials and reLinks I used to build the game too.

Asides from absorbing all those techniques, I guess a surprising element was how I let gameplay mechanics to naturally emerge out of simplifying the development process. I remembered one time my professor said during a game design lecture: Less is more. When you're stuck trying to make something work, it's mostly better to *subtract* rather than add. I initially wanted to pose a threat and time pressure to the player by introducing a predator roaming around the house, but given the time and resource (aka all by myself), I replaced that idea with a draining water mechanism. As a result, the decision made the game surprisingly more fun for me, as the player not only has to deal with horizontal limitation like locked rooms and chest but also vertical limitation (spoiler: some objects cannot be reached unless the player can replenish the water level). Somehow, one simple subtraction enabled better utilization of a game's space way more than I anticipated.

## Links

- [Caustics effects](https://ameye.dev/notes/realtime-caustics/)
- [More caustics effects](https://www.alanzucconi.com/2019/09/13/believable-caustics-reflections/)
- [Inventory system](https://youtu.be/oJAE6CbsQQA)

## Tools Used

- C#
- Unity
