<?php
//exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

//render this block through the shared shortcode
echo jg_blocks_before_after_slider_shortcode( $attributes );
