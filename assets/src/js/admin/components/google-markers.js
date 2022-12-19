/* eslint-disable camelcase */
import React, { Fragment } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { uniqueID, deepCopy } from '../../helper';

import GoogleMarker from './google-marker';

export default ( props ) => {

   const generateDefaultProps = async() => {
        const position = {
            lat: props.defaultPostion.lat - 0.001,
            lng: props.defaultPostion.lng + 0.001
        };

        const pano = await getPanoByPosition( position );

		return {
			id: uniqueID(),
            title: `untitled location ${ markers.length + 1 }`,
            description: '',
            position: position,
            clickToGo: 'false',
            pano: pano ? pano : '',
            pov: {
                heading: 0,
                pitch: 0,
                zoom: 1
            }
        };
   };

    const getPanoByPosition = async( position ) => {
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
    };

    const { markers, setMarkers, name, defaultMarker, setDefaultMarker, activeMarkerTab, setActiveMarkerTab, setMapCenterPosition, setActiveHotspotTab, hotspots, setHotspots } = props;

    const removeMarkers = async( index ) => {
        let newMarkers = [ ...markers ];
        const markerToRemove = newMarkers[index];

        newMarkers = newMarkers.filter( ( marker, markerIndex ) => {
			return markerIndex != index;
		});

        setMarkers( newMarkers );
        if ( defaultMarker >= newMarkers.length ) {
            setDefaultMarker( 0 );
        }
        setActiveMarkerTab( 0 );

        // Remove marker related hotspots
        const newHotspots = hotspots.filter( hotspot => {
            return hotspot.markerId !== markerToRemove.id;
        });
        setHotspots( newHotspots );
    };

    const addMarker = async() => {
      setMarkers([ ...markers, await generateDefaultProps() ]);
    };

    const setMarker = ( index ) => {
        let newMarkers = [ ...markers ];
        return ( property, value ) => {
            newMarkers[ index ][ property ] = value;
            setMarkers( newMarkers );
        };
    };

    const isFirstMarker = index => {
		return 0 === index;
	};

	const isLastMarker = index => {
		return index === markers.length - 1;
	};

	const markerMoveTo = ( currentIndex, targetIndex ) => {
		let newMarkers = deepCopy( markers );
		if ( ! newMarkers[ targetIndex ] || ! newMarkers[ currentIndex ]) {
			return;
		}
		let temp = newMarkers[ targetIndex ];
		newMarkers[ targetIndex ] = newMarkers[ currentIndex ];
		newMarkers[ currentIndex ] = temp;
		setActiveMarkerTab( targetIndex );
		setMarkers( newMarkers );

        if ( currentIndex === defaultMarker ) {
			setDefaultMarker( targetIndex );
		}

		if ( targetIndex === defaultMarker ) {
			setDefaultMarker( currentIndex );
		}
	};

    return (
        <Fragment>
            <hr/>
            <div className="markers" style={ { margin: '20px 0' } }>
                <button
                    className='button button-secondary button-large'
                    onClick={ ( e ) => {
                        e.preventDefault();
                        addMarker();
                    } }
                    style={ { marginBottom: '20px' } }
                >Add Location</button>

                <Tabs
                    forceRenderTabPanel={ true }
                    onSelect={ index => {
                        setActiveMarkerTab( index );
                        setActiveHotspotTab( 0 );
                        setMapCenterPosition( markers[index].position );
                    }}
                    selectedIndex={ activeMarkerTab }
                >
                    <TabList className="tabs-with-controls">
                    { markers.map( ( marker, index )=> {
                        return (
                            <Tab key={ index }>
                                { marker.title }
                                { activeMarkerTab === index ? (
                                    <Fragment>
                                        <span className="tab-controls">
                                            <button
                                                className="tab-previous"
                                                onClick={ ( e ) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    markerMoveTo( index, index - 1 );
                                                } }
                                                disabled={ isFirstMarker( index ) }
                                            >
                                                <img src={ `${ ubc_vrpress_admin.plugin_url }assets/src/image/chevron-left-solid.svg` } alt=""/>
                                            </button>
                                            <button
                                                className="tab-next"
                                                onClick={ ( e ) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    markerMoveTo( index, index + 1 );
                                                } }
                                                disabled={ isLastMarker( index ) }
                                            >
                                                <img src={ `${ ubc_vrpress_admin.plugin_url }assets/src/image/chevron-right-solid.svg` } alt=""/>
                                            </button>
                                            <button
                                                onClick={ ( e ) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    if ( ! confirm( `Do you want to remove location '${ marker.title }'?` ) ) {
                                                        return;
                                                    }
                                                    removeMarkers( index );
                                                } }
                                            >x</button>
                                        </span>
                                    </Fragment>
                                ) : '' }
                            </Tab>
                        );
                    }) }
                    </TabList>

                    { markers.map( ( marker, index )=> {
                        return (
                            <TabPanel key={ index }>
                                <GoogleMarker
                                    index={ index }
                                    marker={ marker }
                                    setMarker={ setMarker( index ) }
                                    name={ `${ name }[${ index }]`}
                                    defaultMarker={ defaultMarker }
                                    setDefaultMarker={ setDefaultMarker }
                                />
                            </TabPanel>
                        );
                    }) }
                </Tabs>
            </div>
            <hr/>
        </Fragment>
    );
};
