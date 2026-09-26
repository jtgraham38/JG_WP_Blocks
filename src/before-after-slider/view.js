/**
 * Keep the clip and handle in sync with the range input on the front end.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

//bind each comparison slider on the page
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.jg_blocks-before_after_slider:not(.is-editor)').forEach((slider) => {
		const input = slider.querySelector('.jg_blocks-before_after_slider_range');
		if (!input) {
			return;
		}

		//update the CSS variable the clip-path and handle both read
		const setPosition = (value) => {
			const clamped = Math.min(100, Math.max(0, Number(value) || 0));
			slider.style.setProperty('--slider-position', clamped + '%');
			input.value = String(clamped);
			input.setAttribute('aria-valuenow', String(clamped));
		};

		input.addEventListener('input', () => {
			setPosition(input.value);
		});
	});
});
