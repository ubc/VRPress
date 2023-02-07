<?php
/**
 * Plugin documentation
 *
 * @package vrpress
 */

namespace UBC\VRPRESS\Documentation;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Callback function to render the content of the documentation page.
 */
function documentation_page_content() {
	$tab       = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : null;
	$url       = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : null;
	$image_dir = UBC_VRPRESS_PLUGIN_URL . 'assets/src/image/documentations/';

	?>
	<style>
		.tab-content{
			padding: 20px 40px;
			background-color: #fff;
		}

		ul{
			list-style: circle;
			padding-left: 20px;
		}

		img{
			border: 2px solid #ababab;
		}
	</style>
	<div class="wrap">
		<nav class="nav-tab-wrapper">
			<a href="<?php echo esc_url( add_replace_url_param( $url, 'tab', 'overview' ) ); ?>" class="nav-tab <?php echo ( null === $tab || 'overview' === $tab ) ? 'nav-tab-active' : ''; ?>">Overview</a>
			<a href="<?php echo esc_url( add_replace_url_param( $url, 'tab', 'self-upload' ) ); ?>" class="nav-tab <?php echo ( 'self-upload' === $tab ) ? 'nav-tab-active' : ''; ?>">Self Uploaded VR</a>
			<a href="<?php echo esc_url( add_replace_url_param( $url, 'tab', 'streetview' ) ); ?>" class="nav-tab <?php echo ( 'streetview' === $tab ) ? 'nav-tab-active' : ''; ?>">Google Street View</a>
		</nav>

		<div class="tab-content">
			<?php if ( null === $tab || 'overview' === $tab ) : ?>
				<h2><?php echo esc_textarea( __( 'Plugin Overview', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'The VRPress plugin provides a way for users to render 360 degree panoramas. When creating a tour you have a choice of two types of VR', 'vrpress' ) ); ?>:</p>
				<ul>
					<li><strong><?php echo esc_textarea( __( 'Self-upload', 'vrpress' ) ); ?></strong>: <?php echo esc_textarea( __( 'Create a virtual tour using local images uploaded to this site or', 'vrpress' ) ); ?></li>
					<li><strong><?php echo esc_textarea( __( 'Google Map Streetview', 'vrpress' ) ); ?></strong>: <?php echo esc_textarea( __( 'Create a panorama view with images sourced directly from Google Maps', 'vrpress' ) ); ?>.</li>
				</ul>
				<img width="800" src="<?php echo esc_attr( $image_dir . 'vr-type.png' ); ?>" alt="">
				<br /><br />
				<h2><?php echo esc_textarea( __( 'Display Tour', 'vrpress' ) ); ?></h2>
				<p>
				<?php echo esc_textarea( __( 'There are two ways of displaying the tours you create to your website visitors', 'vrpress' ) ); ?>:
				</p>
				<ul>
					<li><?php echo esc_textarea( __( 'A shortcode generated on the tour edit page', 'vrpress' ) ); ?> i.e. [ubc_vrpress id="68"] <?php echo esc_textarea( __( 'or', 'vrpress' ) ); ?> [ubc_vrpress id="68" width="800" height="400"]</li>
					<li><?php echo esc_textarea( __( 'A "VRPress" block if you\'re using the Block Editor', 'vrpress' ) ); ?></li>
				</ul>
				<img width="400" src="<?php echo esc_attr( $image_dir . 'shortcode-copy.png' ); ?>" alt="">
				<img width="400" src="<?php echo esc_attr( $image_dir . 'gutenberg-block.png' ); ?>" alt="">
			<?php endif; ?>

			<?php if ( 'self-upload' === $tab ) : ?>
				<p><?php echo esc_textarea( __( 'When using the \'Self-uploaded\' type of VR, a "preview" meta box will be shown at the top right corner of your page to generate the tour preview based on the existing settings for your tour. The preview is live-updated', 'vrpress' ) ); ?>.</p>
				<div>
					<a href="<?php echo esc_attr( $image_dir . 'self-uploaded-vr.png' ); ?>"><img width="600" src="<?php echo esc_attr( $image_dir . 'self-uploaded-vr.png' ); ?>" alt=""></a>
				</div>
				<br />
				<h2><?php echo esc_textarea( __( 'Spheres', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'Each sphere represents a 360 image in this tour. Each sphere requires a title and image to be uploaded. You have the option to set a specific sphere as default so that the image will be loaded first during tour initialization', 'vrpress' ) ); ?>.</p>
				<br />
				<h2><?php echo esc_textarea( __( 'Hotspots', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'You are able to add multiple hotspots to each sphere. There are 5 types of hotspots including', 'vrpress' ) ); ?>:</p>
				<ul>
					<li><?php echo esc_textarea( __( 'Info: Displays title and content inside a modal.', 'vrpress' ) ); ?></li>
					<li><?php echo esc_textarea( __( 'Link: User will be redirected to external url when they click the hotspot.', 'vrpress' ) ); ?></li>
					<li><?php echo esc_textarea( __( 'Sphere: User will be navigated to another sphere when they click the hotspot.', 'vrpress' ) ); ?></li>
					<li><?php echo esc_textarea( __( 'Video: Plays local videos in a modal.', 'vrpress' ) ); ?></li>
					<li><?php echo esc_textarea( __( 'oEmbed: Displays content from third-party services such as Youtube, Flickr etc. Simply paste the url of your youtube video in \'Media Url\' field and click \'Fetch before save\'.', 'vrpress' ) ); ?></li>
				</ul>
				<div>
					<a href="<?php echo esc_attr( $image_dir . 'hotspot-settings.png' ); ?>"><img width="600" src="<?php echo esc_attr( $image_dir . 'hotspot-settings.png' ); ?>" alt=""></a>
				</div>
				<br />
				<h2><?php echo esc_textarea( __( 'Update hotspot position inside a sphere.', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'Drag and drop on hotspot is supported and is the only way to update hotspot position inside a sphere. Don\'t forget to save the changes.', 'vrpress' ) ); ?></p>
				<a href="<?php echo esc_attr( $image_dir . 'self-uploaded-vr-hotspot-locate.mp4' ); ?>"><video width="800" controls autoplay loop src="<?php echo esc_attr( $image_dir . 'self-uploaded-vr-hotspot-locate.mp4' ); ?>"></video></a>
			<?php endif; ?>

			<?php if ( 'streetview' === $tab ) : ?>
				<h2><?php echo esc_textarea( __( 'Google Map API Key', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'Street view functionality requires a', 'vrpress' ) ); ?> <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank"><?php echo esc_textarea( __( 'google maps API key', 'vrpress' ) ); ?></a>. <?php echo esc_textarea( __( 'Add your API key to the', 'vrpress' ) ); ?> <a href="/wp-admin/edit.php?post_type=vrpress&page=ubc_vrpress_settings"><?php echo esc_textarea( __( 'VRPress Settings Page', 'vrpress' ) ); ?></a>.</p>
				<p><?php echo esc_textarea( __( 'Ensure "Maps JavaScript API" and "Places API" are enabled in the Google Maps API Key settings. Google requires you to associate the project with a billing account. However Google provides $200 credit on your billing account each month to offset your usage costs.', 'vrpress' ) ); ?></p>
				<br />
				<h2><?php echo esc_textarea( __( 'Tour Preview', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'When using the \'Google Maps Streetview\' type of VR, a "preview" meta box will be shown at the top right corner of your page to generate the tour preview based on the existing settings for your tour. The preview is live-updated.', 'vrpress' ) ); ?></p>
				<br />
				<h2><?php echo esc_textarea( __( 'Sphere', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'Each sphere represents a 360 image from Google in this tour. You have the option to set a specific sphere as default so that the image will be loaded first during tour initialization.', 'vrpress' ) ); ?></p>
				<br />
				<h2><?php echo esc_textarea( __( 'Update Sphere( streetview image )', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'There are 3 ways to update a sphere image', 'vrpress' ) ); ?>:</p>
				<ul>
					<li><?php echo esc_textarea( __( 'Drag and Drop: Drag and drop each marker on the Google Map. Once you dropped a marker for a sphere, Google will try to retrieve the closest location to the marker which has 360 panorama image available with 50km radius. It is possible for some locations that Google will fail to find the image.', 'vrpress' ) ); ?></li>
					<li><?php echo esc_textarea( __( 'Search: Location search will update the selected marker( active marker tab ) location in the Google Map and also update the 360 image of the current sphere.', 'vrpress' ) ); ?></li>
					<li><?php echo esc_textarea( __( 'Preview Navigation: Useful if the image for current sphere is close but not the exact one you\'re looking for. You are able to use preview to navigate to different sphere and clicking the \'Update selected sphere image\' button', 'vrpress' ) ); ?>.</li>
				</ul>
				<div>
					<a href="<?php echo esc_attr( $image_dir . 'streetview-marker-position.mp4' ); ?>"><video width="800" controls autoplay loop src="<?php echo esc_attr( $image_dir . 'streetview-marker-position.mp4' ); ?>"></video></a>
				</div>
				<br />
				<h2><?php echo esc_textarea( __( 'Hotspots', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'You are able to add multiple hotspots to each sphere. There are 4 types of hotspots including', 'vrpress' ) ); ?>:</p>
				<ul>
					<li><?php echo esc_textarea( __( 'Info: Displays title and content inside a modal.', 'vrpress' ) ); ?></li>
					<li><?php echo esc_textarea( __( 'Link: User will be redirected to another url when they click the hotspot.', 'vrpress' ) ); ?></li>
					<li><?php echo esc_textarea( __( 'Video: Plays a video uploaded to this site.', 'vrpress' ) ); ?></li>
					<li><?php echo esc_textarea( __( 'oEmbed: Displays content from third-party services such as Youtube, Flickr etc. Simply paste the url of your youtube video in \'Media Url\' field and click \'Fetch before save\'.', 'vrpress' ) ); ?></li>
				</ul>
				<br />
				<h2><?php echo esc_textarea( __( 'Update Hotspot position in a pano', 'vrpress' ) ); ?></h2>
				<p><?php echo esc_textarea( __( 'Drag and drop is supported on individual hotspots in order to change position inside sphere.', 'vrpress' ) ); ?></p>
			<?php endif; ?>
		</div>
	</div>
	<?php
}

/**
 * Replace individual URL parameter with specific value.
 *
 * @param string $url Target URL.
 * @param string $key attribute key to be replaced.
 * @param string $value attribute value to replace with.
 *
 * @return string new URL generated with the new params.
 */
function add_replace_url_param( $url, $key, $value ) {
	$url = preg_replace( '/(.*)(?|&)' . $key . '=[^&]+?(&)(.*)/i', '$1$2$4', $url . '&' );
	$url = substr( $url, 0, -1 );

	if ( ! strpos( $url, '?' ) ) {
		return ( $url . '?' . $key . '=' . $value );
	} else {
		return ( $url . '&' . $key . '=' . $value );
	}
}
