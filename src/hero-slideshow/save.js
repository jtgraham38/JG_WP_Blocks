/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save(
	{ attributes }
) {

	//get the block props
	const blockProps = useBlockProps();

	//get all the non-style related block props for the wrapper
	const wrapperProps = {...blockProps};
	wrapperProps.className += ' jg_blocks-hero_slideshow';
	wrapperProps.style.height = attributes?.height || '32rem';

	//extract button styles
	const buttonBg = attributes?.style?.elements?.button?.color?.background || '#000000';
	const buttonText = attributes?.style?.elements?.button?.color?.text || '#ffffff';
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

	//generate an id string for the instance of the block
	const blockID = blockProps.id
	console.log("SAVED!")

	return (
		<>
			<div {...wrapperProps}>
				<div className="jg_blocks-hero_slideshow_controls">
					<div
						{ ...arrowBtnProps }
						onClick={() => {
							//go to previous slide
						}}
					>
						←
					</div>
					
					<div
						{ ...arrowBtnProps }
						onClick={() => {
							//go to next slide
						}}
					>
						→
					</div>
				</div>
				{
					attributes?.slides && attributes?.slides?.length > 0 ? (
						attributes?.slides.map((slide, index) => (
							<div
								className={`jg_blocks-hero_slideshow_slide`}
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
								<div className='jg_blocks-hero_slideshow_slide_content'>
						
									<p
										tagName="p"
										className="jg_blocks-hero_slideshow_text"
									>
										{slide?.content?.caption || "Put a descriptive slide caption here."}
									</p>

									<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
										<div
											{ ...actionBtnProps }
										>
											<p
												className="jg_blocks-hero_slideshow_button_text"
											>
												{slide?.content?.buttonText || "Go!"}
											</p>
											
										</div>
									</div>

								</div>
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
