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
import { store, getContext } from "@wordpress/interactivity";

/* my code */

const { state, actions, callbacks } = store('jg_blocks_hero_slideshow', {
    actions: {
        nextSlide() {
            console.log('nextSlide');
            state.currentSlide = (state.currentSlide + 1) % state.slides.length;
        },
        prevSlide() {
            console.log('prevSlide');
            state.currentSlide = (state.currentSlide - 1 + state.slides.length) % state.slides.length;
        },
        goToSlide(index) {
            state.currentSlide = index;
        },
        startAutoPlay() {
            //if state.autoPlay is set, start the interval
            console.log("setting autoplay interval to ", state.autoPlay);
            if (state.autoPlay) {
                state.autoPlayInterval = setInterval(actions.nextSlide, state.autoPlay);
            }
        }
    },
    callbacks: {

    }
} );