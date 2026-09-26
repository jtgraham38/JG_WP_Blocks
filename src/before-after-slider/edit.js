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
import { useBlockProps, MediaUpload, MediaUploadCheck, InspectorControls } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

//my imports
import { Button, PanelBody } from '@wordpress/components';

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

	//starting slider position, clamped to 0-100
	const sliderPosition = Math.min(100, Math.max(0, Number(attributes?.sliderPosition) || 0));

	//get all the non-style related block props for the wrapper
	const wrapperProps = { ...blockProps };
	wrapperProps.className += ' jg_blocks-before_after_slider is-editor';

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

	//background fills the button; text tints the icon; border tints the frame and line
	const buttonColor = presetBg
		? `var(--wp--preset--color--${presetBg})`
		: (customBg || '');
	const iconColor = presetText
		? `var(--wp--preset--color--${presetText})`
		: (customText || '');
	const borderColorValue = presetBorder
		? `var(--wp--preset--color--${presetBorder})`
		: ((customBorder || '').match(/^var:preset\|color\|([\w-]+)$/)
			? `var(--wp--preset--color--${RegExp.$1})`
			: (customBorder || ''));

	//linked radius is a string; the Styles tab can unlink corners into an object
	const radiusStyles = (typeof borderRadius === 'object' && borderRadius)
		? {
			borderTopLeftRadius: borderRadius.topLeft,
			borderTopRightRadius: borderRadius.topRight,
			borderBottomLeftRadius: borderRadius.bottomLeft,
			borderBottomRightRadius: borderRadius.bottomRight,
		}
		: (borderRadius ? { borderRadius } : {});

	//wrapper height, colors, frame border, and the CSS variable the clip uses
	wrapperProps.style = {
		...(wrapperProps.style || {}),
		height: attributes?.height || '24rem',
		'--slider-position': `${sliderPosition}%`,
		...(buttonColor ? { '--slider-button-color': buttonColor } : {}),
		...(iconColor ? { '--slider-icon-color': iconColor } : {}),
		...(borderColorValue ? { '--slider-border-color': borderColorValue, borderColor: borderColorValue } : {}),
		...(borderWidth ? { borderWidth, borderStyle } : {}),
		...radiusStyles,
	};

	//function to handle first (before) image selection
	const onSelectBefore = (media) => {
		setAttributes({
			beforeId: media?.id || 0,
			beforeUrl: media?.url || '',
			beforeAlt: media?.alt || '',
		});
	};

	//function to handle second (after) image selection
	const onSelectAfter = (media) => {
		setAttributes({
			afterId: media?.id || 0,
			afterUrl: media?.url || '',
			afterAlt: media?.alt || '',
		});
	};

	//generate an id string for the instance of the block
	const blockID = blockProps.id;

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<div className="jg_blocks-inspector_inputs">
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={ "jg_blocks-before_after_slider_before_" + blockID } >Select First Image</label>
							<MediaUploadCheck>
								<MediaUpload
									id={ "jg_blocks-before_after_slider_before_" + blockID }
									onSelect={onSelectBefore}
									allowedTypes={['image']}
									value={attributes?.beforeId}
									render={({ open }) => (
										<Button onClick={open}>
											{ attributes?.beforeUrl ? __( 'Replace First Image', 'jg-blocks' ) : __( 'Open Selector', 'jg-blocks' ) }
										</Button>
									)}
								/>
							</MediaUploadCheck>
						</div>
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={ "jg_blocks-before_after_slider_after_" + blockID } >Select Second Image</label>
							<MediaUploadCheck>
								<MediaUpload
									id={ "jg_blocks-before_after_slider_after_" + blockID }
									onSelect={onSelectAfter}
									allowedTypes={['image']}
									value={attributes?.afterId}
									render={({ open }) => (
										<Button onClick={open}>
											{ attributes?.afterUrl ? __( 'Replace Second Image', 'jg-blocks' ) : __( 'Open Selector', 'jg-blocks' ) }
										</Button>
									)}
								/>
							</MediaUploadCheck>
						</div>
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={"jg_blocks-before_after_slider_position_" + blockID} >Starting Slider Position</label>
							<input
								id={ "jg_blocks-before_after_slider_position_" + blockID }
								type="range"
								min={0}
								max={100}
								value={sliderPosition}
								onChange={(event) => {
									setAttributes({ sliderPosition: parseInt(event.target.value, 10) || 0 });
								}}
							/>
							<div style={{textAlign: "center"}}>{sliderPosition}%</div>
						</div>
					</div>
				</PanelBody>
			</InspectorControls>

			<div {...wrapperProps}>
				<div className="jg_blocks-before_after_slider_media jg_blocks-before_after_slider_before">
					{ attributes?.beforeUrl ? (
						<img
							className="jg_blocks-before_after_slider_image"
							src={attributes.beforeUrl}
							alt={attributes.beforeAlt}
						/>
					) : (
						<div className="jg_blocks-before_after_slider_placeholder">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={onSelectBefore}
									allowedTypes={['image']}
									value={attributes?.beforeId}
									render={({ open }) => (
										<Button onClick={open}>
											{ __( 'Select the first image.', 'jg-blocks' ) }
										</Button>
									)}
								/>
							</MediaUploadCheck>
						</div>
					) }
				</div>

				<div className="jg_blocks-before_after_slider_media jg_blocks-before_after_slider_after">
					{ attributes?.afterUrl ? (
						<img
							className="jg_blocks-before_after_slider_image"
							src={attributes.afterUrl}
							alt={attributes.afterAlt}
						/>
					) : (
						<div className="jg_blocks-before_after_slider_placeholder jg_blocks-before_after_slider_placeholder_after">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={onSelectAfter}
									allowedTypes={['image']}
									value={attributes?.afterId}
									render={({ open }) => (
										<Button onClick={open}>
											{ __( 'Select the second image.', 'jg-blocks' ) }
										</Button>
									)}
								/>
							</MediaUploadCheck>
						</div>
					) }
				</div>

				<div className="jg_blocks-before_after_slider_handle" aria-hidden="true">
					<span className="jg_blocks-before_after_slider_handle_line"></span>
					<span className="jg_blocks-before_after_slider_handle_knob">
						<span className="jg_blocks-before_after_slider_handle_arrows">‹ ›</span>
					</span>
				</div>

				{ attributes?.beforeUrl && attributes?.afterUrl ? (
					<input
						className="jg_blocks-before_after_slider_range"
						type="range"
						min={0}
						max={100}
						value={sliderPosition}
						aria-label={__( 'Starting slider position', 'jg-blocks' )}
						onChange={(event) => {
							setAttributes({ sliderPosition: parseInt(event.target.value, 10) || 0 });
						}}
					/>
				) : null }
			</div>
		</>
	);
}
