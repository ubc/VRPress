<?php
/**
 * Helper functions
 *
 * @package ubc_vrpress
 */

namespace UBC\VRPRESS;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Utility class.
 */
class Helper {
	/**
	 * Function to check string starting with given substring.
	 *
	 * @param string $string string to search from.
	 * @param string $start_string string to search for.
	 *
	 * @return boolean whether string is started with the start_string.
	 */
	public static function starts_with( $string, $start_string ) {
		$len = strlen( $start_string );
		return ( substr( $string, 0, $len ) === $start_string );
	}

	/**
	 * Function to check string ending with given substring.
	 *
	 * @param string $string string to search from.
	 * @param string $end_string string to search for.
	 *
	 * @return boolean whether string is ended with the start_string.
	 */
	public static function ends_with( $string, $end_string ) {
		$len = strlen( $end_string );
		if ( 0 === $len ) {
			return true;
		}
		return ( substr( $string, -$len ) === $end_string );
	}

	/**
	 * Check if a remote file URL exist.
	 * 
	 * @param string $url URL of the remote file.
	 * 
	 * @return boolean
	 */
	public static function checkRemoteFile( $url ) {
		$response = wp_remote_retrieve_response_code(
			wp_remote_get(
				$url,
				array(
					'limit_response_size' => 1
				)
			)
		);

		return 200 === $response;
	}

	/**
	 * Sanitize VR settings. Each value with in array is boolean.
	 *
	 * @param array $vr_settings settings for VR instance.
	 * @return array sanitized settings.
	 */
	public static function sanitize_vr_settings( $vr_settings ) {
		return array_map(
			function( $setting ) {
				return rest_sanitize_boolean( $setting );
			},
			$vr_settings
		);
	}

	/**
	 * Sanitize streetview data. It is multi-level array.
	 *
	 * @param array $streetview_data street view data for VR instance.
	 * @return array sanitized data.
	 */
	public static function sanitize_streetview_data( $streetview_data ) {
		$new_streetview_data = array();

		// Sanitize default marker index.
		if ( isset( $streetview_data['defaultMarker'] ) ) {
			$new_streetview_data['defaultMarker'] = isset( $streetview_data['defaultMarker'] ) ? intval( $streetview_data['defaultMarker'] ) : 0;
		}

		// Sanitize all the markers data.
		if ( isset( $streetview_data['markers'] ) && is_array( $streetview_data['markers'] ) && ! empty( $streetview_data['markers'] ) ) {
			$new_streetview_data['markers'] = array_map(
				function( $marker ) {
					$new_marker                = array();
					$new_marker['id']          = isset( $marker['id'] ) ? intval( $marker['id'] ) : -1;
					$new_marker['pano']        = isset( $marker['pano'] ) ? sanitize_text_field( $marker['pano'] ) : '';
					$new_marker['title']       = isset( $marker['title'] ) ? sanitize_text_field( $marker['title'] ) : '';
					$new_marker['description'] = isset( $marker['description'] ) ? sanitize_textarea_field( $marker['description'] ) : '';
					$new_marker['position']    = isset( $marker['position'] ) ? array(
						'lat' => floatval( $marker['position']['lat'] ),
						'lng' => floatval( $marker['position']['lng'] ),
					) : array();
					$new_marker['pov']         = isset( $marker['pov'] ) ? array(
						'heading' => floatval( $marker['pov']['heading'] ),
						'pitch'   => floatval( $marker['pov']['pitch'] ),
						'zoom'    => floatval( $marker['pov']['zoom'] ),
					) : array();
					$new_marker['clickToGo']   = isset( $marker['clickToGo'] ) ? sanitize_text_field( $marker['clickToGo'] ) : false;

					return $new_marker;
				},
				$streetview_data['markers']
			);
		}

		// Sanitize all the hotspots data.
		if ( isset( $streetview_data['hotSpots'] ) && is_array( $streetview_data['hotSpots'] ) && ! empty( $streetview_data['hotSpots'] ) ) {
			$new_streetview_data['hotSpots'] = array_map(
				function( $hotspot ) {
					$new_hotspot                     = array();
					$new_hotspot['id']               = intval( $hotspot['id'] );
					$new_hotspot['pano']             = sanitize_text_field( $hotspot['pano'] );
					$new_hotspot['pov']              = array(
						'heading' => floatval( $hotspot['pov']['heading'] ),
						'pitch'   => floatval( $hotspot['pov']['pitch'] ),
					);
					$new_hotspot['markerId']         = intval( $hotspot['markerId'] );
					$new_hotspot['title']            = sanitize_text_field( $hotspot['title'] );
					$new_hotspot['type']             = sanitize_text_field( $hotspot['type'] );
					$new_hotspot['iconType']         = sanitize_text_field( $hotspot['iconType'] );
					$new_hotspot[ $hotspot['type'] ] = self::sanitize_hotspot_by_type( $hotspot[ $hotspot['type'] ], $hotspot['type'] );

					return $new_hotspot;
				},
				$streetview_data['hotSpots']
			);
		}

		return $new_streetview_data;
	}

