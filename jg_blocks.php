<?php
/**
 * Plugin Name:       JG Blocks
 * Description:       Custom blocks developed by JG Web Development.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.1
 * Author:            JG Web Development
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       jg-blocks
 *
 * @package JGBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Require Composer's autoload file
require_once plugin_dir_path(__FILE__) . 'vendor/autoload.php';
use jtgraham38\jgwordpressstyle\BlockStyle;

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function jgwebdev_blocks_init() {
	register_block_type( __DIR__ . '/build/hero-slideshow' );
	register_block_type( __DIR__ . '/build/media-flip-card' );
}
add_action( 'init', 'jgwebdev_blocks_init' );

//enable WordPress Styles-tab border controls even when the theme hides them
function jg_blocks_enable_editor_border_controls( $settings ) {
	$settings['__experimentalFeatures']['border']['color']  = true;
	$settings['__experimentalFeatures']['border']['radius'] = true;
	$settings['__experimentalFeatures']['border']['style']  = true;
	$settings['__experimentalFeatures']['border']['width']  = true;
	return $settings;
}
add_filter( 'block_editor_settings_all', 'jg_blocks_enable_editor_border_controls' );

//also expose those border tools through theme.json so the Styles tab can read them
function jg_blocks_enable_theme_json_border( $theme_json ) {
	return $theme_json->update_with(
		array(
			'version'  => 2,
			'settings' => array(
				'border' => array(
					'color'  => true,
					'radius' => true,
					'style'  => true,
					'width'  => true,
				),
			),
		)
	);
}
add_filter( 'wp_theme_json_data_theme', 'jg_blocks_enable_theme_json_border' );

//register shortcode helper used by all shortcode.php files
if ( ! function_exists( 'register_shortcode' ) ) {
	function register_shortcode( $tag, $callback ) {
		add_shortcode( 'jgwd_' . $tag, $callback );
	}
}

//load shortcodes
require_once __DIR__ . '/shortcodes/slideshow_hero/shortcode.php';
require_once __DIR__ . '/shortcodes/media_flip_card/shortcode.php';

