/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

//my imports
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */


export default function Edit(
	{ attributes, setAttributes, isSelected }
) {


	// Function to handle the media selection
    const onSelectMedia = (media) => {

		//construct media array
		const new_media = [];
		media.map((media) => {
			media = {
				id: media.id,
				url: media.url,
				alt: media.alt,
			};
			new_media.push(media);
		});


		setAttributes({
			media: new_media,
		});
    };

	return (
		<div { ...useBlockProps() }>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={onSelectMedia}
					allowedTypes={['image']}
					value={media ? media.map((item) => item.id) : []}
					multiple
					gallery
					render={({ open }) => (
						<Button onClick={open}>
							{media && media.length > 0 ? (
                                media.map((item, index) => (
                                    <img key={index} src={item.url} alt={item.alt} style={{ width: '100px', marginRight: '10px' }} />
                                ))
                            ) : (
                                'Select Images'
                            )}
						</Button>
					)}
				/>
			</MediaUploadCheck>
			<br />

			<pre>
				{JSON.stringify(attributes.media, null, 2)}
			</pre>
		</div>
	);
}