	/**
	 * Sanitize self-uploaded vr data. It is multi-level array.
	 *
	 * @param array $vr_data data for VR instance.
	 * @return array sanitized data.
	 */
	public static function sanitize_vr_data( $vr_data ) {
		$new_vr_data = array();

		// Sanitize default scene index.
		if ( isset( $vr_data['default_scene'] ) ) {
			$new_vr_data['default_scene'] = isset( $vr_data['default_scene'] ) ? intval( $vr_data['default_scene'] ) : 0;
		}

		// Sanitize all the scene data.
		if ( isset( $vr_data['scenes'] ) && is_array( $vr_data['scenes'] ) && ! empty( $vr_data['scenes'] ) ) {
			$new_vr_data['scenes'] = array_map(
				function( $scene ) {
					$new_scene             = array();
					$new_scene['id']       = isset( $scene['id'] ) ? intval( $scene['id'] ) : -1;
					$new_scene['position'] = isset( $scene['position'] ) ? intval( $scene['position'] ) : 0;
					$new_scene['hfov']     = isset( $scene['hfov'] ) ? intval( $scene['hfov'] ) : 100;
					$new_scene['pitch']    = isset( $scene['pitch'] ) ? intval( $scene['pitch'] ) : 0;
					$new_scene['yaw']      = isset( $scene['yaw'] ) ? intval( $scene['yaw'] ) : 0;
					$new_scene['title']    = isset( $scene['title'] ) ? sanitize_text_field( $scene['title'] ) : '';
					$new_scene['img']      = isset( $scene['img'] ) ? esc_url_raw( $scene['img'] ) : '';

					// Sanitize all the hotspots data.
					if ( isset( $scene['hotSpots'] ) && is_array( $scene['hotSpots'] ) && ! empty( $scene['hotSpots'] ) ) {
						$new_scene['hotSpots'] = array_map(
							function( $hotspot ) {
								$new_hotspot                         = array();
								$new_hotspot['id']                   = intval( $hotspot['id'] );
								$new_hotspot['pitch']                = floatval( $hotspot['pitch'] );
								$new_hotspot['yaw']                  = floatval( $hotspot['yaw'] );
								$new_hotspot['text']                 = sanitize_text_field( $hotspot['text'] );
								$new_hotspot['realType']             = sanitize_text_field( $hotspot['realType'] );
								$new_hotspot['iconType']             = sanitize_text_field( $hotspot['iconType'] );
								$new_hotspot[ $hotspot['realType'] ] = self::sanitize_hotspot_by_type( $hotspot[ $hotspot['realType'] ], $hotspot['realType'] );

								return $new_hotspot;
							},
							$scene['hotSpots']
						);
					}
					// end Sanitize all the hotspots data.

					return $new_scene;
				},
				$vr_data['scenes']
			);
		}

		return $new_vr_data;
	}

	/**
	 * Sanitize hotspot data based on the type provided.
	 *
	 * @param array  $hotspot_data the data of the passed hotspot.
	 * @param string $hotspot_type the type of the hotspot.
	 *
	 * @return array sanitized data.
	 */
	public static function sanitize_hotspot_by_type( $hotspot_data, $hotspot_type ) {

		switch ( $hotspot_type ) {

			case 'Info':
				return array(
					'content' => wp_kses_post( $hotspot_data['content'] ),
				);
			case 'Scene':
				return array(
					'sceneId' => intval( $hotspot_data['sceneId'] ),
				);
			case 'Link':
				return array(
					'URL' => esc_url_raw( $hotspot_data['URL'] ),
				);
			case 'Image':
				return array(
					'url'     => esc_url_raw( $hotspot_data['url'] ),
					'caption' => sanitize_text_field( $hotspot_data['caption'] ),
					'alt'     => sanitize_text_field( $hotspot_data['alt'] ),
				);
			case 'Video':
				return array(
					'url' => esc_url_raw( $hotspot_data['url'] ),
				);
			case 'oEmbed':
				return array(
					'url'      => esc_url_raw( $hotspot_data['url'] ),
					'embedUrl' => esc_url_raw( $hotspot_data['embedUrl'] ),
					'width'    => intval( $hotspot_data['width'] ),
					'height'   => intval( $hotspot_data['height'] ),
					'status'   => sanitize_text_field( $hotspot_data['status'] ),
				);
		}

		return $hotspot_data;
	}

	/**
	 * Sanitize post data with additional allowed HTML tags.
	 * 
	 * @param string HTML string to be filtered.
	 * 
	 * @return string filtered string.
	 */
	public static function wp_kses_hotspot_content( $data ) {
		global $allowedposttags;

		$allowed_tags = $allowedposttags;
		$allowed_tags['iframe'] = array(
			'src'             => true,
			'allowfullscreen' => true,
		);
		
		return wp_kses( $data, $allowed_tags );
	}

}
