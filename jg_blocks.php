<?php
/**
 * Plugin Name:       JG Blocks
 * Description:       Custom blocks developed for JG Web Development.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            JG Web Development
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       jg-blocks
 *
 * @package CreateBlock
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
function jg_blocks_init() {
	register_block_type( __DIR__ . '/build/hero-slideshow' );
}
add_action( 'init', 'jg_blocks_init' );
