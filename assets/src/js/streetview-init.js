/**
 * Initiate all existing google map streetview instances on current page.
 */

import './streetview-extend';
import './../scss/streetview-extend.scss';

/* eslint-disable camelcase */
( function( $ ) {
    window.ubc_vrpress_streetview_init = () => {
        if ( ! window.ubc_vrpress_streetviews ) {
            return;
        }

        function getHotspotIconByType( type, icon ) {
            switch ( type ) {
              case 'Info':
                icon = 'vrpress-hotspot iconType-Info';
                break;
              case 'Link':
                icon = 'vrpress-hotspot iconType-Link';
                break;
              case 'Video':
                icon = 'vrpress-hotspot iconType-Video';
                break;
              case 'Audio':
                icon = 'vrpress-hotspot iconType-Audio';
                break;
              case 'Image':
                icon = 'vrpress-hotspot iconType-Image';
                break;
              case 'oEmbed':
                icon = 'vrpress-hotspot iconType-oEmbed-' + icon;
                break;
            }

            return icon;
        }

        window.ubc_vrpress_streetviews.forEach( streetview => {
            const element = document.getElementById( streetview.element );

            const markers = streetview.markers ? streetview.markers.map( ( marker ) => {
                return {
                  ...marker,
                  position: {
                    lat: parseFloat( marker.position.lat ),
                    lng: parseFloat( marker.position.lng )
                  }
                };
              }) : [];

            const hotspots = streetview.hotSpots ? streetview.hotSpots.map( ( hotspot ) => {
            return {
                ...hotspot,
                pov: {
                    heading: parseFloat( hotspot.pov.heading ),
                    pitch: parseFloat( hotspot.pov.pitch )
                }
            };
            }) : [];

            const defaultMarker = markers[ parseInt( streetview.defaultMarker ) ];
            const panorama = new google.maps.StreetViewPanorama(
                element,
                {
                  position: defaultMarker.position,
                  linksControl: false,
                  panControl: false,
                  enableCloseButton: false,
                  addressControl: false
                }
            );
            const sv = new google.maps.StreetViewService();

            const modalControl = window.generateStreetViewModalCtrl();
            const navigatorControl = window.generatePanoNavigatorCtrl( defaultMarker, markers, function( lat, lng ) {
                sv.getPanorama({ location: { lat: lat, lng: lng }, radius: 50 }, function( data, status ) {
                    if ( 'OK' === status ) {
                        const location = data.location;
                        panorama.setPano( location.pano );
                    } else {
                        console.error( 'Street View data not found for this location.' );
                    }
                });
            });
            panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push( modalControl );
            panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push( navigatorControl );

            let hotspotMarkers = [];

            // Add markers
            hotspots.forEach( hotspot  => {
                const newHotSpot = new PanoMarker({
                    position: {
                        heading: hotspot.pov.heading,
                        pitch: hotspot.pov.pitch
                    },
                    container: element,
                    pano: panorama,
                    anchor: new google.maps.Point( 20, 20 ),
                    size: new google.maps.Size( 40, 40 ),
                    className: getHotspotIconByType( hotspot.type, hotspot.iconType )
                });

                newHotSpot.panoID = hotspot.pano;

                google.maps.event.addListener( newHotSpot, 'click', ( function( hotspot, element ) {
                    return function( event ) {
                        if ( ! hotspot[ hotspot.type ]) {
                            hotspot[ hotspot.type ] = {};
                        }

                        if ( 'Image' === hotspot.type ) {
                            hotspot[ hotspot.type ].content = `<div class="vrpress-modal-image-container"><img src="${ hotspot.Image.url }" alt="${ hotspot.Image.alt }" /><div class="vrpress-modal-image-container-caption">${ hotspot.Image.caption}</div>`;
                        }

                        if ( 'Audio' === hotspot.type ) {
                            hotspot[ hotspot.type ].content = `<audio controls><source src="${ hotspot.Audio.url }" type="audio/mp3">Your browser does not support the audio tag.</audio>`;
                        }

                        if ( 'Video' === hotspot.type ) {
                            hotspot[ hotspot.type ].content = `<video controls><source src="${ hotspot.Video.url }" type="video/mp4">Your browser does not support the video tag.</video>`;
                        }

                        if ( 'oEmbed' === hotspot.type && ! isNaN( hotspot.oEmbed.width ) && ! isNaN( hotspot.oEmbed.height ) ) {
                            hotspot[ hotspot.type ].content = `<div class="pnlm-render-container__iframe-container" style="padding-bottom:${ ( hotspot.oEmbed.height / hotspot.oEmbed.width * 100 ).toFixed( 2 ) }%;"><iframe src="${ hotspot.oEmbed.embedUrl }" allowfullscreen /></div>`;
                        }

                        if ( 'Link' === hotspot.type ) {
                            if ( 'yes' === hotspot[ hotspot.type ].newTab ) {
                                window.open( hotspot.Link.URL );
                            } else {
                                window.location.href = hotspot.Link.URL;
                            }
                        } else {
                            const modalElement = element.querySelector( '.map-container__hotspot-modal' );
                            const headingElement = modalElement.querySelector( '.map-container__hotspot-modal-heading h2' );
                            const contentElement = modalElement.querySelector( '.map-container__hotspot-modal-content' );

                            headingElement.innerHTML = hotspot.title;
                            contentElement.innerHTML = hotspot[ hotspot.type ].content ? hotspot[ hotspot.type ].content : '';
                            modalElement.classList.add( 'show' );
                        }
                    };
                }  ( hotspot, element ) ) );

                hotspotMarkers.push( newHotSpot );
            });

            panorama.addListener( 'pano_changed', () => {
                const pano = panorama.getPano();

                hotspotMarkers.forEach( hotspot => {
                    const hotspotPano = hotspot.panoID;

                    if ( pano == hotspotPano ) {
                        hotspot.setVisible( true );
                    } else {
                        hotspot.setVisible( false );
                    }
                });

                // Changed pano clickToGo based on selection
                const currentPano = markers.filter( ( marker ) => {
                    return marker.pano === panorama.pano;
                });

                if ( 0 !== currentPano.length && 'true' === currentPano[0].clickToGo ) {
                    panorama.setOptions({
                        clickToGo: false
                    });
                } else {
                    panorama.setOptions({
                        clickToGo: true
                    });
                }

                if ( 0 !== currentPano.length ) {

                    panorama.setOptions({
                        pov: {
                            heading: parseFloat( currentPano[0].pov.heading ),
                            pitch: parseFloat( currentPano[0].pov.pitch ),
                            zoom: parseFloat( currentPano[0].pov.zoom )
                        }
                    });
                }
            });
        });
    };
} ( jQuery ) );

window.ubc_vrpress_streetview_init();
