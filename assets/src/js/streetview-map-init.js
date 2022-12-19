/**
 * Initiate all existing google map instances associated with streetview on current page.
 */

import './streetview-extend';
import './../scss/streetview-extend.scss';

/* eslint-disable camelcase */
( function( $ ) {
    window.ubc_vrpress_streetview_map_init = () => {
        if ( ! window.ubc_vrpress_streetviews_maps ) {
            return;
        }

        window.ubc_vrpress_streetviews_maps.forEach( streetview_map => {
            const element = document.getElementById( streetview_map.element );
            const streetviewElement = document.getElementById( streetview_map.streetview_element );

            const markers = streetview_map.markers ? streetview_map.markers.map( ( marker ) => {
                return {
                  ...marker,
                  position: {
                    lat: parseFloat( marker.position.lat ),
                    lng: parseFloat( marker.position.lng )
                  }
                };
            }) : [];

            const defaultMarker = markers[ parseInt( streetview_map.defaultMarker ) ];

            const map = new google.maps.Map( element, {
                center: defaultMarker.position,
                zoom: 13
            });

            markers.forEach( marker => {
                const newMarker = new google.maps.Marker({
                    position: marker.position,
                    map: map
                });

                newMarker.addListener( 'click', () => {
                    const navigatorItem = streetviewElement.querySelector( '.streetview__controls--menu-items li[lat="' + marker.position.lat + '"][lng="' + marker.position.lng + '"]' );

                    if ( navigatorItem ) {
                        $( 'html, body' ).animate({
                            scrollTop: streetviewElement.offsetTop
                          }, 1000, function() {
                            navigatorItem.click();
                        });
                    }
                });
            });

        });
    };

} ( jQuery ) );

window.ubc_vrpress_streetview_map_init();
