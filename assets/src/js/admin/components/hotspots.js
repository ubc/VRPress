import React, { Fragment, useContext } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { uniqueID } from './../../helper';

import HotSpot from './hotspot';

import AppContext from './../context.js';

export default ( props ) => {

    let hotSpotTypes = [ 'Info', 'Link', 'Scene', 'Image', 'Audio', 'Video', 'oEmbed' ];
    const appContext = useContext( AppContext );
    const { selectedHotSpotIndex, setSelectedHotSpotIndex, shouldSceneChangeUpdatePov, saveCurrentPov, currentPOV } = appContext;

    const generateDefaultProps = () => {
		return {
			id: uniqueID(),
			title: 'untitled hotspot',
            pitch: currentPOV.current.pitch,
            yaw: currentPOV.current.yaw,
            text: 'undefined hotspot',
            realType: 'Info'
        };
    };

    const { hotspots, setScene, name, currentScene } = props;

    const removeHotspot = ( index ) => {
        saveCurrentPov();
        shouldSceneChangeUpdatePov.current = true;

        let newHotspots = [ ...hotspots ];

        newHotspots = newHotspots.filter( ( hotspot, hotspotIndex ) => {
			return hotspotIndex != index;
		});

        setScene( 'hotSpots', newHotspots );
    };

    const addHotspot = () => {
        saveCurrentPov();
        shouldSceneChangeUpdatePov.current = true;
        setScene( 'hotSpots', [ ...hotspots, generateDefaultProps() ]);
    };

    const setHotspot = ( index ) => {
        let newHotspots = [ ...hotspots ];
        return ( property, value ) => {
            newHotspots[ index ][ property ] = value;
            setScene( 'hotSpots', newHotspots );
        };
    };

    return (
        <Fragment>
            <hr/>
            <div className="hotspots" style={ { margin: '20px 0' } }>
                <button
                    className='button button-secondary button-large'
                    onClick={ ( e ) => {
                        e.preventDefault();
                        addHotspot();
                    } }
                    style={ { marginBottom: '20px' } }
                >Add hotspot for '{ `${ currentScene.title }` }'</button>

                <Tabs
                    forceRenderTabPanel={ true }
                    onSelect={ index => {
                        setSelectedHotSpotIndex( index );
                    }}
                    selectedIndex={ selectedHotSpotIndex }
                >
                    <TabList>
                    { hotspots.map( ( hotspot, index )=> {
                        return (
                            <Tab key={ index }>
                                { hotspot.text }
                                <button
                                    style={ { marginLeft: '10px' } }
                                    onClick={ ( e ) => {
                                        e.preventDefault();
                                        removeHotspot( index );
                                    } }
                                >x</button>
                            </Tab>
                        );
                    }) }
                    </TabList>

                    { hotspots.map( ( hotspot, index )=> {
                        return (
                            <TabPanel key={ index }>
                                <HotSpot
                                    hotspot={ hotspot }
                                    setHotspot={ setHotspot( index ) }
                                    name={ `${ name }[${ index }]`}
                                    currentScene={ currentScene }
                                    hotSpotTypes={ hotSpotTypes }
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
