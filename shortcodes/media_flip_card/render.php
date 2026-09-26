<?php

//exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use jtgraham38\jgwordpressstyle\BlockStyle;

//resolve display values for the front of the card
$media_url = $attributes['mediaUrl'] ?? '';
$media_alt = $attributes['mediaAlt'] ?? '';
$caption   = $attributes['caption'] ?? '';
$height    = $attributes['height'] ?? '20rem';

//use a style parser to get color and border values
$style = new BlockStyle($attributes);

//background color fills the back of the card
$bgColor = $style->bgColor();
$bgPresetClass = $bgColor->isPreset
    ? 'has-background has-' . $bgColor->value . '-background-color'
    : $style->presetVarToClass( (string) $bgColor->value, 'has-background has-', '-background-color' );

//text color is the base color on the back when child blocks do not set their own
$textColor = $style->textColor();
$textPresetClass = $textColor->isPreset
    ? 'has-text-color has-' . $textColor->value . '-color'
    : $style->presetVarToClass( (string) $textColor->value, 'has-text-color has-', '-color' );

//border props wrap both faces of the card
$borderWidth = $style->borderWidth()->value;
$borderRadius = $style->borderRadius();
$borderStyle = ! empty( $attributes['style']['border']['style'] ) ? $attributes['style']['border']['style'] : ( $borderWidth ? 'solid' : '' );
$borderColor = $style->borderColor();
$borderPresetClass = $borderColor->isPreset
    ? 'has-border-color has-' . $borderColor->value . '-border-color'
    : $style->presetVarToClass( (string) $borderColor->value, 'has-border-color has-', '-border-color' );

//linked radius is one value; unlinked radii are per-corner BlockStyleValues
$radiusStyles = array();
if ( is_array( $borderRadius ) ) {
    $cornerMap = array(
        'topLeft'     => 'border-top-left-radius',
        'topRight'    => 'border-top-right-radius',
        'bottomLeft'  => 'border-bottom-left-radius',
        'bottomRight' => 'border-bottom-right-radius',
    );
    foreach ( $cornerMap as $corner => $css_prop ) {
        if ( isset( $borderRadius[ $corner ] ) && is_object( $borderRadius[ $corner ] ) ) {
            $radiusStyles[ $css_prop ] = $borderRadius[ $corner ]->value;
        }
    }
} elseif ( is_object( $borderRadius ) ) {
    $radiusStyles['border-radius'] = $borderRadius->value;
}

//make back-face classes and styles
$backProps = array(
    'style' => array_merge(
        array(
            'background-color' => $bgPresetClass ? '' : $bgColor->value,
            'color' => $textPresetClass ? '' : $textColor->value,
            'border-width' => $borderWidth,
            'border-style' => $borderStyle,
            'border-color' => $borderPresetClass ? '' : $borderColor->value,
        ),
        $radiusStyles
    ),
    'class' => array(
        'jg_blocks-media_flip_card_face jg_blocks-media_flip_card_back',
        $bgPresetClass ? $bgPresetClass : '',
        $textPresetClass ? $textPresetClass : '',
        $borderPresetClass ? $borderPresetClass : '',
    ),
);

//make front-face border props so both sides share the same frame
$frontProps = array(
    'style' => array_merge(
        array(
            'border-width' => $borderWidth,
            'border-style' => $borderStyle,
            'border-color' => $borderPresetClass ? '' : $borderColor->value,
        ),
        $radiusStyles
    ),
    'class' => array(
        'jg_blocks-media_flip_card_face jg_blocks-media_flip_card_front',
        $borderPresetClass ? $borderPresetClass : '',
    ),
);

//convert the back style to a string
$backProps['style'] = implode('', array_map(function($v, $k) {
    if (empty($v)) return '';
    return $k . ':' . $v . ';';
}, $backProps['style'], array_keys($backProps['style'])));
//convert the back classes to a string
$backProps['class'] = implode(' ', array_filter($backProps['class']));

//convert the front style to a string
$frontProps['style'] = implode('', array_map(function($v, $k) {
    if (empty($v)) return '';
    return $k . ':' . $v . ';';
}, $frontProps['style'], array_keys($frontProps['style'])));
//convert the front classes to a string
$frontProps['class'] = implode(' ', array_filter($frontProps['class']));

?>

<div
    class="jg_blocks-media_flip_card"
    style="height: <?php echo esc_attr( $height ); ?>"
    tabindex="0"
>
    <div class="jg_blocks-media_flip_card_inner">
        <div
            class="<?php echo esc_attr( $frontProps['class'] ); ?>"
            style="<?php echo esc_attr( $frontProps['style'] ); ?>"
        >
            <?php if ( $media_url ) : ?>
                <img
                    class="jg_blocks-media_flip_card_image"
                    src="<?php echo esc_url( $media_url ); ?>"
                    alt="<?php echo esc_attr( $media_alt ); ?>"
                />
            <?php else : ?>
                <div class="jg_blocks-media_flip_card_placeholder">
                    <p><?php echo esc_html__( 'Select an image for this card.', 'jg-blocks' ); ?></p>
                </div>
            <?php endif; ?>

            <?php if ( $caption !== '' ) : ?>
                <p class="jg_blocks-media_flip_card_caption">
                    <?php echo esc_html( $caption ); ?>
                </p>
            <?php endif; ?>
        </div>

        <div
            class="<?php echo esc_attr( $backProps['class'] ); ?>"
            style="<?php echo esc_attr( $backProps['style'] ); ?>"
        >
            <div class="jg_blocks-media_flip_card_back_content">
                <?php echo $content ? wp_kses_post( $content ) : '<p>' . esc_html__( 'Add content to the back of this card.', 'jg-blocks' ) . '</p>'; ?>
            </div>
        </div>
    </div>
</div>
