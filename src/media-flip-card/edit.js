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
import { useBlockProps, InnerBlocks, MediaUpload, MediaUploadCheck, RichText, InspectorControls } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

//my imports
import { Button, PanelBody } from '@wordpress/components';
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
	{ attributes, setAttributes }
) {
	//get the block props
	const blockProps = useBlockProps();

	//get all the non-style related block props for the wrapper
	const wrapperProps = { ...blockProps };
	wrapperProps.className += ' jg_blocks-media_flip_card is-editor';
	//useBlockProps() may not include a style object
	wrapperProps.style = {
		...(wrapperProps.style || {}),
		height: attributes?.height || '20rem',
	};

	//editor-only flip so the back face can be edited without hover
	const [isFlipped, setIsFlipped] = useState(false);
	if (isFlipped) {
		wrapperProps.className += ' is-flipped';
	}

	//function to handle a single image selection
	const onSelectMedia = (media) => {
		setAttributes({
			mediaId: media?.id || 0,
			mediaUrl: media?.url || '',
			mediaAlt: media?.alt || '',
			caption: attributes.caption || media?.caption || '',
		});
	};

	//blocks allowed on the back of the card
	const ALLOWED_BLOCKS = [
		'core/heading',
		'core/paragraph',
		'core/list',
		'core/quote',
		'core/buttons',
		'core/image',
		'core/separator',
		'core/spacer',
	];

	//starting content for the back of the card
	const TEMPLATE = [
		[ 'core/heading', { level: 3, placeholder: __( 'Card title', 'jg-blocks' ) } ],
		[ 'core/paragraph', { placeholder: __( 'Add the content shown on the back of the card…', 'jg-blocks' ) } ],
	];

	//color and border values from block supports (same sources BlockStyle reads)
	const presetBg = attributes?.backgroundColor || '';
	const customBg = attributes?.style?.color?.background || '';
	const presetText = attributes?.textColor || '';
	const customText = attributes?.style?.color?.text || '';
	const presetBorder = attributes?.borderColor || '';
	const customBorder = attributes?.style?.border?.color || '';
	const borderWidth = attributes?.style?.border?.width || '';
	const borderRadius = attributes?.style?.border?.radius || '';
	const borderStyle = attributes?.style?.border?.style || (borderWidth ? 'solid' : '');

	//linked radius is a string; the Styles tab can unlink corners into an object
	const radiusStyles = (typeof borderRadius === 'object' && borderRadius)
		? {
			borderTopLeftRadius: borderRadius.topLeft,
			borderTopRightRadius: borderRadius.topRight,
			borderBottomLeftRadius: borderRadius.bottomLeft,
			borderBottomRightRadius: borderRadius.bottomRight,
		}
		: (borderRadius ? { borderRadius } : {});

	//shared border styles for both faces
	const faceBorderStyle = {
		...(borderWidth ? { borderWidth, borderStyle } : {}),
		...radiusStyles,
		...(!presetBorder && customBorder ? { borderColor: customBorder } : {}),
	};
	const faceBorderClass = presetBorder ? `has-border-color has-${presetBorder}-border-color` : '';

	//back face uses background and the base text color
	const backClass = [
		'jg_blocks-media_flip_card_face jg_blocks-media_flip_card_back',
		faceBorderClass,
		presetBg ? `has-background has-${presetBg}-background-color` : '',
		presetText ? `has-text-color has-${presetText}-color` : '',
	].filter(Boolean).join(' ');
	const backStyle = {
		...faceBorderStyle,
		...(!presetBg && customBg ? { backgroundColor: customBg } : {}),
		...(!presetText && customText ? { color: customText } : {}),
	};

	//generate an id string for the instance of the block
	const blockID = blockProps.id;

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<div className="jg_blocks-inspector_inputs">
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={ "jg_blocks-media_flip_card_image_" + blockID } >Select Card Image</label>
							<MediaUploadCheck>
								<MediaUpload
									id={ "jg_blocks-media_flip_card_image_" + blockID }
									onSelect={onSelectMedia}
									allowedTypes={['image']}
									value={attributes?.mediaId}
									render={({ open }) => (
										<Button onClick={open}>
											{ attributes?.mediaUrl ? __( 'Replace Image', 'jg-blocks' ) : __( 'Open Selector', 'jg-blocks' ) }
										</Button>
									)}
								/>
							</MediaUploadCheck>
						</div>
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={"jg_blocks-media_flip_card_height_" + blockID} >Height</label>
							<input
								id={ "jg_blocks-media_flip_card_height_" + blockID }
								type="range"
								min={12}
								max={48}
								value={parseInt(attributes?.height, 10) || 20}
								onChange={(event) => {
									setAttributes({ height: event.target.value.toString() + "rem" });
								}}
							/>
							<div style={{textAlign: "center"}}>{attributes?.height?.toString() || "20rem"}</div>
						</div>
						<div className="jg_blocks-inspector_input_group">
							<Button
								variant="secondary"
								onClick={() => setIsFlipped(!isFlipped)}
							>
								{ isFlipped ? __( 'Edit Front', 'jg-blocks' ) : __( 'Edit Back', 'jg-blocks' ) }
							</Button>
						</div>
					</div>
				</PanelBody>
			</InspectorControls>

			<div {...wrapperProps}>
				<div className="jg_blocks-media_flip_card_inner">
					<div
						className={`jg_blocks-media_flip_card_face jg_blocks-media_flip_card_front ${faceBorderClass}`.trim()}
						style={faceBorderStyle}
					>
						{ attributes?.mediaUrl ? (
							<img
								className="jg_blocks-media_flip_card_image"
								src={attributes.mediaUrl}
								alt={attributes.mediaAlt}
							/>
						) : (
							<div className="jg_blocks-media_flip_card_placeholder">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={onSelectMedia}
										allowedTypes={['image']}
										value={attributes?.mediaId}
										render={({ open }) => (
											<Button onClick={open}>
												{ __( 'Select an image for this card.', 'jg-blocks' ) }
											</Button>
										)}
									/>
								</MediaUploadCheck>
							</div>
						) }

						<RichText
							tagName="p"
							className="jg_blocks-media_flip_card_caption"
							value={attributes?.caption || ''}
							onChange={(value) => setAttributes({ caption: value })}
							placeholder={__( 'Add a caption…', 'jg-blocks' )}
						/>
					</div>

					<div
						className={backClass}
						style={backStyle}
					>
						<div className="jg_blocks-media_flip_card_back_content">
							<InnerBlocks
								allowedBlocks={ALLOWED_BLOCKS}
								template={TEMPLATE}
								templateLock={false}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
