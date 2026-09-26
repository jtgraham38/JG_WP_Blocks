/**
 * Flip the card on tap/click for devices that do not hover, and on keyboard activation.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

//bind click and keyboard handlers to each flip card on the page
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.jg_blocks-media_flip_card:not(.is-editor)').forEach((card) => {
		card.addEventListener('click', (event) => {
			//desktop hover already flips; tap/click is for phones and coarse pointers
			if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
				return;
			}
			//leave nested links and form controls alone
			if (event.target.closest('a, button, input, textarea, select, label')) {
				return;
			}
			card.classList.toggle('is-flipped');
		});

		card.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				card.classList.toggle('is-flipped');
			}
		});
	});
});
