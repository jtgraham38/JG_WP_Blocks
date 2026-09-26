<?php

//exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

//register shortcode
register_shortcode( 'slideshow_hero', 'jg_blocks_slideshow_hero_shortcode' );


//render shortcode
function jg_blocks_slideshow_hero_shortcode( $atts = array() ) {

    //shortcode parameters here
    if ( ! is_array( $atts ) ) {
        $atts = array();
    }

    //defaults match the block.json attributes
    $defaults = array(
        'slides'    => array(),
        'height'    => '32rem',
        'autoPlay'  => 5000,
        'textColor' => '#ffffff',
        'fontSize'  => 'x-large',
        'style'     => array(
            'elements' => array(
                'button' => array(
                    'color' => array(
                        'text'       => '#ffffff',
                        'background' => '#000000',
                    ),
                ),
            ),
        ),
    );

    //allow a full attributes payload (array from the block, or JSON from the shortcode)
    if ( isset( $atts['attributes'] ) && $atts['attributes'] !== '' && $atts['attributes'] !== array() ) {
        if ( is_string( $atts['attributes'] ) ) {
            $decoded = json_decode( html_entity_decode( $atts['attributes'], ENT_QUOTES ), true );
            if ( is_array( $decoded ) ) {
                $atts = array_merge( $atts, $decoded );
            }
        } elseif ( is_array( $atts['attributes'] ) ) {
            $atts = array_merge( $atts, $atts['attributes'] );
        }
        unset( $atts['attributes'] );
    }

    //WordPress lowercases shortcode attribute names; map them back to block keys
    if ( isset( $atts['autoplay'] ) && ! isset( $atts['autoPlay'] ) ) {
        $atts['autoPlay'] = $atts['autoplay'];
    }
    if ( isset( $atts['textcolor'] ) && ! isset( $atts['textColor'] ) ) {
        $atts['textColor'] = $atts['textcolor'];
    }
    if ( isset( $atts['fontsize'] ) && ! isset( $atts['fontSize'] ) ) {
        $atts['fontSize'] = $atts['fontsize'];
    }

    //decode JSON strings for complex attributes
    if ( isset( $atts['slides'] ) && is_string( $atts['slides'] ) ) {
        $decoded = json_decode( html_entity_decode( $atts['slides'], ENT_QUOTES ), true );
        $atts['slides'] = is_array( $decoded ) ? $decoded : array();
    }
    if ( isset( $atts['style'] ) && is_string( $atts['style'] ) ) {
        $decoded = json_decode( html_entity_decode( $atts['style'], ENT_QUOTES ), true );
        if ( is_array( $decoded ) ) {
            $atts['style'] = $decoded;
        }
    }

    //merge with defaults so $attributes matches the block render contract
    $attributes = wp_parse_args( $atts, $defaults );
    $attributes['autoPlay'] = intval( $attributes['autoPlay'] );

    //enqueue block frontend assets so this works without the block editor
    $block_type = WP_Block_Type_Registry::get_instance()->get_registered( 'jg-blocks/hero-slideshow' );
    if ( $block_type ) {
        $style_handles = ! empty( $block_type->style_handles ) ? $block_type->style_handles : (array) $block_type->style;
        foreach ( $style_handles as $handle ) {
            if ( $handle ) {
                wp_enqueue_style( $handle );
            }
        }
        if ( ! empty( $block_type->view_script_module_ids ) ) {
            foreach ( $block_type->view_script_module_ids as $module_id ) {
                wp_enqueue_script_module( $module_id );
            }
        }
    }

    ob_start();
    include 'render.php';
    return ob_get_clean();
}
