<?php

use jtgraham38\jgwordpressstyle\BlockStyle;


//create the interactivity state

//DEBUGGING
// echo '<pre>';
// echo "\n==========================================";
// print_r($state);
// echo '</pre>';

//use a style parser to get the button styles
$style = new BlockStyle($attributes);

//make button classes and styles
$btnProps = array(
    'style' => array(
        'background-color' => $style->btnBgColor()->isPreset ? '' : $style->btnBgColor()->value,
        'color' => $style->btnTextColor()->isPreset ? '' : $style->btnTextColor()->value,
        'font-size' => $style->fontSize()->isPreset ? '' : $style->fontSize()->value,
    ),
    'class' => array(
        $style->btnBgColor()->isPreset ? $style->presetVarToClass( $style->btnBgColor()->value, 'has-background has-', '-background-color' ) : '',
        $style->btnTextColor()->isPreset ? $style->presetVarToClass( $style->btnTextColor()->value, 'has-text-color has-', '-color' ) : '',
        $style->fontSize()->isPreset ? 'has-font-size has-' . $style->fontSize()->value . '-font-size'  : '',
    )
);


//convert the button style to a string
$btnProps['style'] = implode('', array_map(function($v, $k) {
    if (empty($v)) return '';
    return $k . ':' . $v . ';';
}, $btnProps['style'], array_keys($btnProps['style'])));
//convert the button classes to a string
$btnProps['class'] = implode(' ', $btnProps['class']);
$btnProps['class'] .= ' wp-element-button';

//make the arrow button props
$arrowBtnProps = $btnProps + array();  //copy
$arrowBtnProps['class'] .= ' jg_blocks-hero_slideshow_control';

//make the action button props
$actionBtnProps = $btnProps + array();  //copy
$actionBtnProps['class'] .= ' jg_blocks-hero_slideshow_action_button wp-element-button';

//make the caption props
$captionProps = array(
    'style' => array(
        'color' => $style->textColor()->isPreset ? '' : $style->textColor()->value,
        'font-size' => $style->fontSize()->isPreset ? '' : $style->fontSize()->value,
    ),
    'class' => array(
        $style->fontSize()->isPreset ? 'has-font-size has-' . $style->fontSize()->value . '-font-size'  : '',
        $style->textColor()->isPreset ? 'has-text-color has-' . $style->textColor()->value . '-color' : '',
    )
);
$captionProps['style'] = implode('', array_map(function($v, $k) {
    if (empty($v)) return '';
    return $k . ':' . $v . ';';
}, $captionProps['style'], array_keys($captionProps['style'])));
$captionProps['class'] = implode(' ', $captionProps['class']);
$captionProps['class'] .= ' jg_blocks-hero_slideshow_text';

?>

<div
    data-wp-interactive="jg_blocks_hero_slideshow"
    data-wp-context="<?php echo esc_attr( json_encode( array(
        'slides' => $attributes['slides'],
        'currentSlide' => 0,
        'autoPlay' => $attributes['autoPlay'],
    ) ) ); ?>"
    
    data-wp-init="callbacks.init"
    class="jg_blocks-hero_slideshow"
    style="height: <?php echo esc_attr( $attributes['height'] ?? '32rem' ); ?>"
>

    <div class="jg_blocks-hero_slideshow_controls">
        <button
            class="<?php echo esc_attr( $arrowBtnProps['class'] ); ?>"
            style="<?php echo esc_attr( $arrowBtnProps['style'] ); ?>"
            data-wp-on--click="actions.prevSlide"
        >
            ←
        </button>
        
        <button
            class="<?php echo esc_attr( $arrowBtnProps['class'] ); ?>"
            style="<?php echo esc_attr( $arrowBtnProps['style'] ); ?>"
            data-wp-on--click="actions.nextSlide"
        >
            →
        </button>
    </div>

    <?php 
        if (!empty($attributes['slides'])):
            $loopIndex = 0;
            foreach ($attributes['slides'] as $slide): 
    ?>  
        <div
            class="jg_blocks-hero_slideshow_slide <?php echo $loopIndex != 0 ? esc_attr('jg_blocks-hidden') : '' ?>"
        >
            <img
                class='jg_blocks-hero_slideshow_image'
                src="<?php echo esc_url( wp_get_attachment_url( $slide['id'] ?? $slide['url'] ) ); ?>"
                alt="<?php echo esc_attr( get_post_meta( $slide['id'], '_wp_attachment_image_alt', true ) ?? $slide['alt'] ); ?>"
            />
            <div class='jg_blocks-hero_slideshow_slide_content'>
                <div class='jg_blocks-hero_slideshow_slide_spacer'></div>

                <div class="jg_blocks-hero_slideshow_expand">
                    <p 
                        class="<?php echo esc_attr( $captionProps['class'] ); ?>"
                        style="<?php echo esc_attr( $captionProps['style'] ); ?>"
                    >
                        <?php echo esc_html( $slide['content']['caption'] ?? 'Put a descriptive slide caption here.' ); ?>
                    </p>
                            
                    <div 
                        style="display: flex; justify-content: center; align-items: center; width: 100%;"
                    >
                        <?php if (!empty($slide['content']['buttonText'])): ?>
                            <button
                                class="<?php echo esc_attr( $actionBtnProps['class'] ); ?>"
                                style="<?php echo esc_attr( $actionBtnProps['style'] ); ?>"
                            >
                                <p class="jg_blocks-hero_slideshow_button_text">
                                    <?php echo wp_kses( $slide['content']['buttonText'] ?? 'Go!', [
                                        'a' => [
                                            'href' => [],
                                            'target' => [],
                                            'rel' => [],
                                        ],
                                        'strong' => [],
                                        'em' => [],
                                    ] ); ?>
                                </p>
                            </button>
                        <?php endif; ?>
                    </div>
                </div>

                <div class='jg_blocks-hero_slideshow_slide_spacer'></div>

            </div>
        </div>
    <?php 
    $loopIndex++;
    endforeach; 
    else:
    ?>
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
            <p>There are no slides to display.</p>
        </div>
    <?php endif; ?>
</div>
