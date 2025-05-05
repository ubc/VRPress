/**
 * StreetView component renders settings related to VR streetview type in WordPress post edit page. It also renders preview use reactDom.render function
 */

/* eslint-disable camelcase */
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { GoogleMap, Marker, InfoWindow, Autocomplete, StreetViewPanorama } from '@react-google-maps/api';
import GoogleMapHotspots from './components/google-hotspots';
import GoogleMapMarkers from './components/google-markers';

import { pixel3dToPov } from './../helper';

const containerStyle = {
  width: '100%',
  height: '400px'
};

class StreetView extends Component {

  constructor( props ) {
    super( props );

    // Make sure lat and lng retrieved from database are converted to number instead of string.
    const markers = ubc_vrpress_admin.vr_cotent && ubc_vrpress_admin.vr_cotent.markers ? ubc_vrpress_admin.vr_cotent.markers.map( ( marker ) => {
      return {
        ...marker,
        position: {
          lat: parseFloat( marker.position.lat ),
          lng: parseFloat( marker.position.lng )
        },
        pov: {
          heading: parseFloat( marker.pov.heading ),
          pitch: parseFloat( marker.pov.pitch ),
          zoom: parseFloat( marker.pov.zoom )
        }
      };
    }) : [];

    // Make sure heading and pitch retrieved from database are converted to number instead of string.
    const hotspots = ubc_vrpress_admin.vr_cotent && ubc_vrpress_admin.vr_cotent.hotSpots ? ubc_vrpress_admin.vr_cotent.hotSpots.map( ( hotspot ) => {
      return {
        ...hotspot,
        pov: {
          heading: parseFloat( hotspot.pov.heading ),
          pitch: parseFloat( hotspot.pov.pitch )
        }
      };
    }) : [];

    this.state = {
      mapPosition: ubc_vrpress_admin.vr_cotent && markers[ parseInt( ubc_vrpress_admin.vr_cotent.defaultMarker ) ] ? markers[ parseInt( ubc_vrpress_admin.vr_cotent.defaultMarker ) ].position : {
          lat: this.props.center.lat,
          lng: this.props.center.lng
      },
      defaultMarker: ubc_vrpress_admin.vr_cotent ? parseInt( ubc_vrpress_admin.vr_cotent.defaultMarker ) : 0,
      markers: ubc_vrpress_admin.vr_cotent ? markers : [],
      hotSpots: ubc_vrpress_admin.vr_cotent ? hotspots : [],
      activeMarkerTab: 0,
      activeHotspotTab: 0,
      activePano: null,
      currentPOV: {
        heading: 100,
        pitch: 0
      }
    };

    this.autocomplete = null;
    this.icons = ubc_vrpress_admin.vr_icons;
    this.streetview = null;
    this.hotspotsInPreview = [];
  }

    /**
    * Render preview when component mounted.
    */
   componentDidMount() {
    this.paranoramaPreview();
   };

   /**
    * Re-render preview when state changes.
    * @param {object} prevProps previous values of props.
    * @param {object} prevState previous values of states.
    */
  componentDidUpdate( prevProps, prevState ) {
    this.paranoramaPreview();

    // Only reRender hotspots when state hotspot changes. Improve performance.
    if ( prevState.hotSpots !== this.state.hotSpots ) {
      this.reGenerateHotspots();
    }
  }

  /**
    * When the marker is dragged you get the lat and long using the functions available from event object.
    * Use getPanoByPosition to retrieve the pano ID to location dragged to.
    * Update lat, lng and panoID for the marker that dragged.
    *
    * @param event
    */
  async onMarkerDragEnd( index, event ) {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();

    const pano = await this.getPanoByPosition({ lat: newLat, lng: newLng});
    const newHotspots = this.updateMarkHotspotsPano( this.state.markers[this.state.activeMarkerTab].pano, pano );

    if ( pano ) {
      this.setState({
        markers: this.state.markers.map( ( marker, markerIndex ) => {
          return index !== markerIndex ? marker : { ...marker,
            position: {
              lat: newLat,
              lng: newLng
            },
            pano: pano
          };
        }),
        hotSpots: newHotspots
      }, () => {
        alert( 'Location updated! Please update hotspots accordingly!' );
      });
    } else {
      alert( 'Cannot find panorama in this area!' );
    }
  };

