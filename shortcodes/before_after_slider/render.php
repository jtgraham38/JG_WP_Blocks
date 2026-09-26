<?php

//exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use jtgraham38\jgwordpressstyle\BlockStyle;

//resolve display values for the comparison frame
$before_url      = $attributes['beforeUrl'] ?? '';
$before_alt      = $attributes['beforeAlt'] ?? '';
$after_url       = $attributes['afterUrl'] ?? '';
$after_alt       = $attributes['afterAlt'] ?? '';
$height          = $attributes['height'] ?? '24rem';
$slider_position = isset( $attributes['sliderPosition'] ) ? intval( $attributes['sliderPosition'] ) : 50;
$slider_position = max( 0, min( 100, $slider_position ) );

//use a style parser to get color and border values
$style = new BlockStyle($attributes);

//background color fills the slider button only
$bgColor = $style->bgColor();
$bgPresetSlug = $bgColor->isPreset
    ? $bgColor->value
    : $style->presetVarToClass( (string) $bgColor->value, '', '' );
$buttonColor = $bgPresetSlug
    ? 'var(--wp--preset--color--' . $bgPresetSlug . ')'
    : $bgColor->value;

//text color tints the handle icon
$textColor = $style->textColor();
$textPresetSlug = $textColor->isPreset
    ? $textColor->value
    : $style->presetVarToClass( (string) $textColor->value, '', '' );
$iconColor = $textPresetSlug
    ? 'var(--wp--preset--color--' . $textPresetSlug . ')'
    : $textColor->value;

//border color tints the divider line
$borderWidth = $style->borderWidth()->value;
$borderRadius = $style->borderRadius();
$borderStyle = ! empty( $attributes['style']['border']['style'] ) ? $attributes['style']['border']['style'] : ( $borderWidth ? 'solid' : '' );
$borderColor = $style->borderColor();
$borderPresetSlug = $borderColor->isPreset
    ? $borderColor->value
    : $style->presetVarToClass( (string) $borderColor->value, '', '' );
$borderColorValue = $borderPresetSlug
    ? 'var(--wp--preset--color--' . $borderPresetSlug . ')'
    : $borderColor->value;

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

//make wrapper classes and styles
$wrapperProps = array(
    'style' => array_merge(
        array(
            'height' => $height,
            '--slider-position' => $slider_position . '%',
            '--slider-button-color' => $buttonColor,
            '--slider-icon-color' => $iconColor,
            '--slider-border-color' => $borderColorValue,
            'border-width' => $borderWidth,
            'border-style' => $borderStyle,
            'border-color' => $borderColorValue,
        ),
        $radiusStyles
    ),
    'class' => array(
        'jg_blocks-before_after_slider',
    ),
);

//convert the wrapper style to a string
$wrapperProps['style'] = implode('', array_map(function($v, $k) {
    if (empty($v) && $v !== '0' && $v !== 0) return '';
    return $k . ':' . $v . ';';
}, $wrapperProps['style'], array_keys($wrapperProps['style'])));
//convert the wrapper classes to a string
$wrapperProps['class'] = implode(' ', array_filter($wrapperProps['class']));

?>

<div
    class="<?php echo esc_attr( $wrapperProps['class'] ); ?>"
    style="<?php echo esc_attr( $wrapperProps['style'] ); ?>"
>
    <div class="jg_blocks-before_after_slider_media jg_blocks-before_after_slider_before">
        <?php if ( $before_url ) : ?>
            <img
                class="jg_blocks-before_after_slider_image"
                src="<?php echo esc_url( $before_url ); ?>"
                alt="<?php echo esc_attr( $before_alt ); ?>"
            />
        <?php else : ?>
            <div class="jg_blocks-before_after_slider_placeholder">
                <p><?php echo esc_html__( 'Select the first image.', 'jg-blocks' ); ?></p>
            </div>
        <?php endif; ?>
    </div>

    <div class="jg_blocks-before_after_slider_media jg_blocks-before_after_slider_after">
        <?php if ( $after_url ) : ?>
            <img
                class="jg_blocks-before_after_slider_image"
                src="<?php echo esc_url( $after_url ); ?>"
                alt="<?php echo esc_attr( $after_alt ); ?>"
            />
        <?php else : ?>
            <div class="jg_blocks-before_after_slider_placeholder jg_blocks-before_after_slider_placeholder_after">
                <p><?php echo esc_html__( 'Select the second image.', 'jg-blocks' ); ?></p>
            </div>
        <?php endif; ?>
    </div>

    <div
        class="jg_blocks-before_after_slider_handle"
        aria-hidden="true"
    >
        <span class="jg_blocks-before_after_slider_handle_line"></span>
        <span class="jg_blocks-before_after_slider_handle_knob">
            <span class="jg_blocks-before_after_slider_handle_arrows">‹ ›</span>
        </span>
    </div>

    <input
        class="jg_blocks-before_after_slider_range"
        type="range"
        min="0"
        max="100"
        value="<?php echo esc_attr( $slider_position ); ?>"
        aria-label="<?php echo esc_attr__( 'Comparison slider', 'jg-blocks' ); ?>"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="<?php echo esc_attr( $slider_position ); ?>"
    />
</div>
