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
            actions.goToSlide(context.currentSlide + 1);
        },
        prevSlide() {
            //go to the previous slide
            const context = getContext();
            actions.goToSlide(context.currentSlide - 1);
        },
        goToSlide(index) {
            //go to a specific slide (called by nextSlide and prevSlide)
            const context = getContext();
            context.prevSlide = context.currentSlide;
            context.currentSlide = index % context.slides.length < 0 ? context.slides.length - 1 : index % context.slides.length;
            callbacks.onSlideChange();
        }
    },
    callbacks: {
        init() {
            callbacks.setRoot();
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
        setRoot() {
            const context = getContext();
            const el = getElement();
            context.root = el.ref;
        },
        onSlideChange() {
            const context = getContext();

            //clear the interval if it exists
            if (context.autoPlayInterval) {
                clearInterval(context.autoPlayInterval);
            }
            //start the interval again
            callbacks.startAutoPlay();

            //hide all the slides that are not the current slide
            const slideEls = context.root.querySelectorAll('.jg_blocks-hero_slideshow_slide');
            slideEls.forEach((slide, index) => {
                if (index == context.currentSlide) {
                    slide.classList.remove('jg_blocks-hidden');
                    slide.classList.add('jg_blocks-hero_slideshow_selected_slide');

                    //set the class to animate the new slide, based on whether it is the next or previous slide
                    const isNextSlide = index > context.prevSlide || (context.prevSlide == context.slides.length - 1 && index == 0);
                    if (isNextSlide) {
                        slide.classList.add('jg_blocks-hero_slideshow_slide_right');
                    }
                    else {
                        slide.classList.add('jg_blocks-hero_slideshow_slide_left');
                    }
                }
                else {
                    slide.classList.add('jg_blocks-hidden');
                    slide.classList.remove('jg_blocks-hero_slideshow_selected_slide');
                    slide.classList.remove('jg_blocks-hero_slideshow_slide_right');
                    slide.classList.remove('jg_blocks-hero_slideshow_slide_left');
                }
            });

        }
    }
});
