<?php

//exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

//register shortcode
register_shortcode( 'responsive_display', 'jg_blocks_responsive_display_shortcode' );


//render shortcode
function jg_blocks_responsive_display_shortcode( $atts = array(), $content = '' ) {

    //shortcode parameters here
    if ( ! is_array( $atts ) ) {
        $atts = array();
    }

    //defaults match the block.json attributes
    $defaults = array(
        'instanceId'     => '',
        'mediaQuery'     => '(max-width: 768px)',
        'matchStyles'    => '',
        'unmatchStyles'  => '',
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
    if ( isset( $atts['instanceid'] ) && ! isset( $atts['instanceId'] ) ) {
        $atts['instanceId'] = $atts['instanceid'];
    }
    if ( isset( $atts['mediaquery'] ) && ! isset( $atts['mediaQuery'] ) ) {
        $atts['mediaQuery'] = $atts['mediaquery'];
    }
    if ( isset( $atts['query'] ) && empty( $atts['mediaQuery'] ) ) {
        $atts['mediaQuery'] = $atts['query'];
    }
    if ( isset( $atts['matchstyles'] ) && ! isset( $atts['matchStyles'] ) ) {
        $atts['matchStyles'] = $atts['matchstyles'];
    }
    if ( isset( $atts['unmatchstyles'] ) && ! isset( $atts['unmatchStyles'] ) ) {
        $atts['unmatchStyles'] = $atts['unmatchstyles'];
    }

    //merge with defaults so $attributes matches the block render contract
    $attributes = wp_parse_args( $atts, $defaults );

    //inner/shortcode content fills the wrapper
    $content = is_string( $content ) ? $content : '';

    //enqueue block frontend assets so this works without the block editor
    $block_type = WP_Block_Type_Registry::get_instance()->get_registered( 'jg-blocks/responsive-display' );
    if ( $block_type ) {
        $style_handles = ! empty( $block_type->style_handles ) ? $block_type->style_handles : (array) $block_type->style;
        foreach ( $style_handles as $handle ) {
            if ( $handle ) {
                wp_enqueue_style( $handle );
            }
        }
        $script_handles = ! empty( $block_type->view_script_handles ) ? $block_type->view_script_handles : array();
        foreach ( $script_handles as $handle ) {
            if ( $handle ) {
                wp_enqueue_script( $handle );
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
