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
import { MediaUpload, MediaUploadCheck, RichText, InspectorControls, URLInputButton } from '@wordpress/block-editor';
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
	const wrapperProps = {...blockProps};
	wrapperProps.className += ' jg_blocks-hero_slideshow';
	wrapperProps.style.height = attributes?.height || '32rem';

	//extract button styles
	const buttonBg = attributes?.style?.elements?.button?.color.background || '#000000';
	const buttonText = attributes?.style?.elements?.button?.color.text || '#ffffff';
	const buttonProps = {
		className: '',
		style: {
			background: buttonBg,
			color: buttonText,
		}
	};

	//handle preset text color
	const textMatches = buttonText.match(/var:preset\|color\|([\w-]+)/);
	if(textMatches && textMatches.length > 0) {
		buttonProps.style.color = '';
		buttonProps.className += ' has-color';
		buttonProps.className += ' has-' + textMatches[1] + "-color";
	}

	//handle preset background color
	const bgMatches = buttonBg.match(/var:preset\|color\|([\w-]+)/);
	if (bgMatches && bgMatches.length > 0) {
		buttonProps.style.background = '';
		buttonProps.className += ' has-background';
		buttonProps.className += ' has-' + bgMatches[1] + "-background-color";
	}

	//create action button props
	const actionBtnProps = {
		...buttonProps
	}
	actionBtnProps.className += ' jg_blocks-hero_slideshow_action_button';

	//create arrow button props
	const arrowBtnProps = {
		...buttonProps
	}
	arrowBtnProps.className += ' jg_blocks-hero_slideshow_control';

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

	//track the last slide change button clicked
	const [lastSlideChange, setLastSlideChange] = useState('');

	function nextSlide() {
		setLastSlideChange('next');
		setSelectedSlide(selectedSlide + 1 < attributes?.slides.length ? selectedSlide + 1 : 0);
	}

	function prevSlide() {
		setLastSlideChange('prev');
		setSelectedSlide((selectedSlide - 1) >= 0 ? selectedSlide - 1 : attributes?.slides.length - 1);
	}

	//generate an id string for the instance of the block
	const blockID = blockProps.id

	console.log("attributes", attributes.slides);

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<div className="jg_blocks-inspector_inputs">
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={ "jg_blocks-hero_slideshow_images_" + blockID } >Select Slide Images</label>
							<MediaUploadCheck>
								<MediaUpload
									id={ "jg_blocks-hero_slideshow_images_" + blockID }
									onSelect={onSelectMedia}
									allowedTypes={['image']}
									value={attributes?.slides ? attributes?.slides.map((slide) => slide.id) : []}
									multiple
									gallery
									render={({ open }) => (
										<Button onClick={open}>
											Open Selector
										</Button>
									)}
								/>
							</MediaUploadCheck>
						</div>
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={"jg_blocks-hero_slideshow_height_" + blockID} >Height</label>
							<small>Note: will not exceed view height.</small>
							<input
								id={ "jg_blocks-hero_slideshow_height_" + blockID }
								type="range"
								min={24}
								max={256}
								value={attributes?.height.slice(0, -3) || 32}
								onChange={(event) => {
									setAttributes({ height: event.target.value.toString() + "rem" });
								}}
							/>
							<span>{attributes?.height.toString()|| "32rem"}</span>
						</div>
					</div>
				</PanelBody>
			</InspectorControls>
			<div {...wrapperProps}>
				<div className="jg_blocks-hero_slideshow_controls">
					<div
						{ ...arrowBtnProps }
						onClick={() => {
							prevSlide();
						}}
					>
						←
					</div>

					<div>
						
						<RichText
							tagName="p"
							className="jg_blocks-hero_slideshow_text"
							value={attributes?.slides[selectedSlide]?.content?.caption || "Put a descriptive slide caption here."}
							onChange={(value) => {
								const newSlides = [...attributes.slides];
								if (!newSlides[selectedSlide].content) {
									newSlides[selectedSlide].content = {};
								}
								newSlides[selectedSlide].content.caption = value;
								setAttributes({ slides: newSlides });
							}}
							placeholder={__("Put a descriptive slide caption here.", "hero-slideshow")}
						/>

						<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
							<div
								{ ...actionBtnProps }
							>
								<RichText
									tagName="p"
									className="jg_blocks-hero_slideshow_button_text"
									value={ attributes?.slides[selectedSlide]?.content?.buttonText || "Go!" }
									onChange={(value) => {
										console.log("go", value);
										const newSlides = [...attributes.slides];
										if (!newSlides[selectedSlide].content) {
											newSlides[selectedSlide].content = {};
										}
										newSlides[selectedSlide].content.buttonText = value;
										setAttributes({ slides: newSlides });
									}}
									placeholder={__("Put a button caption here.", "hero-slideshow-button")}
								/>
								
							</div>
						</div>
					</div>

					<span style={{ display: "none" }} >{ selectedSlide + 1 } / { attributes?.slides?.length }</span>
					<div
						{ ...arrowBtnProps }
						onClick={() => {
							nextSlide();
						}}
					>
						→
					</div>
				</div>
				{
					attributes?.slides && attributes?.slides?.length > 0 ? (
						attributes?.slides.map((slide, index) => (
							<div
								className={`jg_blocks-hero_slideshow_slide ${selectedSlide == index ? 'jg_blocks-hero_slideshow_selected_slide ' + (lastSlideChange == 'prev' ? 'jg_blocks-hero_slideshow_slide_left' : 'jg_blocks-hero_slideshow_slide_right') : 'jg_blocks-hidden'}`}
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
