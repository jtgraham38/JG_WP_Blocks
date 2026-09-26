<?php

//exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

//register shortcode
register_shortcode( 'media_flip_card', 'jg_blocks_media_flip_card_shortcode' );


//render shortcode
function jg_blocks_media_flip_card_shortcode( $atts = array(), $content = '' ) {

    //shortcode parameters here
    if ( ! is_array( $atts ) ) {
        $atts = array();
    }

    //defaults match the block.json attributes
    $defaults = array(
        'mediaId'         => 0,
        'mediaUrl'        => '',
        'mediaAlt'        => '',
        'caption'         => '',
        'height'          => '20rem',
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
    if ( isset( $atts['mediaid'] ) && ! isset( $atts['mediaId'] ) ) {
        $atts['mediaId'] = $atts['mediaid'];
    }
    if ( isset( $atts['id'] ) && empty( $atts['mediaId'] ) ) {
        $atts['mediaId'] = $atts['id'];
    }
    if ( isset( $atts['mediaurl'] ) && ! isset( $atts['mediaUrl'] ) ) {
        $atts['mediaUrl'] = $atts['mediaurl'];
    }
    if ( isset( $atts['mediaalt'] ) && ! isset( $atts['mediaAlt'] ) ) {
        $atts['mediaAlt'] = $atts['mediaalt'];
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
    $attributes['mediaId'] = intval( $attributes['mediaId'] );

    //resolve the image from an attachment ID when one was provided
    if ( $attributes['mediaId'] ) {
        $attachment_url = wp_get_attachment_url( $attributes['mediaId'] );
        if ( $attachment_url ) {
            $attributes['mediaUrl'] = $attachment_url;
        }
        if ( empty( $attributes['mediaAlt'] ) ) {
            $attributes['mediaAlt'] = (string) get_post_meta( $attributes['mediaId'], '_wp_attachment_image_alt', true );
        }
    }

    //inner/shortcode content fills the back of the card
    $content = is_string( $content ) ? $content : '';

    //enqueue block frontend assets so this works without the block editor
    $block_type = WP_Block_Type_Registry::get_instance()->get_registered( 'jg-blocks/media-flip-card' );
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
