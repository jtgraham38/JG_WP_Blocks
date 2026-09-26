<?php

//exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

//register shortcode
register_shortcode( 'before_after_slider', 'jg_blocks_before_after_slider_shortcode' );


//render shortcode
function jg_blocks_before_after_slider_shortcode( $atts = array() ) {

    //shortcode parameters here
    if ( ! is_array( $atts ) ) {
        $atts = array();
    }

    //defaults match the block.json attributes
    $defaults = array(
        'beforeId'        => 0,
        'beforeUrl'       => '',
        'beforeAlt'       => '',
        'afterId'         => 0,
        'afterUrl'        => '',
        'afterAlt'        => '',
        'sliderPosition'  => 50,
        'height'          => '24rem',
        'textColor'       => '',
        'backgroundColor' => '',
        'borderColor'     => '',
        'style'           => array(),
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
    if ( isset( $atts['beforeid'] ) && ! isset( $atts['beforeId'] ) ) {
        $atts['beforeId'] = $atts['beforeid'];
    }
    if ( isset( $atts['afterid'] ) && ! isset( $atts['afterId'] ) ) {
        $atts['afterId'] = $atts['afterid'];
    }
    if ( isset( $atts['beforeurl'] ) && ! isset( $atts['beforeUrl'] ) ) {
        $atts['beforeUrl'] = $atts['beforeurl'];
    }
    if ( isset( $atts['afterurl'] ) && ! isset( $atts['afterUrl'] ) ) {
        $atts['afterUrl'] = $atts['afterurl'];
    }
    if ( isset( $atts['beforealt'] ) && ! isset( $atts['beforeAlt'] ) ) {
        $atts['beforeAlt'] = $atts['beforealt'];
    }
    if ( isset( $atts['afteralt'] ) && ! isset( $atts['afterAlt'] ) ) {
        $atts['afterAlt'] = $atts['afteralt'];
    }
    if ( isset( $atts['sliderposition'] ) && ! isset( $atts['sliderPosition'] ) ) {
        $atts['sliderPosition'] = $atts['sliderposition'];
    }
    if ( isset( $atts['position'] ) && empty( $atts['sliderPosition'] ) && $atts['position'] !== '' ) {
        $atts['sliderPosition'] = $atts['position'];
    }
    if ( isset( $atts['textcolor'] ) && ! isset( $atts['textColor'] ) ) {
        $atts['textColor'] = $atts['textcolor'];
    }
    if ( isset( $atts['backgroundcolor'] ) && ! isset( $atts['backgroundColor'] ) ) {
        $atts['backgroundColor'] = $atts['backgroundcolor'];
    }
    if ( isset( $atts['bordercolor'] ) && ! isset( $atts['borderColor'] ) ) {
        $atts['borderColor'] = $atts['bordercolor'];
    }

    //decode JSON strings for the style object
    if ( isset( $atts['style'] ) && is_string( $atts['style'] ) ) {
        $decoded = json_decode( html_entity_decode( $atts['style'], ENT_QUOTES ), true );
        if ( is_array( $decoded ) ) {
            $atts['style'] = $decoded;
        }
    }

    //merge with defaults so $attributes matches the block render contract
    $attributes = wp_parse_args( $atts, $defaults );
    $attributes['beforeId'] = intval( $attributes['beforeId'] );
    $attributes['afterId'] = intval( $attributes['afterId'] );
    $attributes['sliderPosition'] = max( 0, min( 100, intval( $attributes['sliderPosition'] ) ) );

    //resolve the first image from an attachment ID when one was provided
    if ( $attributes['beforeId'] ) {
        $attachment_url = wp_get_attachment_url( $attributes['beforeId'] );
        if ( $attachment_url ) {
            $attributes['beforeUrl'] = $attachment_url;
        }
        if ( empty( $attributes['beforeAlt'] ) ) {
            $attributes['beforeAlt'] = (string) get_post_meta( $attributes['beforeId'], '_wp_attachment_image_alt', true );
        }
    }

    //resolve the second image from an attachment ID when one was provided
    if ( $attributes['afterId'] ) {
        $attachment_url = wp_get_attachment_url( $attributes['afterId'] );
        if ( $attachment_url ) {
            $attributes['afterUrl'] = $attachment_url;
        }
        if ( empty( $attributes['afterAlt'] ) ) {
            $attributes['afterAlt'] = (string) get_post_meta( $attributes['afterId'], '_wp_attachment_image_alt', true );
        }
    }

    //enqueue block frontend assets so this works without the block editor
    $block_type = WP_Block_Type_Registry::get_instance()->get_registered( 'jg-blocks/before-after-slider' );
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
