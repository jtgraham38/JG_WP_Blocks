<?php

use jtgraham38\jgwordpressstyle\BlockStyle;


//create the interactivity state
wp_interactivity_state('jg_blocks_hero_slideshow', array(
        'slides' => $attributes['slides'],
        'currentSlide' => 0,
        'autoPlay' => $attributes['autoPlay'],
    ),
);

//DEBUGGING
echo '<pre>';
//echo "\n==========================================";
//print_r(wp_interactivity_state('jg_blocks_hero_slideshow'));
echo '</pre>';

//use a style parser to get the button styles
$style = new BlockStyle($attributes);

//make button classes and styles
$btnProps = array(
    'style' => array(
        'background-color' => $style->btnBgColor()->isPreset ? '' : $style->btnBgColor()->value,
        'color' => $style->btnTextColor()->isPreset ? '' : $style->btnTextColor()->value,
    ),
    'class' => array(
        $style->btnBgColor()->isPreset ? $style->presetVarToClass( $style->btnBgColor()->value, 'has-background has-', '-background-color' ) : '',
        $style->btnTextColor()->isPreset ? $style->presetVarToClass( $style->btnTextColor()->value, 'has-text-color has-', '-color' ) : '',
    )
);

//convert the button style to a string
$btnProps['style'] = implode('', array_map(function($v, $k) {
    if (empty($v)) return '';
    return $k . ':' . $v . ';';
}, $btnProps['style'], array_keys($btnProps['style'])));
//convert the button classes to a string
$btnProps['class'] = implode(' ', $btnProps['class']);

//make the action button props
$actionBtnProps = $btnProps + array();  //copy
$actionBtnProps['class'] .= ' jg_blocks-hero_slideshow_control';

echo '<pre>';
print_r($actionBtnProps);
echo '</pre>';

?>

<div
    data-wp-interactive="jg_blocks_hero_slideshow"
    data-wp-init="actions.startAutoPlay"
    class="jg_blocks-hero_slideshow"
    style="height: <?php echo esc_attr( $attributes['height'] ?? '32rem' ); ?>"
>
    <div class="jg_blocks-hero_slideshow_controls">
        <button
            class="<?php echo esc_attr( $actionBtnProps['class'] ); ?>"
            style="<?php echo esc_attr( $actionBtnProps['style'] ); ?>"
            data-wp-on--click="actions.prevSlide"
        >
            ←
        </button>

        <span>
            Slide 
            <span
                data-wp-text="state.currentSlide"
            ></span> of <span data-wp-text="state.slides.length"></span>
        </span>
        
        <button
            class="<?php echo esc_attr( $actionBtnProps['class'] ); ?>"
            style="<?php echo esc_attr( $actionBtnProps['style'] ); ?>"
            data-wp-on--click="actions.nextSlide"
        >
            →
        </button>
    </div>
</div>
