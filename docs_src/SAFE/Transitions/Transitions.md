When using SAFE, there is no browser load needed to navigate to a new page, and as such the transition can be animated.

SAFE presents an opportunity to handle the transition event through the ```Site.transition_page``` callback.

Examples of page transitions are provided below:

* [Fading](/docs/SAFE/Transitions/Fading)

* [Accordion](/docs/SAFE/Transitions/Accordion)

In most transitions, because the new page's height is calculated immediately after it is appended to the DOM, any images that do not have defined dimensions won't be included in the height calculation. This can result in a "jump" after the animation. The only method to prevent this is to set the dimensions of all images.