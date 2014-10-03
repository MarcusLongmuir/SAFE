When using SAFE, there is no browser load needed to navigate to a new page, and as such the transition can be animated.

SAFE presents an opportunity to handle the transition event through the ```SAFE.transition_page``` callback.

This callback can be used simply to react to a change between pages and then let SAFE handle the transition, or you can ```return true;``` in the callback to indicate that the transition will be handled by your code.

Examples of page transitions are provided below:

* [Fading](/docs/safe/Transitions/Fading)

* [Accordion](/docs/safe/Transitions/Accordion)

In any transitions that animate between page heights, any unloaded images that do not have defined dimensions won't be included in the height calculation. This can result in a "jump" after the animation ends. The simple method to prevent this is to set the dimensions of all images.