  /**
   * Assign autocomplete to a local variable once it is loaded so it is accessible inside entire component scope.
   * @param {object} autocomplete a reference to autocomplete instance.
   */
  onAutoCompleteLoad( autocomplete ) {
    this.autocomplete = autocomplete;
  }

  /**
   * When the user types an address in the search box
   * Update lat, lng and panoID for current selected marker
   * @param place
   */
  async onPlaceSelected() {
    if ( null === this.autocomplete ) {
      return;
    }

    const place = this.autocomplete.getPlace();
    const newLat = place.geometry.location.lat();
    const newLng = place.geometry.location.lng();

    const pano = await this.getPanoByPosition({ lat: newLat, lng: newLng});
    const newHotspots = this.updateMarkHotspotsPano( this.state.markers[this.state.activeMarkerTab].pano, pano );

    if ( pano ) {
      this.setState({
        markers: this.state.markers.map( ( marker, markerIndex ) => {
          return this.state.activeMarkerTab !== markerIndex ? marker : { ...marker,
            position: {
              lat: newLat,
              lng: newLng
            },
            pano: pano
          };
        }),
        hotSpots: newHotspots
      }, () => {
        alert( 'Location updated! Please update hotspots accordingly!' );
      });
    } else {
      alert( 'Cannot find panorama in this area!' );
    }
  };

  /**
   * Use google map streetviewService to get the Panorama ID based on Lat and Lng.
   * @param {object} position
   */
  async getPanoByPosition( position ) {
    const sv = new google.maps.StreetViewService();

    return new Promise( ( resolve, reject ) => {
      sv.getPanorama({ location: position, radius: 50 }, function( data, status ) {
        if ( 'OK' === status ) {
          resolve( data.location.pano );
        } else {
          resolve( false );
        }
      });
    });
  }

  /**
   * Onclick handler for hotspots in the preview.
   * Seprate but simillar to implementation in streetview-init.js
   * @param {object} marker marker that clicked on.
   * @param {object} event click event that triggered.
   */
  hotSpotClick( marker, event ) {
    const tempMarker = { ...marker };

    if ( ! tempMarker[ tempMarker.type ]) {
      tempMarker[ tempMarker.type ] = {};
    }

    if ( 'Image' === tempMarker.type ) {
      tempMarker[ tempMarker.type ].content = `<img src="${ tempMarker.Image.url }" alt="feature image on hotspot click" />`;
    }

    if ( 'Audio' === tempMarker.type ) {
      tempMarker[ tempMarker.type ].content = `<audio controls><source src="${ tempMarker.Audio.url }" type="audio/mp3">Your browser does not support the audio tag.</audio>`;
    }

    if ( 'Video' === tempMarker.type ) {
      tempMarker[ tempMarker.type ].content = `<video controls><source src="${ tempMarker.Video.url }" type="video/mp4">Your browser does not support the video tag.</video>`;
    }

    if ( 'oEmbed' === tempMarker.type && ! isNaN( tempMarker.oEmbed.width ) && ! isNaN( tempMarker.oEmbed.height ) ) {
      tempMarker[ tempMarker.type ].content = `<div class="pnlm-render-container__iframe-container" style="padding-bottom:${ ( tempMarker.oEmbed.height / tempMarker.oEmbed.width * 100 ).toFixed( 2 ) }%;"><iframe src="${ tempMarker.oEmbed.embedUrl }" allowfullscreen /></div>`;
    }

    if ( 'Link' === tempMarker.type ) {
      window.open( tempMarker.Link.URL );
    } else {
      const element = event.vb.target;
      const modalElement = element.closest( '#panorama-preview' ).querySelector( '.map-container__hotspot-modal' );
      const headingElement = modalElement.querySelector( '.map-container__hotspot-modal-heading h2' );
      const contentElement = modalElement.querySelector( '.map-container__hotspot-modal-content' );

      headingElement.innerHTML = tempMarker.title;
      contentElement.innerHTML = tempMarker[ tempMarker.type ].content ? tempMarker[ tempMarker.type ].content : '';
      modalElement.classList.add( 'show' );
    }
  }

  /**
   * Once streetview component loaded, store a reference to the streetview object for later use.
   * Generate controls, hotspots for re-rendered streetview.
   * @param {object} streetView streetview object that gets instantiated.
   */
  onPreviewLoad( streetView ) {
    this.streetview = streetView;

    const dom = window.generateStreetViewModalCtrl();
    this.streetview.controls[google.maps.ControlPosition.TOP_RIGHT].push( dom );
    this.reGenerateHotspots();
  }

