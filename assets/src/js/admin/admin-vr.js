/* eslint-disable camelcase */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MediaUpload from './components/media-upload';
import Hotspots from './components/hotspots.js';
import { uniqueID, getTranslateValues, deepCopy } from './../helper';
import AppContext from './context.js';

import { Pannellum } from 'pannellum-react';
import './../pannellum-extend';

export default () => {

	const [ scenes, _setScenes ] = useState( ubc_vrpress_admin.vr_cotent.scenes ? ubc_vrpress_admin.vr_cotent.scenes : []);
	const [ defaultScene, setDefaultScene ] = useState( ubc_vrpress_admin.vr_cotent.default_scene ? parseInt( ubc_vrpress_admin.vr_cotent.default_scene ) : 0 );
	const [ selectedSceneIndex, setSelectedSceneIndex ] = useState( 0 );
	const [ selectedHotSpotIndex, setSelectedHotSpotIndex ] = useState( 0 );
	const [ settings, setSettings ] = useState( ubc_vrpress_admin.vr_settings ? ubc_vrpress_admin.vr_settings : {
		showTitle: true,
		autoRotate: false,
		zoomControl: true,
		fullScreenControl: true,
		homeControl: true,
		navigatorControl: true,
		showEmbed: false
	});

	const scenesRef = useRef( scenes );
	const shouldSceneChangeUpdatePreview = useRef( false );
	const shouldSceneChangeUpdatePov = useRef( false );
	const previewPano = useRef( null );
	const currentPOV = useRef({
		hfov: 100,
		pitch: 0,
		yaw: 0
	});

	const saveCurrentPov = () => {
		const viewer = previewPano.current.panorama;
		currentPOV.current = {
			hfov: viewer.getHfov(),
			pitch: viewer.getPitch(),
			yaw: viewer.getYaw()
		};
	};

	const setScenes = data => {
		scenesRef.current = data;
		_setScenes( data );
	};

	const generateDefaultSceneProps = () => {
		return {
			id: uniqueID(),
			title: `untitled pano ${ scenes.length + 1 }`,
			img: '',
			hotSpots: [],
			hfov: 100,
			pitch: 0,
			yaw: 0
		};
	};

	const addScene = () => {
		setScenes([ ...scenes, generateDefaultSceneProps() ]);
	};

	const removeScene = ( index ) => {
		setScenes( scenes.filter( ( scene, sceneIndex ) => {
			return sceneIndex != index;
		}) );

		setSelectedSceneIndex( 0 );
		setDefaultScene( 0 );
	};

	const SetScene = ( index ) => {
		return ( property, value ) => {
			let newScenes = [ ...scenes ];
			newScenes[ index ][ property ] = value;
			setScenes( newScenes );
		};
	};

	const isFirstScene = index => {
		return 0 === index;
	};

	const isLastScene = index => {
		return index === scenes.length - 1;
	};

	const sceneMoveTo = ( currentIndex, targetIndex ) => {
		let newScenes = deepCopy( scenesRef.current );
		if ( ! newScenes[ targetIndex ] || ! newScenes[ currentIndex ]) {
			return;
		}
		let temp = newScenes[ targetIndex ];
		newScenes[ targetIndex ] = newScenes[ currentIndex ];
		newScenes[ currentIndex ] = temp;
		setSelectedSceneIndex( targetIndex );
		setScenes( newScenes );

		if ( currentIndex === defaultScene ) {
			setDefaultScene( targetIndex );
		}

		if ( targetIndex === defaultScene ) {
			setDefaultScene( currentIndex );
		}
	};

	const updateCurrentSpherePov = () => {
		const viewer = previewPano.current.getViewer();

		let newScenes = deepCopy( scenesRef.current );

		newScenes[ selectedSceneIndex ].pitch = viewer.getPitch();
		newScenes[ selectedSceneIndex ].yaw = viewer.getYaw();
		newScenes[ selectedSceneIndex ].hfov = viewer.getHfov();

		setScenes( newScenes );
		alert( 'Point of view updated!' );
	};

	const handleHotspotClick = ( hotspot ) => {
		document.querySelector( '.pnlm-container' ).classList.add( 'modal-opened' );
		const hotspotModal = document.querySelector( '.pnlm-container__hotspot-modal' );
		const hotspotModalHeading = hotspotModal.querySelector( '.pnlm-container__hotspot-modal-heading h2' );
		const hotspotModalContent = hotspotModal.querySelector( '.pnlm-container__hotspot-modal-content' );

		if ( 'Info' === hotspot.realType ) {
			hotspot.content = hotspot.Info && hotspot.Info.content ? hotspot.Info.content : '';
		}

		if ( 'Link' === hotspot.realType ) {
			hotspot.content = `<p>Url redirection will not be functional in the preview. Redirection url is ${ hotspot.Link.URL }</p>`;
		}

		if ( 'Scene' === hotspot.realType ) {
			hotspot.content = '<p>Pano navigation will not be functional in the preview.</p>';
		}

		if ( 'Video' === hotspot.realType && hotspot.Video.url ) {
			hotspot.content = `<video controls><source src="${ hotspot.Video.url }" type="video/mp4">Your browser does not support the video tag.</video>`;
		}

		if ( 'Image' === hotspot.realType && hotspot.Image.url ) {
			hotspot.content = `<div class="vrpress-modal-image-container"><img src="${ hotspot.Image.url }" alt="${ hotspot.Image.alt }" /><div class="vrpress-modal-image-container-caption">${ hotspot.Image.caption}</div>`;
		}

		if ( 'oEmbed' === hotspot.realType && hotspot.oEmbed ) {
			hotspot.oEmbed.width = hotspot.oEmbed && hotspot.oEmbed.width ? hotspot.oEmbed.width : 600;
			hotspot.oEmbed.height = hotspot.oEmbed && hotspot.oEmbed.height ? hotspot.oEmbed.height : 600;
			if ( ! isNaN( hotspot.oEmbed.width ) && ! isNaN( hotspot.oEmbed.height ) ) {
				hotspot.content = `<div class="pnlm-render-container__iframe-container" style="padding-bottom:${ ( hotspot.oEmbed.height / hotspot.oEmbed.width * 100 ).toFixed( 2 ) }%;"><iframe src="${ hotspot.oEmbed.embedUrl }" allowfullscreen /></div>`;
			}
		}

		hotspotModalContent.innerHTML = hotspot.content;
		hotspotModalHeading.innerHTML = hotspot.text;
		hotspotModal.classList.add( 'show' );
	};

	const onPreviewLoad = () => {
		const viewer = previewPano.current.getViewer();
		const configs = viewer.getConfig();
		const preview = document.getElementById( 'panorama-preview' );

		/**
		 * Set some default configs which only to make extended script working. But not meaningful at all since react component don't have all the configs that normal library provides.
		 */
		configs.default = {};
		configs.default.firstScene = 0;
		configs.scenes = [];

		ubcVRPressInit( viewer );
		configs.hotSpots.forEach( hotspot => {
			hotspot.div.classList.add( 'vrpress-hotspot' );

			/**
			 * Set hotspot icons
			 */

			if ( 'Info' === hotspot.createTooltipArgs.type ) {
				hotspot.div.classList.add( 'type-Info', 'iconType-Info' );
			}
			if ( 'Link' === hotspot.createTooltipArgs.type ) {
				hotspot.div.classList.add( 'type-Link', 'iconType-Link' );
			}
			if ( 'Video' === hotspot.createTooltipArgs.type ) {
				hotspot.div.classList.add( 'type-Video', 'iconType-Video' );
			}
			if ( 'oEmbed' === hotspot.createTooltipArgs.type ) {
				hotspot.div.classList.add( 'type-oEmbed', `iconType-oEmbed-${ hotspot.createTooltipArgs.icon }` );
			}
			if ( 'Scene' === hotspot.createTooltipArgs.type ) {
				hotspot.div.classList.add( 'type-Scene', 'iconType-Scene' );
			}
			if ( 'Image' === hotspot.createTooltipArgs.type ) {
				hotspot.div.classList.add( 'type-Image', 'iconType-Image' );
			}

			/**
			 * Update hotspot id
			 */
			hotspot.id = hotspot.clickHandlerArgs.hotspot.id;

			/**
			 * Add drag drop support for hotspot
			 */
			let moved;
			jQuery( hotspot.div ).on( 'mousedown', function( event ) {
				moved = false;

				let move = event.target;

				let lastOffset = getTranslateValues( move );
				let lastOffsetX = lastOffset.x ? parseFloat( lastOffset.x ) : 0,
					lastOffsetY = lastOffset.y ? parseFloat( lastOffset.y ) : 0;

				let startX = event.pageX - lastOffsetX,
				startY = event.pageY - lastOffsetY;

				jQuery( hotspot.div ).on( 'mousemove', function( e ) {
					onMouseMove( e, startX, startY );
				});

				jQuery( preview ).on( 'mousemove', function( e ) {
					onMouseMove( e, startX, startY );
				});

				function onMouseMove( e, startX, startY ) {
					moved = true;
					let newDx = e.pageX - startX,
						newDy = e.pageY - startY;
					jQuery( move ).css( 'transform', 'translate(' + newDx + 'px, ' + newDy + 'px)' );
				}
			});

			jQuery( hotspot.div ).on( 'mouseup', function( event ) {
				if ( ! moved ) {
					handleHotspotClick( hotspot.clickHandlerArgs.hotspot );
				}

				handleMouseUp( event, this );
			});

			jQuery( preview ).on( 'mouseup', function( event ) {
				handleMouseUp( event );
			});

			function handleMouseUp( event, element = null ) {
				jQuery( element ).off( 'mousemove' );
				jQuery( preview ).off( 'mousemove' );

				if ( ! moved ) {
					return;
				}

				moved = false;

				// Get hotspot index in the array of selected scene of state variable
				let hotspotIndex = 0;
				while ( hotspotIndex < scenes[selectedSceneIndex].hotSpots.length ) {
					if ( hotspot.id == scenes[selectedSceneIndex].hotSpots[hotspotIndex].id ) {
						break;
					}
					hotspotIndex++;
				}

				// Mouse position
				const cordinates = viewer.mouseEventToCoords( event );
				let newScenes = deepCopy( scenesRef.current );
				newScenes[selectedSceneIndex].hotSpots[hotspotIndex].pitch = cordinates[0];
				newScenes[selectedSceneIndex].hotSpots[hotspotIndex].yaw = cordinates[1];
				shouldSceneChangeUpdatePreview.current = true;
				shouldSceneChangeUpdatePov.current = true;

				setScenes( newScenes );
			}
		});
	};

	const generatePreview = () => {
		if ( 0 === scenes.length ) {
			return;
		}

		const preview = document.getElementById( 'panorama-preview' );
		const buttons = document.getElementById( 'panorama-preview-buttons' );

		const currentScene = { ...scenes[ selectedSceneIndex ] };
		currentScene.hotSpots = currentScene.hotSpots ? currentScene.hotSpots : [];

		ReactDOM.render( currentScene.img ? (
			<Pannellum
				image={ 'http:' === location.protocol ? currentScene.img.replace( 'https:', 'http:' ) : currentScene.img.replace( 'http:', 'https:' ) }
				autoLoad
				onLoad={ onPreviewLoad }
				ref={ previewPano }
				pitch={ parseFloat( currentScene.pitch ) }
				yaw={ parseFloat( currentScene.yaw ) }
				hfov={ parseFloat( currentScene.hfov ) }
				onMouseup={evt => {
					saveCurrentPov();
				}}
			>
				{ currentScene.hotSpots.map( ( hotspot, index ) => {
					return (
						<Pannellum.Hotspot
							key={ index }
							type="custom"
							pitch={ hotspot.pitch }
							yaw={ hotspot.yaw }
							handleClickArg={{ 'hotspot': hotspot }}
							tooltipArg={ {
								type: hotspot.realType,
								icon: hotspot.iconType ? hotspot.iconType : null
							} }
						/>
					);
				}) }
			</Pannellum>
		) : '', preview, () => {
			if ( shouldSceneChangeUpdatePreview.current ) {
				previewPano.current.forceRender();
				shouldSceneChangeUpdatePreview.current = false;
			}

			if ( shouldSceneChangeUpdatePov.current ) {
				previewPano.current.panorama.lookAt( currentPOV.current.pitch, currentPOV.current.yaw, currentPOV.current.hfov, false );
				shouldSceneChangeUpdatePov.current = false;
			}
		});

		ReactDOM.render( (
			<Fragment>
				{ 0 < scenes.length ? (
				<Fragment>
					<div style={ { margin: '10px 0' } }>
						<button
							className="button button-secondary button-large"
							onClick={ ( e ) => {
								e.preventDefault();
								updateCurrentSpherePov();
							} }
							style={ { marginRight: '10px' } }
						>Update selected pano point of view</button>
					</div>
				</Fragment>
				) : '' }
			</Fragment>
		), buttons );
	};

	const updateSettings = () => {
		const settingsSection = document.getElementById( 'panorama-settings' );

		ReactDOM.render( (
			<table className="form-table">
				<tbody>
					<tr>
						<th>Show Pano Title</th>
						<td>
							<input
								type="checkbox"
								name="ubc_vr_settings[showTitle]"
								checked={ undefined !== settings.showTitle ? settings.showTitle : false }
								onChange={ e => {
									setSettings({
										...settings,
										showTitle: e.target.checked
									});
								} }
							/>
						</td>
					</tr>
					<tr>
						<th>Enable Auto Rotate</th>
						<td>
							<input
								type="checkbox"
								name="ubc_vr_settings[autoRotate]"
								checked={ undefined !== settings.autoRotate ? settings.autoRotate : false }
								onChange={ e => {
									setSettings({
										...settings,
										autoRotate: e.target.checked
									});
								} }
							/>
						</td>
					</tr>
					<tr>
						<th>Enable Zoom Control</th>
						<td>
							<input
								type="checkbox"
								name="ubc_vr_settings[zoomControl]"
								checked={ undefined !== settings.zoomControl ? settings.zoomControl : false }
								onChange={ e => {
									setSettings({
										...settings,
										zoomControl: e.target.checked
									});
								} }
							/>
						</td>
					</tr>
					<tr>
						<th>Enable Full Screen Control</th>
						<td>
							<input
								type="checkbox"
								name="ubc_vr_settings[fullScreenControl]"
								checked={ undefined !== settings.fullScreenControl ? settings.fullScreenControl : false }
								onChange={ e => {
									setSettings({
										...settings,
										fullScreenControl: e.target.checked
									});
								} }
							/>
						</td>
					</tr>
					<tr>
						<th>Enable Home Control</th>
						<td>
							<input
								type="checkbox"
								name="ubc_vr_settings[homeControl]"
								checked={ undefined !== settings.homeControl ? settings.homeControl : false }
								onChange={ e => {
									setSettings({
										...settings,
										homeControl: e.target.checked
									});
								} }
							/>
						</td>
					</tr>
					<tr>
						<th>Enable Navigator Control</th>
						<td>
							<input
								type="checkbox"
								name="ubc_vr_settings[navigatorControl]"
								checked={ undefined !== settings.navigatorControl ? settings.navigatorControl : false }
								onChange={ e => {
									setSettings({
										...settings,
										navigatorControl: e.target.checked
									});
								} }
							/>
						</td>
					</tr>
					<tr>
						<th>Show Embed Code</th>
						<td>
							<input
								type="checkbox"
								name="ubc_vr_settings[showEmbed]"
								checked={ undefined !== settings.showEmbed ? settings.showEmbed : false }
								onChange={ e => {
									setSettings({
										...settings,
										showEmbed: e.target.checked
									});
								} }
							/>
						</td>
					</tr>
				</tbody>
			</table>
		), settingsSection );
	};

	useEffect( () => {
		generatePreview();
	}, [ scenes, selectedSceneIndex ]);

	useEffect( () => {
		updateSettings();
	}, [ settings, setSettings ]);

	useEffect( () => {
		if ( ! scenes[ selectedSceneIndex ]) {
			return;
		}
		currentPOV.current = {
			hfov: scenes[ selectedSceneIndex ].hfov ? parseFloat( scenes[ selectedSceneIndex ].hfov ) : 100,
			pitch: scenes[ selectedSceneIndex ].pitch ? parseFloat( scenes[ selectedSceneIndex ].pitch ) : 0,
			yaw: scenes[ selectedSceneIndex ].yaw ? parseFloat( scenes[ selectedSceneIndex ].yaw ) : 0
		};

	}, [ selectedSceneIndex ]);

	return (
		<AppContext.Provider
			value={{
				scenes,
				selectedSceneIndex,
				setSelectedSceneIndex,
				selectedHotSpotIndex,
				setSelectedHotSpotIndex,
				shouldSceneChangeUpdatePov,
				saveCurrentPov,
				currentPOV
			}}
		>
			<h2 style={ { fontWeight: 'bold', fontSize: '1rem', padding: '0', fontSize: '20px' } }>Tour Content</h2>
			<button
				className='button button-secondary button-large'
				style={ {
					margin: '20px 0'
				} }
				onClick={ ( e ) => {
					e.preventDefault();
					addScene();
				} }
			>Add Pano</button>

			<input
				type="hidden"
				value={ defaultScene }
				name={ 'ubc_vrpress[default_scene]' }
			/>

			<Tabs
				forceRenderTabPanel={ true }
				onSelect={ index => {
					setSelectedSceneIndex( index );
				}}
				selectedIndex={ selectedSceneIndex }
			>
				<TabList className="tabs-with-controls">
				{ scenes.map( ( scene, index )=> {
					return (
						<Tab key={ index }>
							{ scene.title }
							{ selectedSceneIndex === index ? (
								<Fragment>
									<span className="tab-controls">
										<button
											className="tab-previous"
											onClick={ ( e ) => {
												e.preventDefault();
												e.stopPropagation();
												sceneMoveTo( index, index - 1 );
											} }
											disabled={ isFirstScene( index ) }
										>
											<img src={ `${ ubc_vrpress_admin.plugin_url }assets/src/image/chevron-left-solid.svg` } alt=""/>
										</button>
										<button
											className="tab-next"
											onClick={ ( e ) => {
												e.preventDefault();
												e.stopPropagation();
												sceneMoveTo( index, index + 1 );
											} }
											disabled={ isLastScene( index ) }
										>
											<img src={ `${ ubc_vrpress_admin.plugin_url }assets/src/image/chevron-right-solid.svg` } alt=""/>
										</button>
										<button
											className="tab-remove"
											onClick={ ( e ) => {
												e.preventDefault();
												e.stopPropagation();
												if ( ! confirm( `Do you want to remove pano '${ scene.title }'?` ) ) {
													return;
												}
												removeScene( index );
											} }
										>x</button>
									</span>
								</Fragment>
							) : ''
						}
						</Tab>
					);
				}) }
				</TabList>

				{ scenes.map( ( scene, index )=> {
					return (
						<TabPanel key={ index }>
							<input
								type="hidden"
								value={ scene.id }
								name = { `ubc_vrpress[scenes][${ index }][id]` }
							/>
							<input
								type="hidden"
								value={ index }
								name = { `ubc_vrpress[scenes][${ index }][position]` }
							/>

							<input
								type="hidden"
								value={ scene.hfov }
								name = { `ubc_vrpress[scenes][${ index }][hfov]` }
							/>
							<input
								type="hidden"
								value={ scene.pitch }
								name = { `ubc_vrpress[scenes][${ index }][pitch]` }
							/>
							<input
								type="hidden"
								value={ scene.yaw }
								name = { `ubc_vrpress[scenes][${ index }][yaw]` }
							/>

							<table className="form-table" role="presentation">
								<tbody>
									<tr>
										<th>Default Pano?</th>
										<td>
											<input
												type="checkbox"
												value={ index }
												checked={ index === defaultScene }
												onChange={ ( e ) => {
													const valueSelected = parseInt( e.target.value );

													if ( valueSelected === defaultScene && 0 === valueSelected ) {
														return;
													} else if ( valueSelected === defaultScene ) {
														setDefaultScene( 0 );
													} else {
														setDefaultScene( valueSelected );
													}
												} }
											/>
											<p className="description">Default pano will be loaded first during tour intialization.</p>
										</td>
									</tr>

									<tr>
										<th>Pano Title</th>
										<td>
											<input
												type="text"
												value={ scene.title }
												name={ `ubc_vrpress[scenes][${ index }][title]` }
												className='large-text'
												onChange={ ( e ) => {
													SetScene( index )( 'title', e.target.value );
												} }
											/>
											<p className="description">Title of the pano.</p>
										</td>
									</tr>

									<tr>
										<th>Pano Image</th>
										<td>
											<img className="custom-image-preview" src={ scene.img ? scene.img : ubc_vrpress_admin.placeholder_url } alt="" />
											<MediaUpload
												name={ `ubc_vrpress[scenes][${ index }][img]` }
												url={ scene.img }
												setCallBack={ ( attachment ) => {
													SetScene( index )( 'img', attachment.url );
												} }
												clearCallBack={ () => {
													SetScene( index )( 'img', '' );
												} }
											/>
										</td>
									</tr>
								</tbody>
							</table>

							<Hotspots
								hotspots={ scene.hotSpots ? scene.hotSpots : [] }
								setScene={ SetScene( index ) }
								currentScene={ scene }
								name={ `ubc_vrpress[scenes][${ index }][hotSpots]` }
							/>
						</TabPanel>
					);
				}) }
			</Tabs>
		</AppContext.Provider>
	);
};
