<?php
/**
 * VRPress class instantiate core VRPress functionality
 *
 * @since 1.0.0
 * @package vrpress
 */

namespace UBC;

use \UBC\VRPRESS\Helper as Helper;

/**
 * Class to initiate VRPress functionalities
 */
class VRPress {

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
	 * @since    1.0.0
	 * @param string $post_type name of the plugin post_type.
	 */
	public function __construct( $post_type ) {
		$this->post_type = $post_type;

		// Hotspot Icons.
		$this->street_view_icons = array(
			'markerDefault' => 'http://maps.gstatic.com/mapfiles/markers2/icon_green.png',
			'marker'        => 'http://maps.gstatic.com/mapfiles/markers2/marker.png',
		);

		$this->setup_hooks();
		$this->setup_ajax();
		$this->setup_shortcode();
	}

	/**
	 * Setup class hooks.
	 *
	 * @return void
	 */
	private function setup_hooks() {
		add_action( 'init', array( $this, 'add_plugin_custom_post_type' ) );
		add_action( 'add_meta_boxes', array( $this, 'add_metabox' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'metabox_enqueue_scripts' ), 10, 1 );
		add_action( 'save_post', array( $this, 'post_save' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_scripts' ) );
		add_action( 'admin_menu', array( $this, 'add_plugin_submenus' ) );
		add_action( 'admin_init', array( $this, 'register_plugin_settings' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_field' ) );
		add_filter( 'single_template', array( $this, 'render_vr_single_template' ), 10 );
	}//end setup_hooks()

	/**
	 * Setup plugin shortcodes.
	 *
	 * @return void
	 */
	private function setup_shortcode() {
		add_shortcode( 'vrpress', array( $this, 'add_vr_shortcode' ) );
		add_shortcode( 'vrpress_map', array( $this, 'add_map_shortcode' ) );
	}//end setup_shortcode()

	/**
	 * Setup ajax handlers.
	 *
	 * @return void
	 */
	private function setup_ajax() {
		add_action( 'wp_ajax_ubc_vrpress_get_oembed', array( $this, 'get_oembed' ) );
	}//end setup_ajax()

	/**
	 * Register custom post type for the plugin. The custom post type is also available in rest API.
	 *
	 * @return void
	 */
	public function add_plugin_custom_post_type() {

		$labels = array(
			'name'               => __( 'Tours', 'vrpress' ),
			'singular_name'      => __( 'Tours', 'vrpress' ),
			'add_new'            => __( 'Add New Tour', 'vrpress' ),
			'add_new_item'       => __( 'Add New Tour', 'vrpress' ),
			'edit_item'          => __( 'Edit Tour', 'vrpress' ),
			'new_item'           => __( 'New Tour', 'vrpress' ),
			'view_item'          => __( 'View Tour', 'vrpress' ),
			'search_items'       => __( 'Search Tour', 'vrpress' ),
			'not_found'          => __( 'No Tour found', 'vrpress' ),
			'not_found_in_trash' => __( 'No Tour found in Trash', 'vrpress' ),
			'parent_item_colon'  => '',
			'all_items'          => __( 'All Tours', 'vrpress' ),
			'menu_name'          => __( 'VRPress', 'vrpress' ),
		);

		$args = array(
			'labels'        => $labels,
			'public'        => true,
			'show_ui'       => true,
			'show_in_menu'  => true,
			'menu_position' => 100,
			'supports'      => array( 'title' ),
			'menu_icon'     => null,
			'map_meta_cap'  => true,
			'show_in_rest'  => true,
		);

		register_post_type( $this->post_type, $args );
	}//end add_plugin_custom_post_type()

	/**
	 * Register additional field to the VR post type rest API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_field() {
		register_rest_field(
			$this->post_type,
			'ubc_vr_type',
			array(
				'get_callback' => function( $attr ) {
					$vr_type = sanitize_text_field( get_post_meta( $attr['id'], 'ubc_vr_type', true ) );
					return $vr_type;
				},
			)
		);
	}//end register_rest_field()

	/**
	 * Add metabox to VR post type admin edit screen.
	 *
	 * @return void
	 */
	public function add_metabox() {
		$screens = array( $this->post_type );
		foreach ( $screens as $screen ) {

			// Metabox which renders tour config and settings.
			add_meta_box(
				'ubc_vrpress_metabox',
				__( 'Tour Settings', 'vrpress' ),
				array( $this, 'metabox_content' ),
				$screen
			);

			// Metabox which renders preview frame.
			add_meta_box(
				'ubc_vrpress_metabox_preview',
				__( 'Preview', 'vrpress' ),
				array( $this, 'metabox_preview' ),
				$screen,
				'side',
				'low'
			);

			// Metabox which presents tour settings.
			add_meta_box(
				'ubc_vrpress_metabox_settings',
				__( 'Settings', 'vrpress' ),
				array( $this, 'metabox_settings' ),
				$screen,
				'side',
				'low'
			);

			// Metabox which presents shortcodes for user to copy.
			add_meta_box(
				'ubc_vrpress_metabox_shortcode',
				__( 'Shortcode' ),
				array( $this, 'metabox_shortcode' ),
				$screen,
				'side',
				'low'
			);

			// Metabox which presents embed code.
			add_meta_box(
				'ubc_vrpress_metabox_embed',
				__( 'Embed' ),
				array( $this, 'metabox_embed' ),
				$screen,
				'side',
				'low'
			);
		}
	}//end add_metabox()

	/**
	 * Render contents to tour config and settings metabox.
	 *
	 * @param WP_POST $post current $post object.
	 * @return void
	 */
	public function metabox_content( $post ) {
		do_action( 'ubc_vrpress_single_tour_admin_metabox_before' );
		?>
			<div id="ubc-vrpress-single-tour-admin-metabox"></div>
		<?php
	}//end metabox_content()

	/**
	 * Render contents to preview metabox.
	 *
	 * @param WP_POST $post current post object.
	 * @return void
	 */
	public function metabox_preview( $post ) {
		?>
			<div id="panorama-preview"></div>
			<div id="panorama-preview-buttons"></div>
		<?php
	}//end metabox_preview()

	/**
	 * Render contents to settings metabox.
	 *
	 * @param WP_POST $post current post object.
	 * @return void
	 */
	public function metabox_settings( $post ) {
		?>
			<div id="panorama-settings"></div>
		<?php
	}

	/**
	 * Render contents to shortcode metabox.
	 *
	 * @param WP_POST $post Post object attach to current screen.
	 * @return void
	 */
	public function metabox_shortcode( $post ) {
		?>
			<div class="metabox_shortcode">
				<p><?php echo esc_textarea( __( 'To use this panorama in your content, copy the shortcode below into your post page', 'vrpress' ) ); ?>. <br /><span class="text-to-copy">[vrpress id="<?php echo esc_attr( $post->ID ); ?>"]</span><br /><button class="shortcode-copy button button-secondary button-large"><?php echo esc_html( __( 'copy' ) ); ?></button></p>
				<p><?php echo esc_textarea( __( 'If the panorama is using google streetview, you can use below shortcode to render the google map associated with it', 'vrpress' ) ); ?>.<br /><span class="text-to-copy">[vrpress_map id="<?php echo esc_attr( $post->ID ); ?>"]</span><br /><button class="shortcode-copy button button-secondary button-large"><?php echo esc_html( __( 'copy' ) ); ?></button></p>
			</div>

			<script>
				(function($) {

					$( document ).ready(function() {
						$( '.shortcode-copy' ).on( 'click', function( e ) {
							e.preventDefault();
							var copyText = $( this ).parent().find( '.text-to-copy' );
							copyToClipboard(  copyText );
							alert( 'copied' );
						} );
					});

					function copyToClipboard( element ) {
						var $temp = $("<input>");
						$("body").append($temp);
						$temp.val($(element).text()).select();
						document.execCommand("copy");
						$temp.remove();
					}

				})( jQuery );
			</script>
		<?php
	}//end metabox_shortcode()

	/**
	 * Render contents to embed code metabox.
	 *
	 * @param [Post] $post Post object attach to current screen.
	 * @return void
	 */
	public function metabox_embed( $post ) {
		?>
			<div class="metabox_shortcode">
				<p><?php echo esc_textarea( __( 'Get embed code for the tour', 'vrpress' ) ); ?>.<br />
				<span>
					<code class="text-to-copy">
						<?php
							echo esc_html(
								'<iframe src="' . $post->guid . '" frameborder="0" width="600" height="600"></iframe>'
							);
						?>
					</code>
				</span>
				<br /><button class="shortcode-copy button button-secondary button-large"><?php echo esc_html( __( 'copy' ) ); ?></button></p>
			</div>
		<?php
	}//end metabox_embed()

	/**
	 * Register settings for plugin settings page. Including google map API key etc.
	 *
	 * @return void
	 */
	public function register_plugin_settings() {
		register_setting( 'ubc_vrpress_options', 'ubc_vrpress', 'ubc_vrpress_validate' );
		add_settings_section( 'ubc_vrpress_google_map_settings', 'API Settings', null, 'ubc_vrpress_settings' );
		add_settings_field(
			'ubc_vrpress_google_api_key',
			'Google Map API Key',
			function() {
				?>
					<input id='ubc_vrpress' name='ubc_vrpress[google_map_api_key]' type='password' class='regular-text' value='<?php echo esc_attr( get_option( 'ubc_vrpress' )['google_map_api_key'] ); ?>' />
				<?php
			},
			'ubc_vrpress_settings',
			'ubc_vrpress_google_map_settings'
		);
	}//end register_plugin_settings()

	/**
	 * Add plugin submenus under Post Type menu including settings.
	 *
	 * @return void
	 */
	public function add_plugin_submenus() {
		add_submenu_page(
			'edit.php?post_type=' . $this->post_type,
			__( 'Settings', 'vrpress' ),
			__( 'Settings', 'vrpress' ),
			'manage_options',
			'ubc_vrpress_settings',
			function() {
				?>
				<div class="wrap">
					<h2><?php echo esc_textarea( __( 'VRPress Settings', 'vrpress' ) ); ?></h2>
					<form action="options.php" method="post">
						<?php
							settings_fields( 'ubc_vrpress_options' );
							do_settings_sections( 'ubc_vrpress_settings' );
						?>
						<input name="submit" class="button button-primary" type="submit" value="<?php esc_attr_e( 'Save' ); ?>" />
					</form>
				</div>
				<?php
			}
		);

		add_submenu_page(
			'edit.php?post_type=' . $this->post_type,
			__( 'Documentation', 'vrpress' ),
			__( 'Documentation', 'vrpress' ),
			'manage_options',
			'ubc_vrpress_documentations',
			'UBC\VRPRESS\Documentation\\documentation_page_content'
		);
	}//end add_plugin_submenus()

	/**
	 * Render VR content single template content.
	 *
	 * @param string $single path to the single template.
	 */
	public function render_vr_single_template( $single ) {

		global $post;

		/* Checks for single template by post type */
		if ( $post->post_type === $this->post_type ) {
			if ( file_exists( UBC_VRPRESS_PLUGIN_DIR . 'includes/template-single.php' ) ) {
				return UBC_VRPRESS_PLUGIN_DIR . 'includes/template-single.php';
			}
		}

		return $single;
	}//end render_vr_single_template()

	/**
	 * Enqueue scripts to custom post type admin edit screen.
	 *
	 * @param [type] $hook template the current admin page.
	 * @return void
	 */
	public function metabox_enqueue_scripts( $hook ) {

		global $post;

		if ( 'post-new.php' !== $hook && 'post.php' !== $hook ) {
			return;
		}

		if ( $this->post_type !== $post->post_type ) {
			return;
		}

		// Make sure WordPress media upload js is loaded.
		wp_enqueue_media();

		// Enqueue google map javascript library.
		// phpcs:ignore
		wp_enqueue_script(
			'ubc_vrpress_google_map_script',
			'https://maps.googleapis.com/maps/api/js?key=' . ( false !== get_option( 'ubc_vrpress' ) && is_array( get_option( 'ubc_vrpress' ) ) ? get_option( 'ubc_vrpress' )['google_map_api_key'] : '' ) . '&libraries=places',
			array(),
			null,
			true
		);

		wp_enqueue_script(
			'ubc_vrpress_panomarker',
			UBC_VRPRESS_PLUGIN_URL . 'assets/src/panomarker.js',
			array(
				'jquery',
			),
			filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/src/panomarker.js' ),
			true
		);

		wp_enqueue_script(
			'ubc_vrpress_metabox_scripts',
			UBC_VRPRESS_PLUGIN_URL . 'assets/dist/js/tour-backend.js',
			array(
				'jquery',
			),
			filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/js/tour-backend.js' ),
			true
		);

		$vr_type = get_post_meta( $post->ID, 'ubc_vr_type', true );

		wp_localize_script(
			'ubc_vrpress_metabox_scripts',
			'ubc_vrpress_admin',
			array(
				'post_id'         => $post->ID,
				'upload_url'      => esc_url( get_upload_iframe_src( 'image', $post->ID ) ),
				'placeholder_url' => esc_url( UBC_VRPRESS_PLUGIN_URL . 'assets/src/image/no-image.jpg' ),
				'vr_type'         => $vr_type,
				'vr_cotent'       => 'self' === $vr_type ? get_post_meta( $post->ID, 'ubc_vrpress', true ) : get_post_meta( $post->ID, 'ubc_wpstreetview', true ),
				'vr_settings'     => get_post_meta( $post->ID, 'ubc_vr_settings', true ),
				'plugin_url'      => UBC_VRPRESS_PLUGIN_URL,
				'ajax_url'        => admin_url( 'admin-ajax.php' ),
				'ajax_nonce'      => wp_create_nonce( 'ubc_vrpress_metabox' ),
				'vr_icons'        => $this->street_view_icons,
			)
		);

		wp_register_style(
			'ubc_vrpress_metabox_styles',
			UBC_VRPRESS_PLUGIN_URL . 'assets/dist/css/tour-backend.css',
			false,
			filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/css/tour-backend.css' )
		);

		wp_enqueue_style( 'ubc_vrpress_metabox_styles' );
	}//end metabox_enqueue_scripts()

	/**
	 * Enqueue scripts for frontend page when shortcodes or blocks are present.
	 *
	 * @return void
	 */
	public function enqueue_frontend_scripts() {
		global $post;

		$enqueue = false;

		if ( isset( $post ) && ( has_shortcode( $post->post_content, 'vrpress' ) || has_block( 'ubc/vrpress', $post->post_content ) ) ) {
			$enqueue = true;
		}

		if ( is_singular( 'ubcvrpress' ) ) {
			$enqueue = true;
		}

		if ( $enqueue ) {

			// Enqueue scripts for self uploaded VR.
			wp_enqueue_script(
				'ubc_vrpress_scripts_vr',
				UBC_VRPRESS_PLUGIN_URL . 'assets/dist/js/tour-frontend-vr.js',
				array(
					'jquery',
				),
				filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/js/tour-frontend-vr.js' ),
				false
			);

			// Enqueue google map javascript API library.
			// phpcs:ignore
			wp_enqueue_script(
				'ubc_vrpress_google_map_script',
				'https://maps.googleapis.com/maps/api/js?key=' . get_option( 'ubc_vrpress' )['google_map_api_key'] . '&libraries=places',
				array(),
				null,
				true
			);

			wp_enqueue_script(
				'ubc_vrpress_panomarker',
				UBC_VRPRESS_PLUGIN_URL . 'assets/src/panomarker.js',
				array(
					'jquery',
				),
				filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/src/panomarker.js' ),
				true
			);

			// Enqueue scripts for google streetview.
			wp_enqueue_script(
				'ubc_vrpress_scripts_streetview',
				UBC_VRPRESS_PLUGIN_URL . 'assets/dist/js/tour-frontend-streetview.js',
				array(
					'jquery',
				),
				filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/js/tour-frontend-streetview.js' ),
				true
			);

			wp_localize_script(
				'ubc_vrpress_scripts_streetview',
				'ubc_vrpress_admin_streetview',
				array(
					'icons'      => $this->street_view_icons,
					'plugin_url' => UBC_VRPRESS_PLUGIN_URL,
					'site_url'   => get_site_url(),
				)
			);

			wp_localize_script(
				'ubc_vrpress_scripts_vr',
				'ubc_vrpress_admin',
				array(
					'vr_icons'   => $this->street_view_icons,
					'plugin_url' => UBC_VRPRESS_PLUGIN_URL,
					'site_url'   => get_site_url(),
				)
			);

			if ( file_exists( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/css/tour-frontend-vr.css' ) ) {
				wp_register_style(
					'ubc_vrpress_styles_vr',
					UBC_VRPRESS_PLUGIN_URL . 'assets/dist/css/tour-frontend-vr.css',
					false,
					filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/css/tour-frontend-vr.css' )
				);

				wp_enqueue_style( 'ubc_vrpress_styles_vr' );
			}

			if ( file_exists( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/css/tour-frontend-streetview.css' ) ) {
				wp_register_style(
					'ubc_vrpress_styles_sreetview',
					UBC_VRPRESS_PLUGIN_URL . 'assets/dist/css/tour-frontend-streetview.css',
					false,
					filemtime( UBC_VRPRESS_PLUGIN_DIR . 'assets/dist/css/tour-frontend-streetview.css' )
				);

				wp_enqueue_style( 'ubc_vrpress_styles_sreetview' );
			}
		}
	}//end enqueue_frontend_scripts()

	/**
	 * Handler when custom post type is published or saved in the admin edit page. Save configs and settings as post metadata.
	 *
	 * @param [int] $post_id ID of current post which submitted the action.
	 * @return void
	 */
	public function post_save( $post_id ) {
		global $post_type;

		if ( $this->post_type !== $post_type ) {
			return;
		}

		if ( isset( $_POST['ubc_vr_type'] ) ) {
			update_post_meta( $post_id, 'ubc_vr_type', sanitize_text_field( $_POST['ubc_vr_type'] ) );
		}

		if ( isset( $_POST['ubc_vr_settings'] ) ) {
			update_post_meta( $post_id, 'ubc_vr_settings', Helper::sanitize_vr_settings( $_POST['ubc_vr_settings'] ) );
		} else {
			// Make sure the record exists so we're not using the default settings next time.
			update_post_meta( $post_id, 'ubc_vr_settings', array() );
		}

		// Save streetview data.
		if ( isset( $_POST['ubc_wpstreetview'] ) ) {
			update_post_meta( $post_id, 'ubc_wpstreetview', Helper::sanitize_streetview_data( $_POST['ubc_wpstreetview'] ) );
		}

		// Save self uploaded vr data.
		if ( isset( $_POST['ubc_vrpress'] ) ) {
			update_post_meta( $post_id, 'ubc_vrpress', Helper::sanitize_vr_data( $_POST['ubc_vrpress'] ) );
		}
	}//end post_save()

	/**
	 * Define VR shortcode for the plugin.
	 *
	 * @param [array] $atts attributes provided with shortcode.
	 * @return string html to render in the frontend.
	 */
	public function add_vr_shortcode( $atts ) {
		$a = shortcode_atts(
			array(
				'id'     => null,
				'width'  => 600,
				'height' => 600,
				'embed'  => 'false',
			),
			$atts
		);

		if ( ! is_numeric( $atts['id'] ) ) {
			return '';
		}

		$post_id = (int) $atts['id'];
		$post    = get_post( $post_id );

		// Return if post does not exist.
		if ( null === $post ) {
			return '';
		}

		// Return if post type is not VRPress.
		if ( $post->post_type !== $this->post_type ) {
			return '';
		}

		$vr_type     = sanitize_text_field( get_post_meta( $post_id, 'ubc_vr_type', true ) );
		$vr_content  = 'self' === $vr_type ? get_post_meta( $post_id, 'ubc_vrpress', true ) : get_post_meta( $post_id, 'ubc_wpstreetview', true );
		$vr_settings = get_post_meta( $post_id, 'ubc_vr_settings', true );

		if ( 'self' === $vr_type ) {
			$html = $this->render_shortcode_vr( $a, $vr_content, $vr_settings );
		} else {
			$html = $this->render_shortcode_streetview( $a, $vr_content );
		}

		return $html;
	}//end add_vr_shortcode()

	/**
	 * Render shortcode content for Self Uploaded VR.
	 *
	 * @param array  $attrs Attributes provided within shortcode.
	 * @param object $vr_content VR data of the instance.
	 * @param array  $vr_settings VR setting of the H5P instance.
	 * @return string output html
	 */
	private function render_shortcode_vr( $attrs, $vr_content, $vr_settings ) {

		if ( $vr_content ) {
			$html   = '';
			$width  = is_numeric( $attrs['width'] ) ? 'max-width: ' . (int)$attrs['width'] . 'px;' : '';
			$height = is_numeric( $attrs['height'] ) ? 'height: ' . (int)$attrs['height'] . 'px;' : '';

			$html .= '<div id="panorama-' . esc_attr( $attrs['id'] ) . '" style="' . esc_attr( $width ) . esc_attr( $height ) . '"></div>';
			$html .= '<script>';
			$html .= 'var viewer = pannellum.viewer( "panorama-' . esc_html( $attrs['id'] ) . '", {';
			$html .= '"default": {';
			$html .= '"firstScene": ' . esc_html( $vr_content['scenes'][ $vr_content['default_scene'] ]['id'] ) . ',';
			$html .= '"sceneFadeDuration": 1000,';
			$html .= '"autoLoad": true,';
			$html .= '"compass": false,';
			$html .= array_key_exists( 'homeControl', $vr_settings ) ? '"showHomeControl": true,' : '"showHomeControl": false,';
			$html .= array_key_exists( 'navigatorControl', $vr_settings ) ? '"showNavigatorControl": true,' : '"showNavigatorControl": false,';
			$html .= array_key_exists( 'showEmbed', $vr_settings ) ? '"showEmbed": true,' : '"showEmbed": false,';
			// Start Settings.
			$html .= array_key_exists( 'autoRotate', $vr_settings ) ? '"autoRotate": 5,' : '';
			$html .= array_key_exists( 'autoRotate', $vr_settings ) ? '"autoRotateInactivityDelay": 10000,' : '';
			$html .= array_key_exists( 'zoomControl', $vr_settings ) ? '"showZoomCtrl": true,' : '"showZoomCtrl": false,';
			$html .= array_key_exists( 'fullScreenControl', $vr_settings ) ? '"showFullscreenCtrl": true,' : '"showFullscreenCtrl": false,';
			// End Settings.
			$html .= '},';
			$html .= '"scenes": {';
			foreach ( $vr_content['scenes'] as $key => $scene ) {
				// Update protocal for image urls.
				$image = is_ssl() ? str_replace( 'http:', 'https:', $scene['img'] ) : str_replace( 'https:', 'http:', $scene['img'] );
				// With the release of WordPress 5.3, WordPress now automatically detect large media file uploads and 
				// compress them to maximun of 2560px wide images.
				// Since Panorama images usually requires much more pixel than that, we will try to use the original version instead of the scaled one.
				$ori_image = str_replace( '-scaled.', '.', $image );
				if ( Helper::checkRemoteFile( $ori_image ) ) {
					$image = $ori_image;
				}

				$html .= '"' . esc_html( $scene['id'] ) . '": {';
				$html .= array_key_exists( 'showTitle', $vr_settings ) ? '"title": "' . esc_html( $scene['title'] ) . '",' : '';
				$html .= '"hfov": ' . floatval( $scene['hfov'] ) . ',';
				$html .= '"pitch": ' . floatval( $scene['pitch'] ) . ',';
				$html .= '"yaw": ' . floatval( $scene['yaw'] ) . ',';
				$html .= '"position": ' . floatval( $scene['position'] ) . ',';
				$html .= '"id": ' . floatval( $scene['id'] ) . ',';
				$html .= '"type": "equirectangular",';
				$html .= '"panorama": "' . esc_url( $image ) . '",';
				$html .= '"hotSpots": [';
				if ( isset( $scene['hotSpots'] ) && ! empty( $scene['hotSpots'] ) ) {
					foreach ( $scene['hotSpots'] as $key => $hotspot ) {
						$html .= '{';
						$html .= 'pitch: ' . floatval( $hotspot['pitch'] ) . ',';
						$html .= 'yaw: ' . floatval( $hotspot['yaw'] ) . ',';
						$html .= 'title: "' . esc_html( $hotspot['text'] ) . '",';
						$html .= 'type: "' . esc_html( 'Scene' === $hotspot['realType'] ? 'scene' : 'info' ) . '",';
						$html .= 'realType: "' . esc_html( $hotspot['realType'] ) . '",';
						if ( isset( $hotspot['iconType'] ) ) {
							$html .= 'iconType: "' . esc_html( $hotspot['iconType'] ) . '",';
						}

						$hotspot['content'] = '';
						foreach ( $hotspot[ $hotspot['realType'] ] as $key => $value ) {
							if( $key !== 'content' ) {
								$html .= esc_html( $key ) . ': "' . esc_html( $value ) . '",';
							}
						}
						if ( 'Info' === $hotspot['realType'] ) {
							$hotspot['content'] = $hotspot[ $hotspot['realType'] ]['content'];
						}
						if ( 'Image' === $hotspot['realType'] && isset( $hotspot[ $hotspot['realType'] ]['url'] ) ) {
							$hotspot['content'] = '<div class="vrpress-modal-image-container"><img src="' . esc_url( $hotspot[ $hotspot['realType'] ]['url'] ) . '" alt="' . esc_textarea( $hotspot[ $hotspot['realType'] ]['alt'] ) . '" /><div class="vrpress-modal-image-container-caption">' . esc_textarea( $hotspot[ $hotspot['realType'] ]['caption'] ) . '</div></div>';
						}
						if ( 'Video' === $hotspot['realType'] && isset( $hotspot[ $hotspot['realType'] ]['url'] ) ) {
							$hotspot['content'] = '<video controls><source src="' . esc_url( $hotspot[ $hotspot['realType'] ]['url'] ) . '" type="video/mp4">Your browser does not support the video tag.</video>';
						}
						if ( 'oEmbed' === $hotspot['realType'] ) {
							if ( is_numeric( $hotspot[ $hotspot['realType'] ]['width'] ) && is_numeric( $hotspot[ $hotspot['realType'] ]['height'] ) ) {
								$hotspot['content'] = '<div class="pnlm-render-container__iframe-container" style="padding-bottom:' . number_format( $hotspot[ $hotspot['realType'] ]['height'] / $hotspot[ $hotspot['realType'] ]['width'] * 100, 2 ) . '%;"><iframe src="' . esc_url( $hotspot[ $hotspot['realType'] ]['embedUrl'] ) . '" allowfullscreen /></div>';
							}
						}
						if ( 'Scene' !== $hotspot['realType'] && 'Link' !== $hotspot['realType'] ) {
							$html .= 'clickHandlerFunc: ( clickHandlerArgs ) => {';
								$html .= 'viewer.stopAutoRotate();';
								$html .= 'clickHandlerArgs.target.closest( ".pnlm-container" ).classList.add("modal-opened");';
								$html .= 'const hotspotModal = clickHandlerArgs.target.closest( ".pnlm-container" ).querySelector( ".pnlm-container__hotspot-modal" );';
								$html .= 'const hotspotModalHeading = hotspotModal.querySelector( ".pnlm-container__hotspot-modal-heading h2" );';
								$html .= 'const hotspotModalContent = hotspotModal.querySelector( ".pnlm-container__hotspot-modal-content" );';
								$html .= 'hotspotModalContent.innerHTML = ' . json_encode( Helper::wp_kses_hotspot_content( $hotspot['content'] ) ) . ';';
								$html .= 'hotspotModalHeading.innerHTML = "' . esc_html( $hotspot['text'] ) . '";';
								$html .= 'hotspotModal.classList.add( "show" );';
							$html .= '}';
						}

						$html .= '},';
					}
				}
				$html .= ']';
				$html .= '},';
			}
			$html .= '},';
			$html .= '} );';
			$html .= 'ubcVRPressInit( viewer );';
			$html .= 'window.ubc_vrpress_viewers = window.ubc_vrpress_viewers ? [ window.ubc_vrpress_viewers, ...viewer ]: [viewer];';
			$html .= '</script>';
		} else {
			return 'Post is not valid';
		}

		return $html;
	}//end render_shortcode_vr()

	/**
	 * Render content for Google Street View Panorama
	 *
	 * @param  array  $attrs Attributes provided within the shortcode.
	 * @param  object $vr_content VR data of the instance.
	 * @return string output html
	 */
	private function render_shortcode_streetview( $attrs, $vr_content ) {
		if ( 'true' === $attrs['embed'] ) {
			$width  = 'max-width: 100%;';
			$height = 'height: 100%;';
		} else {
			$width  = is_numeric( $attrs['width'] ) ? 'max-width: ' . esc_attr( $attrs['width'] ) . 'px;' : '';
			$height = is_numeric( $attrs['height'] ) ? 'height: ' . esc_attr( $attrs['height'] ) . 'px;' : '';
		}

		$vr_content['element'] = 'streetview-' . esc_attr( $attrs['id'] );

		if ( $vr_content ) {
			$html  = '';
			$html .= '<div id="' . esc_attr( $vr_content['element'] ) . '" class="streetview-container" style="' . esc_attr( $width ) . esc_attr( $height ) . '"></div>';
			$html .= '<script>';
			$html .= 'window.ubc_vrpress_streetviews = window.ubc_vrpress_streetviews ? [ window.ubc_vrpress_streetviews, ...' . wp_json_encode( $vr_content ) . ' ]: [' . wp_json_encode( $vr_content ) . '];';
			$html .= '</script>';

			return $html;
		} else {
			return 'Post is not valid';
		}
	}//end render_shortcode_streetview()

	/**
	 * Render content for google map associated with Streetview Panorama.
	 *
	 * @param  array $atts attributes of the provided shortcode.
	 * @return string html output
	 */
	public function add_map_shortcode( $atts ) {
		$attrs = shortcode_atts(
			array(
				'id'     => null,
				'width'  => null,
				'height' => null,
			),
			$atts
		);

		$width   = is_numeric( $attrs['width'] ) ? 'max-width: ' . esc_attr( $attrs['width'] ) . 'px;' : '';
		$height  = is_numeric( $attrs['height'] ) ? 'height: ' . esc_attr( $attrs['height'] ) . 'px;' : '';
		$post_id = is_numeric( $attrs['id'] ) ? (int) $attrs['id'] : null;

		if ( null === $post_id ) {
			return;
		}

		$vr_content                       = get_post_meta( $post_id, 'ubc_wpstreetview', true );
		$vr_content['element']            = 'streetview-map-' . esc_attr( $attrs['id'] );
		$vr_content['streetview_element'] = 'streetview-' . esc_attr( $attrs['id'] );

		$html  = '';
		$html .= '<div id="streetview-map-' . esc_attr( $post_id ) . '" class="streetview-container" style="' . esc_attr( $width ) . esc_attr( $height ) . '"></div>';
		$html .= '<script>';
		$html .= 'window.ubc_vrpress_streetviews_maps = window.ubc_vrpress_streetviews_maps ? [ window.ubc_vrpress_streetviews_maps, ...' . wp_json_encode( $vr_content ) . ' ]: [' . wp_json_encode( $vr_content ) . '];';
		$html .= '</script>';

		return $html;
	}//end add_map_shortcode()

	/**
	 * Ajax handler function to retrieve iframe src, width and height from oEmbed request.
	 * Funtion will try to retrieve width and height of the iframe from either html attributes or inline styles.
	 *
	 * @return void
	 */
	public function get_oembed() {
		check_ajax_referer( 'ubc_vrpress_metabox', 'ubc_vrpress_nonce' );

		$url     = isset( $_POST['url'] ) ? esc_url_raw( wp_unslash( $_POST['url'] ) ) : '';
		$content = wp_oembed_get( $url );

		if ( false === $content ) {
			wp_die( esc_textarea( __( 'Unable to retrieve media.', 'ubc_vrpress' ) ) );
		}

		preg_match_all( '/(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/', $content, $is_iframe );

		if ( ! $is_iframe ) {
			wp_die( esc_textarea( __( 'Retrieved data is not using iframe.', 'ubc_vrpress' ) ) );
		}

		preg_match( '/width="([^"]+)"/i', $content, $width_attribute );
		preg_match( '/height="([^"]+)"/i', $content, $height_attribute );
		preg_match( '/width:([^;]+);/i', $content, $width_style );
		preg_match( '/height:([^;]+);/i', $content, $height_style );
		preg_match( '/src="([^"]+)"/i', $content, $src );

		// If iframe width and height attributes are provided and values are numbers.
		if ( ( count( $width_attribute ) > 1 && is_numeric( $width_attribute[1] ) ) && ( count( $height_attribute ) > 1 && is_numeric( $height_attribute[1] ) ) ) {
			$width  = (int) $width_attribute[1];
			$height = (int) $height_attribute[1];
		} elseif ( ( count( $width_style ) > 1 && Helper::ends_with( $width_style[1], 'px' ) ) && ( count( $height_style ) > 1 && Helper::ends_with( $height_style[1], 'px' ) ) ) {
			// If iframe width and height are provided inside style attribute and values are pixel based not percentage.
			$width  = (int) substr( $width_style[1], 0, strlen( $width_style[1] ) - 2 );
			$height = (int) substr( $height_style[1], 0, strlen( $height_style[1] ) - 2 );
		} else {
			// if iframe does not provide width and height as attribute nor style, use from shortcode attributes.
			$width  = 1280;
			$height = 720;
		}

		wp_send_json(
			array(
				'src'    => $src[1],
				'width'  => $width,
				'height' => $height,
			)
		);
	}//end get_oembed()
}

?>
