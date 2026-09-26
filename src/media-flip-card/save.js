/**
 * Saves inner block content so the dynamic render can print the back of the card.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Persist only the nested blocks. The card chrome is rendered by the shortcode.
 *
 * @return {Element} Element to serialize.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
