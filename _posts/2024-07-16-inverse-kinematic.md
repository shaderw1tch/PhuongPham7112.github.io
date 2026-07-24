---
layout: post
title: "3D Deformation with IK"
summary: "CSCI 520: Inverse Kinematics in Computer Animation"
preview: /assets/ik/preview.webp
tags: [IK, rigging, OpenGL]
---

## Theory

Inverse Kinematic is one of the classic algorithms used for animation, an advancement for the previous more manual and memory-intensive methods such as keyframing each vertex of an arbitrary object. The IK problem is described as the following: given an skeleton input end effector at position (x1, x2) → how do I find the joint angle $\theta$?

How do we do this?
$F(\theta + \Delta \theta) = F(\theta) + J. \Delta \theta + O(||\Delta \theta||^2)$ (Taylor’s series)
where $J = {\partial F \over \partial \theta} \in R^{2\times 3}$ (Jacobian Matrix)

⇒ This leaves us with an equation that we can solve
$$J \Delta \theta = \begin{bmatrix} x_{1}\\ x_{2} \end{bmatrix} - F(\theta) \in R^{2} = \Delta x$$

### Pseudo Inverse Method

$\Delta \theta = J^\dagger . \Delta x \ , J^\dagger = J^T(JJ^T)^{-1} \in R^{3 \times 2}$ where we can be sure that $JJ^{T}$ is a square matrix and you can invert it to obtain a 3x2 matrix.

Solve for $\Delta \theta \ {given} \ J^\dagger$
$J.\Delta \theta = J.J^\dagger.\Delta x = (J.J^T).(J.J^T)^{-1}.\Delta x = I.\Delta x = \Delta x$
but do notice that $J^\dagger.J \neq I, J.J^\dagger = I$

### Tikhonov Regularization

This method makes some relaxation which leads to a much more stable performance.

Define a function for $\Delta \theta$ for an optimization problem:

$$
\begin{aligned}
E(\Delta \theta) =  {1 \over 2}||J.\Delta \theta - \Delta x||^2 + {\lambda \over 2} ||\Delta \theta||^2 \\
\Delta \theta =  \min_{\Delta \theta} {E(\Delta \theta)} \\
 \frac{\partial E}{\partial \Delta \theta} = (J \Delta \theta - \Delta x )^{T}.J + \lambda. (\Delta \theta)^{T}.I = 0 \\
 (J^T.J + \lambda.I). \Delta \theta = J^T.\Delta x
\end{aligned}
$$

The second term with $\lambda$ is the controlling variable that balances stability versus accuracy. Solving the optimization problem is then equivalent to finding the solution to the last two equations. ${\Delta \theta}$ can be solved easily.

## Implementation

Using OpenGL and math libraries like Eigen and ADOL-C, I implemented linear skin blending, forward kinematics (FK), and inverse kinematics (IK) algorithms to deform a character represented as an obj mesh, given its skinning weights and skeleton data.

There are two ways to go about IK: regularization vs pseudo inverse. I experimented with both, and as bonus, I tried out the more unstable method pseudo inverse with dual quaternion skin blending.

## Demo

<iframe width="800" height="450" src="https://www.youtube.com/embed/AA19c3Jzv-Q?si=Lpo08munJUCcPLQJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Links

- [Github code](https://github.com/PhuongPham7112/airi-graphics-programming/tree/main/starter)

## Tools Used

- C++
- Eigen
- ADOL-C
- OpenGL
