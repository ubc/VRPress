<?php
/**
 * The template for VRPress post type single template.
 *
 * @package vrpress
 */

	wp_head();
?>
		<style>
			html, body{
				margin: 0 !important;
				padding: 0 !important;
			}

			body .pnlm-container{
				max-width: 100% !important;
				height: 100% !important;
			}

			body > * {
				display: none;
			}

			.streetview-container, .pnlm-container{
				display: block;
			}
		</style>
	<?php

	global $post;
	echo do_shortcode( '[vrpress id="' . $post->ID . '" embed="true"]' );

	wp_footer();
