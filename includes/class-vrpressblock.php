<?php
/**
 * UBC VRPress Block class
 *
 * @since 1.0.0
 * @package vrpress
 */

namespace UBC;

use \UBC\VRPRESS\Helper as Helper;

/**
 * Class to initiate VRPress Block functionalities
 */
class VRPressBlock {

	/**
	 * The post type of this plugin to register.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	private $post_type;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 1.0.0
	 * @param string $post_type name of the plugin post_type.
	 */
	public function __construct( $post_type ) {
		$this->post_type = $post_type;

		$this->setup_hooks();
	}

	/**
	 * Setup class hooks.
	 *
	 * @return void
	 */
	private function setup_hooks() {
		add_action( 'init', array( $this, 'load_block_assets' ) );
	}

	/**
	 * Load assets required by VRPres Block. Javascript and CSS.
	 * Enqueue to editor only.
	 *
	 * @return void
	 */
	public function load_block_assets() {
		wp_register_script(
			'ubc-vrpress-block-editor-script',
			UBC_VRPRESS_PLUGIN_URL . 'assets/dist/js/block-editor.js',
			array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components' ),
			filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/js/block-editor.js' ),
			true
		);

		wp_localize_script(
			'ubc-vrpress-block-editor-script',
			'ubc_vrpress_editor',
			array(
				'site_address' => get_site_url(
					null,
					'',
					is_ssl() ? 'https' : 'http'
				),
			)
		);

		wp_register_style(
			'ubc-vrpress-block-editor-style',
			UBC_VRPRESS_PLUGIN_URL . 'assets/dist/css/block-editor.css',
			array( 'wp-edit-blocks' ),
			filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/css/block-editor.css' )
		);

		wp_register_style(
			'ubc-vrpress-block-style',
			UBC_VRPRESS_PLUGIN_URL . 'assets/dist/css/block-frontend.css',
			array(),
			filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/css/block-frontend.css' )
		);

		/**
		 * Register VRPress Block
		 */
		register_block_type(
			'ubc/vrpress',
			array(
				'style'           => 'ubc-vrpress-block-style',
				'editor_style'    => 'ubc-vrpress-block-editor-style',
				'editor_script'   => 'ubc-vrpress-block-editor-script',
				'render_callback' => array( $this, 'render_vr_block' ),
				'attributes'      => array(
					'postID' => array(
						'type'    => 'number',
						'default' => -1,
					),
					'width'  => array(
						'type'    => 'number',
						'default' => 600,
					),
					'height' => array(
						'type'    => 'number',
						'default' => 600,
					),
				),
			)
		);

		/**
		 * Register VRPress Map Block
		 * Render google map associated with google streetview.
		 */
		register_block_type(
			'ubc/vrpress-map',
			array(
				'render_callback' => array( $this, 'render_map_block' ),
				'attributes'      => array(
					'postID' => array(
						'type'    => 'number',
						'default' => -1,
					),
					'width'  => array(
						'type'    => 'number',
						'default' => 600,
					),
					'height' => array(
						'type'    => 'number',
						'default' => 600,
					),
				),
			)
		);
	}

	/**
	 * Server rendering VR block content.
	 *
	 * @param array $attributes shortcode attributes provided by user.
	 * @return HTML
	 */
	public function render_vr_block( $attributes ) {
		$width  = esc_attr( $attributes['width'] );
		$height = esc_attr( $attributes['height'] );

		return isset( $attributes['postID'] ) && -1 !== $attributes['postID'] ? do_shortcode(
			sprintf(
				'[vrpress id="%1$s" width="%2$s" height="%3$s"]',
				(int) $attributes['postID'],
				$width,
				$height
			)
		) : '';
	}

	/**
	 * Server rendering google map block content.
	 *
	 * @param array $attributes shortcode attributes provided by user.
	 * @return HTML
	 */
	public function render_map_block( $attributes ) {
		$width  = esc_attr( $attributes['width'] );
		$height = esc_attr( $attributes['height'] );

		return isset( $attributes['postID'] ) && -1 !== $attributes['postID'] ? do_shortcode(
			sprintf(
				'[vrpress_map id="%1$s" width="%2$s" height="%3$s"]',
				(int) $attributes['postID'],
				$width,
				$height
			)
		) : '';
	}

}
