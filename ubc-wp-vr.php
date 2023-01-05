<?php
/**
 * Plugin Name:       VRPress
 * Description:       Create 360 virtual tours using images of your own or Google Streetview images.
 * Version:           1.2.0
 * Author:            Kelvin Xu(CTLT)
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       ubc-vrpress
 *
 * @package ubc-vrpress
 */

namespace UBC\VRPRESS;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

define( 'UBC_VRPRESS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'UBC_VRPRESS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Initialization of the plugin
 *
 * @since    1.0.0
 */
function init() {
	require_once UBC_VRPRESS_PLUGIN_DIR . 'includes/class-helper.php';
	require_once UBC_VRPRESS_PLUGIN_DIR . 'includes/documentation.php';
	require_once UBC_VRPRESS_PLUGIN_DIR . 'includes/class-vrpress.php';
	require_once UBC_VRPRESS_PLUGIN_DIR . 'includes/class-vrpressblock.php';

	new \UBC\VRPRESS( 'ubcvrpress' );
	new \UBC\VRPRESSBlock( 'ubcvrpress' );
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\init' );
