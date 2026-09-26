/**
 * Toggle match/unmatch classes from the block's media query.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

//bind matchMedia listeners to each responsive display wrapper
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.jg_blocks-responsive_display:not(.is-editor)').forEach((root) => {
		let query = (root.dataset.mediaQuery || '').trim();
		query = query.replace(/^@media\s*/i, '');
		const matchClass = root.dataset.matchClass || '';
		const unmatchClass = root.dataset.unmatchClass || '';
		if (!query || !matchClass || !unmatchClass) {
			return;
		}

		let media;
		try {
			media = window.matchMedia(query);
		} catch (error) {
			return;
		}

		const applyMatch = () => {
			root.classList.toggle(matchClass, media.matches);
			root.classList.toggle(unmatchClass, !media.matches);
		};

		applyMatch();
		if (media.addEventListener) {
			media.addEventListener('change', applyMatch);
		} else {
			media.addListener(applyMatch);
		}
	});
});
