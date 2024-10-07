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
import { MediaUpload, MediaUploadCheck, RichText, InspectorControls } from '@wordpress/block-editor';
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
	{ attributes, setAttributes, isSelected }
) {
	//get the block props
	const blockProps = useBlockProps();

	//get all the non-style related block props for the wrapper
	const blockPropsNoStyle = {...blockProps};
	blockPropsNoStyle.className = blockPropsNoStyle.className.split(' ').filter( (className) => {
		return !className.startsWith('has-') && !className.startsWith('is-');
	}).join(' ');
	blockPropsNoStyle.className += ' jg_blocks-hero_slideshow';
	delete blockPropsNoStyle.style;

	//extract button styles
	const buttonStyles = {
		color: blockProps.style.color,
		backgroundColor: blockProps.style.backgroundColor,
	}

	//state var for which slide is selected
	const [selectedSlide, setSelectedSlide] = useState(0);

	// function to handle the media selection
    const onSelectMedia = (media) => {

		//construct media array
		const slides = [];
		media.map((media) => {
			media = {
				id: media.id,
				url: media.url,
				alt: media.alt,
			};
			slides.push(media);
		});

		setAttributes({
			slides: slides,
		});
	};

	//generate an id string for the instance of the block
	const blockID = Date.now();

	

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<div className="jg_blocks-inspector_inputs">
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={ "jg_blocks-hero_slideshow_height_" + blockID } >Height</label>
							<input
								id={ "jg_blocks-hero_slideshow_height_" + blockID }
								type="range"
								min={24}
								max={256}
								value={attributes?.height.substring(0, -3) || 32}
								onChange={(event) => {
									setAttributes({ height: event.target.value.toString() + "rem" });
								}}
							/>
						</div>
					</div>
				</PanelBody>
			</InspectorControls>
			<div { ...blockPropsNoStyle }>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={onSelectMedia}
						allowedTypes={['image']}
						value={attributes?.slides ? attributes?.slides.map((slide) => slide.id) : []}
						multiple
						gallery
						render={({ open }) => (
							<Button onClick={open}>
								{
									attributes?.slides && attributes?.slides?.length > 0 ?
									'' 
									: 
									(
										'Select Images'
									)
								}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				<br/>

				<div className="jg_blocks-hero_slideshow_controls">
					<div
						className="jg_blocks-hero_slideshow_control"
						style={ buttonStyles }
						onClick={() => {
							setSelectedSlide((selectedSlide - 1) >= 0 ? selectedSlide - 1 : attributes?.slides.length - 1);
						}}
					>
						←
					</div>

					<div>
						<RichText
							tagName="span"
							className="jg_blocks-hero_slideshow_title"
							value={attributes?.slides[selectedSlide]?.content?.title || "Slide Title"}
							onChange={(value) => {
								const newSlides = [...attributes.slides];
								if (!newSlides[selectedSlide].content) {
									newSlides[selectedSlide].content = {};
								}
								newSlides[selectedSlide].content.title = value;
								setAttributes({ slides: newSlides });
							}}
							placeholder={__("Slide Title", "hero-slideshow")}
						/>
						
						<RichText
							tagName="p"
							className="jg_blocks-hero_slideshow_text"
							value={attributes?.slides[selectedSlide]?.content?.text || "Put some descriptive slide text here."}
							onChange={(value) => {
								const newSlides = [...attributes.slides];
								if (!newSlides[selectedSlide].content) {
									newSlides[selectedSlide].content = {};
								}
								newSlides[selectedSlide].content.text = value;
								setAttributes({ slides: newSlides });
							}}
							placeholder={__("Put some descriptive slide text here.", "hero-slideshow")}
						/>

						<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
							<div
								className="jg_blocks-hero_slideshow_action_button"
								style={ buttonStyles }
							>
								{ attributes?.slides[selectedSlide]?.content?.buttonText || "Go!" }
							</div>
						</div>
					</div>

					<span style={{ display: "none" }} >{ selectedSlide + 1 } / { attributes?.slides?.length }</span>
					<div
						className="jg_blocks-hero_slideshow_control"
						style={ buttonStyles }
						onClick={() => {
							setSelectedSlide(selectedSlide + 1 < attributes?.slides.length ? selectedSlide + 1 : 0);
						}}
					>
						→
					</div>
				</div>


				<br/>

				{
					attributes?.slides && attributes?.slides?.length > 0 ? (
						attributes?.slides.map((slide, index) => (
							<div
								className={`jg_blocks-hero_slideshow_slide ${selectedSlide == index ? '' : 'jg_blocks-hidden'}`}
								key={index}
							>
								<img 
									className='jg_blocks-hero_slideshow_image'
									src={slide.url}
									alt={slide.alt} 
								/>
								{/* <pre>
									{
										JSON.stringify(slide, null, 2)
									}
								</pre> */}
							</div>
						))
					) : (
						<span>Add Images to the Slide Show</span>
					)
				}
			</div>
		</>
	);
}
