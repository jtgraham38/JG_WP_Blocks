<?php

//exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

//register shortcode
register_shortcode( 'slideshow_hero', 'jg_blocks_slideshow_hero_shortcode' );


//render shortcode
function jg_blocks_slideshow_hero_shortcode() {

    //shortcode parameters here
    //TODO

    ob_start();
    include 'render.php';
    return ob_get_clean();
}