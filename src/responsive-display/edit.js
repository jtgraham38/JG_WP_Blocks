/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

//my imports
import { Button, PanelBody } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit(
	{ attributes, setAttributes, clientId }
) {
	//persist a stable instance id so the match/unmatch class names stay unique
	useEffect(() => {
		if (!attributes.instanceId) {
			setAttributes({
				instanceId: clientId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
			});
		}
	}, [clientId]);

	//class names the inspector style boxes target
	const instanceId = attributes.instanceId || 'preview';
	const matchClass = 'jg_blocks-responsive_display_match-' + instanceId;
	const unmatchClass = 'jg_blocks-responsive_display_unmatch-' + instanceId;

	//get the block props
	const blockProps = useBlockProps();
	const wrapperProps = { ...blockProps };
	wrapperProps.className += ' jg_blocks-responsive_display is-editor';

	//sidebar switch to edit one inner area at a time, like the flip card
	const [editingAbove, setEditingAbove] = useState(false);
	if (editingAbove) {
		wrapperProps.className += ' is-editing-above';
	}

	//apply match styles while editing below, unmatch styles while editing above
	wrapperProps.className += editingAbove ? ' ' + unmatchClass : ' ' + matchClass;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Media Query', 'jg-blocks' ) } initialOpen={ true }>
					<div className="jg_blocks-inspector_inputs">
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={ "jg_blocks-responsive_display_query_" + instanceId } >Media query</label>
							<small>Below-query content shows when this matches. Above-query content shows when it does not.</small>
							<input
								id={ "jg_blocks-responsive_display_query_" + instanceId }
								type="text"
								value={attributes.mediaQuery || ''}
								placeholder="(max-width: 768px)"
								onChange={(event) => setAttributes({ mediaQuery: event.target.value })}
							/>
						</div>
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={ "jg_blocks-responsive_display_match_" + instanceId } >Styles when the query matches</label>
							<small>Targets <code>.{matchClass}</code></small>
							<textarea
								id={ "jg_blocks-responsive_display_match_" + instanceId }
								rows={8}
								value={attributes.matchStyles || ''}
								placeholder="display: block;"
								onChange={(event) => setAttributes({ matchStyles: event.target.value })}
							/>
						</div>
						<div className="jg_blocks-inspector_input_group">
							<label htmlFor={ "jg_blocks-responsive_display_unmatch_" + instanceId } >Styles when the query does not match</label>
							<small>Targets <code>.{unmatchClass}</code></small>
							<textarea
								id={ "jg_blocks-responsive_display_unmatch_" + instanceId }
								rows={8}
								value={attributes.unmatchStyles || ''}
								placeholder="display: none;"
								onChange={(event) => setAttributes({ unmatchStyles: event.target.value })}
							/>
						</div>
						<div className="jg_blocks-inspector_input_group">
							<Button
								variant="secondary"
								onClick={() => setEditingAbove(!editingAbove)}
							>
								{ editingAbove ? __( 'Edit Below', 'jg-blocks' ) : __( 'Edit Above', 'jg-blocks' ) }
							</Button>
						</div>
					</div>
				</PanelBody>
			</InspectorControls>

			<style>
				{`.${matchClass}{${attributes.matchStyles || ''}}`}
				{`.${unmatchClass}{${attributes.unmatchStyles || ''}}`}
			</style>

			<div {...wrapperProps}>
				<InnerBlocks
					template={ [
						[ 'core/group', {
							className: 'jg_blocks-responsive_display_below',
							lock: { move: true, remove: true },
						}, [
							[ 'core/paragraph', { placeholder: __( 'Content when the query matches (below)…', 'jg-blocks' ) } ],
						] ],
						[ 'core/group', {
							className: 'jg_blocks-responsive_display_above',
							lock: { move: true, remove: true },
						}, [
							[ 'core/paragraph', { placeholder: __( 'Content when the query does not match (above)…', 'jg-blocks' ) } ],
						] ],
					] }
					templateLock="all"
				/>
			</div>
		</>
	);
}
