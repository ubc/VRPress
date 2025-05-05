import React, { Fragment } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { uniqueID } from '../../helper';

import GoogleHotspot from './google-hotspot';

export default ( props ) => {

   let hotspotTypes = [ 'Info', 'Link', 'Image', 'Audio', 'Video', 'oEmbed' ];

   const generateDefaultProps = () => {
		return {
			id: uniqueID(),
			title: 'untitled hotspot',
            type: 'Info',
            pano: props.currentPano,
            markerId: props.activeMarker.id,
            pov: {
                heading: props.currentPOV.heading,
                pitch: props.currentPOV.pitch
            }
        };
   };

    const { hotspots, setHotspots, name, activeHotspotTab, setActiveHotspotTab, activeMarker } = props;

    const removeHotspots = ( index ) => {
        let newHotspots = [ ...hotspots ];

        newHotspots = newHotspots.filter( ( hotspot, hotspotIndex ) => {
			return hotspotIndex != index;
		});

        setHotspots( newHotspots );
        setActiveHotspotTab( 0 );
    };

    const addHotspot = () => {
      setHotspots([ ...hotspots, generateDefaultProps() ]);
    };

    const setHotspot = ( index ) => {
        let newHotspot = [ ...hotspots ];
        return ( property, value ) => {
            newHotspot[ index ][ property ] = value;
            setHotspots( newHotspot );
        };
    };

    return (
        <Fragment>
            <hr/>
            <div className="markers" style={ { margin: '20px 0' } }>
                <button
                    className='button button-secondary button-large'
                    onClick={ ( e ) => {
                        e.preventDefault();
                        addHotspot();
                    } }
                    style={ { marginBottom: '20px' } }
                >Add Hotspot</button>

                <Tabs
                    forceRenderTabPanel={ true }
                    onSelect={ index => {
                        setActiveHotspotTab( index );
                    }}
                    selectedIndex={ activeHotspotTab }
                >
                    <TabList>
                    { hotspots.map( ( hotspot, index )=> {
                        return (
                            <Tab
                                key={ index }
                                style={ activeMarker.pano != hotspot.pano || activeMarker.id != hotspot.markerId ? { 'display': 'none' } : {} }
                            >
                                { hotspot.title }
                                <button
                                    style={ { marginLeft: '10px' } }
                                    onClick={ ( e ) => {
                                        e.preventDefault();
                                        removeHotspots( index );
                                    } }
                                >x</button>
                            </Tab>
                        );
                    }) }
                    </TabList>

                    { hotspots.map( ( hotspot, index )=> {
                        return (
                            <TabPanel
                                key={ index }
                                style={ activeMarker.pano != hotspot.pano || activeMarker.id != hotspot.markerId ? { 'display': 'none' } : {} }
                            >
                                <GoogleHotspot
                                    hotspot={ hotspot }
                                    setHotspot={ setHotspot( index ) }
                                    name={ `${ name }[${ index }]`}
                                    hotspotTypes={ hotspotTypes }
                                    currentPano={ props.currentPano }
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