  /**
   * Re-generate all the hotposts in preview.
   */
  reGenerateHotspots() {
    const element = document.getElementById( 'panorama-preview' );
    const thisNow = this;

    // Remove existing markers
    for ( let i = 0; i < this.hotspotsInPreview.length; i++ ) {
      this.hotspotsInPreview[i].setMap( null );
    }

    this.hotspotsInPreview = [];

    // Add hotspots
    let hotspotMarkers = [];

    // Add markers
    this.state.hotSpots.forEach( hotspot  => {
        const newHotSpot = new PanoMarker({
            position: {
                heading: hotspot.pov.heading,
                pitch: hotspot.pov.pitch
            },
            container: element,
            pano: this.streetview,
            anchor: new google.maps.Point( 20, 20 ),
            size: new google.maps.Size( 40, 40 ),
            className: this.getHotspotIconByType( hotspot.type, hotspot.iconType )
        });

        newHotSpot.panoID = hotspot.pano;
        newHotSpot.id = hotspot.id;

        function handleClick() {
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
            window.open( hotspot.Link.URL );
            } else {
            const modalElement = element.querySelector( '.map-container__hotspot-modal' );
            const headingElement = modalElement.querySelector( '.map-container__hotspot-modal-heading h2' );
            const contentElement = modalElement.querySelector( '.map-container__hotspot-modal-content' );

            headingElement.innerHTML = hotspot.title;
            contentElement.innerHTML = hotspot[ hotspot.type ].content ? hotspot[ hotspot.type ].content : '';
            modalElement.classList.add( 'show' );
          }
        }

        hotspotMarkers.push( newHotSpot );
        this.hotspotsInPreview.push( newHotSpot );


			/**
			 * Add drag drop support for hotspot
			 */
      let moved;
      let moveListener;
      google.maps.event.addListener( newHotSpot, 'mousedown', ( function( hotspot, element ) {
        return event => {
          moved = false;

          let move = event.target;
          let lastOffsetX = move.offsetLeft ? parseFloat( move.offsetLeft ) : 0,
            lastOffsetY = move.offsetTop ? parseFloat( move.offsetTop ) : 0;

          // Attach mouse move event after mouse down on hotspot
          jQuery( element ).on( 'mousemove', e => {
            handleMove( e, event.pageX, event.pageY, lastOffsetX, lastOffsetY );
          });

          moveListener = google.maps.event.addListener( newHotSpot, 'mousemove', e => {
            handleMove( e, event.pageX, event.pageY, lastOffsetX, lastOffsetY );
          });

          function handleMove( e, startX, startY, X, Y ) {
            moved = true;
            let newDx = e.pageX - startX,
              newDy = e.pageY - startY;
            jQuery( move ).css( 'left', newDx + X + 'px' );
            jQuery( move ).css( 'top', newDy + Y + 'px' );
          }
        };
      }  ( hotspot, element ) ) );

      // Stop mouse move events when mouse up
      google.maps.event.addListener( newHotSpot, 'mouseup', e => {
        if ( ! moved ) {
          handleClick();
        }

        handleMouseUp( e );
      });

      jQuery( element ).on( 'mouseup', e => {
        handleMouseUp( e );
      });

      function handleMouseUp( e ) {
        jQuery( element ).off( 'mousemove' );
        google.maps.event.removeListener( moveListener );
        if ( ! moved ) {
          return;
        }
        moved = false;

        // Update hotspot heading and pov after drag and drop.
        thisNow.updateHotspotPosition.bind( thisNow )(
          newHotSpot.marker_.offsetLeft,
          newHotSpot.marker_.offsetTop,
          thisNow.streetview.pov,
          thisNow.streetview.pov.zoom,
          document.getElementById( 'panorama-preview' ),
          newHotSpot.id
        );
      }

    });

    this.reRenderHotspots( hotspotMarkers );

