/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* my imports */
import { store, getContext, getElement, withScope } from "@wordpress/interactivity";

/* my code */

const { actions, callbacks } = store('jg_blocks_hero_slideshow', {
    actions: {
        nextSlide() {
            //got to the next slide
            const context = getContext();
            context.direction = 'next';
            actions.goToSlide(context.currentSlide + 1);
        },
        prevSlide() {
            //go to the previous slide
            const context = getContext();
            context.direction = 'prev';
            actions.goToSlide(context.currentSlide - 1);
        },
        goToSlide(index) {
            //go to a specific slide (called by nextSlide and prevSlide)
            const context = getContext();
            const slideCount = context.slides?.length || 0;
            if (!slideCount) {
                return;
            }

            context.prevSlide = context.currentSlide;
            context.currentSlide = ((index % slideCount) + slideCount) % slideCount;
            callbacks.onSlideChange();
        }
    },
    callbacks: {
        init() {
            callbacks.startAutoPlay();
        },
        startAutoPlay() {
            //if context.autoPlay is set, start the interval
            const context = getContext();
            if (context.autoPlay) {
                context.autoPlayInterval = setInterval(withScope(() => {
                    actions.nextSlide();
                } ), context.autoPlay);
            }
        },
        onSlideChange() {
            const context = getContext();
            const { ref } = getElement();
            const root = ref?.closest?.('.jg_blocks-hero_slideshow');
            if (!root) {
                return;
            }

            //clear the interval if it exists
            if (context.autoPlayInterval) {
                clearInterval(context.autoPlayInterval);
            }
            //start the interval again
            callbacks.startAutoPlay();

            //reveal the new current slide
            const slideEls = root.querySelectorAll('.jg_blocks-hero_slideshow_slide');
            slideEls.forEach((slide, index) => {
                //if the current slide is found, animate it in
                if (index == context.currentSlide) {
                    slide.classList.remove('jg_blocks-hidden');
                    slide.classList.remove('jg_blocks-hero_slideshow_slide_right');
                    slide.classList.remove('jg_blocks-hero_slideshow_slide_left');
                    slide.classList.add('jg_blocks-hero_slideshow_selected_slide');

                    // force a reflow so the incoming animation can replay
                    void slide.offsetWidth;

                    //set the class to animate the new slide, based on the last control used
                    if (context.direction == 'prev') {
                        slide.classList.add('jg_blocks-hero_slideshow_slide_left');
                    }
                    else {
                        slide.classList.add('jg_blocks-hero_slideshow_slide_right');
                    }
                }
                else {
                    slide.classList.add('jg_blocks-hiding');
                }
            });

            //hide all the other slides (do it separately to animate the new one in over the old one)
            //wait 500ms to do this
            setTimeout(() => {
            slideEls.forEach((slide, index) => {
                //if the current slide is found, animate it in
                if (index !== context.currentSlide) {
                    //hide the slide
                    slide.classList.add('jg_blocks-hidden');
                    slide.classList.remove('jg_blocks-hero_slideshow_selected_slide');
                    slide.classList.remove('jg_blocks-hero_slideshow_slide_right');
                        slide.classList.remove('jg_blocks-hero_slideshow_slide_left');
                    }
                    slide.classList.remove('jg_blocks-hiding');
                });
            }, 500);

        }
    }
});
