<?php



wp_interactivity_state('jg_blocks_hero_slideshow', array(
        'slides' => $attributes['slides'],
        'currentSlide' => 0,
        'autoPlay' => $attributes['autoPlay'],
    ),
);

echo '<pre>';
print_r($attributes);
echo "\n==========================================";
print_r(wp_interactivity_state('jg_blocks_hero_slideshow'));
echo '</pre>';
?>

<div
    data-wp-interactive="jg_blocks_hero_slideshow"
    data-wp-init="actions.startAutoPlay"
    style="height: <?php echo esc_attr( $attributes['height'] ?? '32rem' ); ?>"
>

    <button
        data-wp-on--click="actions.prevSlide"
    >
        ←
    </button>
    
    <span>
        Slide 
        <span
            data-wp-text="state.currentSlide"
        ></span> of 3
    </span>
    
    <button
        data-wp-on--click="actions.nextSlide"
    >
        →
    </button>
</div>