    this.streetview.addListener( 'pano_changed', () => {

      // When pano changed, hotspots need to re-render to change its visibility.
      this.reRenderHotspots( hotspotMarkers );
    });
  }

  /**
   * Hide hotspots does not belong to current active pano, show hotspots belongs to current active pano.
   * @param {array} hotspotMarkers All hotspots in the streetview.
   */
  reRenderHotspots( hotspotMarkers ) {
    const pano = this.streetview.getPano();

    hotspotMarkers.forEach( hotspot => {
        const hotspotPano = hotspot.panoID;

        if ( pano == hotspotPano ) {
            hotspot.setVisible( true );
        } else {
            hotspot.setVisible( false );
        }
    });
  }

  /**
   * When pano changed, save pano, heading and pitch as state variable so can be used later when update hotspot location.
   */
  onPanoChanged() {
    this.onPovChange();

    this.setState({
      activePano: this.streetview.pano
    });
  }

  /**
   * Update marker position and panoID from the location it is currently in the preview.
   */
  async updateCurrentMarkerPosition() {
    const newLat = this.streetview.position.lat();
    const newLng = this.streetview.position.lng();

    const pano = await this.getPanoByPosition({ lat: newLat, lng: newLng});
    const newHotspots = this.updateMarkHotspotsPano( this.state.markers[this.state.activeMarkerTab].pano, pano );

    if ( pano ) {
      this.setState({
        markers: this.state.markers.map( ( marker, markerIndex ) => {
          return this.state.activeMarkerTab !== markerIndex ? marker : { ...marker,
            position: {
              lat: newLat,
              lng: newLng
            },
            pano: pano,
            pov: {
              heading: this.streetview.pov.heading ? this.streetview.pov.heading : 0,
              pitch: this.streetview.pov.pitch ? this.streetview.pov.pitch : 0,
              zoom: this.streetview.pov.zoom ? this.streetview.pov.zoom : 1
            }
          };
        }),
        hotSpots: newHotspots
      }, () => {
        alert( 'Location updated! Please update hotspots accordingly!' );
      });
    } else {
      alert( 'Cannot find panorama in this area!' );
    }
  }

  onPovChange() {
    if ( ! this.streetview ) {
      return;
    }

    this.setState({
      currentPOV: {
        heading: this.streetview.pov.heading,
        pitch: this.streetview.pov.pitch
      }
    });
  }

  updateMarkHotspotsPano( previousPanoId, panoId ) {
    const hotspots = this.state.hotSpots.map( hotspot => {
      return hotspot.pano === previousPanoId && hotspot.markerId === this.state.markers[this.state.activeMarkerTab].id ? {
        ...hotspot,
        pano: panoId
      } : hotspot;
    });

    return hotspots;
  }

  /**
   * Update marker pov based on the preview.
   */
  async updateCurrentMarkerPov() {
    this.setState({
      markers: this.state.markers.map( ( marker, markerIndex ) => {
        return this.state.activeMarkerTab !== markerIndex ? marker : { ...marker,
          pov: {
            heading: this.streetview.pov.heading ? this.streetview.pov.heading : 0,
            pitch: this.streetview.pov.pitch ? this.streetview.pov.pitch : 0,
            zoom: this.streetview.pov.zoom ? this.streetview.pov.zoom : 1
          }
        };
      })
    }, function() {
      alert( 'Point of view updated!' );
    });
  }

  /**
   * Update selected hotspot's position in the pano. If hotspot does not belong to current pano, error message will be provided and it prevents user from changing the hotspot position.
   */
  updateHotspotPosition( offSetX, offSetY, currentPov, zoom, viewport, hotspotID ) {

    // Find hotspot which triggered the action.
    const search = this.state.hotSpots.filter( hotspot => {
      return hotspot.id === hotspotID;
    });

    if ( 0 === search.length ) {
      return;
    }

    // Since the marker is 40px width and height. We're targeting the offset of the center of the hotspot.
    const pov = pixel3dToPov( offSetX + 20, offSetY + 20, currentPov, zoom, viewport );

    this.setState({
      hotSpots: this.state.hotSpots.map( ( hotSpot, hotspotIndex ) => {
        return hotSpot.id !== hotspotID ? hotSpot : { ...hotSpot,
          pov: pov
        };
      })
    });
  }

  /**
   * Function to render content in preview metabox.
   */
  paranoramaPreview() {

    const preview = document.getElementById( 'panorama-preview' );
    const buttons = document.getElementById( 'panorama-preview-buttons' );

    ReactDOM.render( (
      <Fragment>
        { 0 < this.state.markers.length ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={7}
          >
            <StreetViewPanorama
              position={ this.state.markers[this.state.activeMarkerTab].position }
              pov={ this.state.markers[this.state.activeMarkerTab].pov }
              visible={true}
              options={{
                addressControl: false,
                enableCloseButton: false,
                linksControl: false,
                panControl: false
              }}
              onLoad={ this.onPreviewLoad.bind( this ) }
              onPanoChanged={ this.onPanoChanged.bind( this ) }
              onPovChanged={ this.onPovChange.bind( this ) }
            />
          </GoogleMap>
        ) : '' }
      </Fragment>
    ), preview );

    ReactDOM.render( (
      <Fragment>
        { 0 < this.state.markers.length ? (
        <Fragment>
          <div style={ { margin: '10px 0' } }>
            <button
              className="button button-secondary button-large"
              onClick={ ( e ) => {
                e.preventDefault();
                this.updateCurrentMarkerPov();
              } }
              style={ { marginRight: '10px' } }
            >Update selected location point of view</button>
            <button
              className="button button-secondary button-large"
              onClick={ ( e ) => {
                e.preventDefault();
                this.updateCurrentMarkerPosition();
              } }
              style={ { marginRight: '10px' } }
            >Update selected location</button>
          </div>
        </Fragment>
        ) : '' }
      </Fragment>
    ), buttons );

  }

  getHotspotIconByType( type, icon ) {
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

  render() {
    return (
      <Fragment>
        <input
            type="hidden"
            value={ this.state.defaultMarker }
            name = { 'ubc_wpstreetview[defaultMarker]' }
        />
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={ this.state.mapPosition }
          zoom={ this.props.zoom }
        >

          {
            this.state.markers.map( ( marker, index ) => {
              return (
                <Fragment
                  key={ index }
                >
                  <Marker
                      draggable={true}
                      onDragEnd={ this.onMarkerDragEnd.bind( this, index ) }
                      position={ marker.position }
                      icon={ index === this.state.defaultMarker ? this.icons.markerDefault : this.icons.marker }
                  >
                  { index === this.state.activeMarkerTab ? (
                    <InfoWindow>
                        <div>
                            <h2 style={{ padding: 0, margin: 0 }}>{ marker.title }</h2>
                            <p style={{ padding: 0, margin: 0 }}>{ marker.description }</p>
                        </div>
                    </InfoWindow>
                  ) : '' }
                  </Marker>
                </Fragment>
              );
            })
          }
        </GoogleMap>

          <Autocomplete
            onLoad={ this.onAutoCompleteLoad.bind( this ) }
            onPlaceChanged={ this.onPlaceSelected.bind( this ) }
            types={[ 'geocode', 'establishment' ]}
          >
            <input
              type="text"
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '16px',
                marginTop: '2px',
                marginBottom: '20px'
            }}
            />
          </Autocomplete>
          <hr/>

          <GoogleMapMarkers
            markers={ this.state.markers }
            setMarkers={ ( newMarker ) => {
              this.setState({
                markers: newMarker
              });
            } }
            defaultMarker={ this.state.defaultMarker }
            setDefaultMarker={ ( marker ) => {
              this.setState({
                defaultMarker: marker
              });
            }}
            activeMarkerTab={ this.state.activeMarkerTab }
            setActiveMarkerTab={ ( tab ) => {
              this.setState({
                activeMarkerTab: tab
              });
            }}
            setActiveHotspotTab={ ( tab ) => {
              this.setState({
                activeHotspotTab: tab
              });
            }}
            setMapCenterPosition={ ( position ) => {
              this.setState({
                mapPosition: position
              });
            }}
            defaultPostion={ this.state.mapPosition }
            hotspots={ this.state.hotSpots }
            setHotspots={ ( newHotspot ) => {
              this.setState({
                hotSpots: newHotspot
              });
            } }
            name={ 'ubc_wpstreetview[markers]' }
          />

          { 0 < this.state.markers.length ? (
            <GoogleMapHotspots
              hotspots={ this.state.hotSpots }
              setHotspots={ ( newHotspot ) => {
                this.setState({
                  hotSpots: newHotspot
                });
              } }
              activeHotspotTab={ this.state.activeHotspotTab }
              setActiveHotspotTab={ ( tab ) => {
                this.setState({
                  activeHotspotTab: tab
                });
              }}
              activeMarker={ this.state.markers[this.state.activeMarkerTab] }
              defaultPostion={ this.state.mapPosition }
              name={ 'ubc_wpstreetview[hotSpots]' }
              currentPano={ this.state.activePano }
              currentPOV={ this.state.currentPOV }
            />
          ) : '' }

      </Fragment>
    );
  }
}

export default React.memo( StreetView );
