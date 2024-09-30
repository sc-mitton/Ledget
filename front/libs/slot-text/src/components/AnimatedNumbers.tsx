

/*
Variables:
- old number
- new number
- directions (array of -1, 0, 1) indicating which direction each slot should move
- animations array (list of queued animations) e.g.
  [
    [0, 0, 0, -1],
    [0, 0, 0, -1],
    [0, 0, 0, -1]
  ]

We'll have two componets stored in the ui. The old number and the number.
When the animation is idle, the old numbe will be visible and the new number will be
transparent.

When a new value comes in:

1. Set the new number to this new value and set it's position so it's ready to animate
in

2. Compare the digits of both the numbers and fill out the directions array

3. Animate the old value out in the proper direction, and animate in the new value
  in the opposite direction the old value went out. Both values will be translating,
  and the old value will be fading out while the new value fades in.

4. If there are queued animations

5. After this whole animation process is done, swap the old and new values
  and swap the transparencies.

*/
