/**
 * This file extends functionalities on top of Pannellum library.
 * Including add custom pano modal html and custom controls.
 */

/* eslint-disable camelcase */
( function( $ ) {
    window.ubcVRPressInit = function( viewer ) {
        const configs = viewer.getConfig();
        const defaultScene = configs.default.firstScene;
        const scenes = configs.scenes;
        const panoId = viewer.getContainer().getAttribute( 'id' ).split( '-' )[1];

        let container = viewer.getContainer();

        // Append controls html.
        let navigatorHTML = '';

        // Update hotspot icon image based on hotspot type.
        viewer.on( 'load', function() {
            const configs = viewer.getConfig();
            configs.hotSpots.forEach( hotspot => {
                hotspot.div.classList.add( 'vrpress-hotspot' );
                if ( 'Info' === hotspot.realType ) {
                    hotspot.div.classList.add( 'type-Info', 'iconType-Info' );
                }
                if ( 'Link' === hotspot.realType ) {
                    hotspot.div.classList.add( 'type-Link', 'iconType-Link' );
                }
                if ( 'Image' === hotspot.realType ) {
                    hotspot.div.classList.add( 'type-Image', 'iconType-Image' );
                }
                if ( 'Video' === hotspot.realType ) {
                    hotspot.div.classList.add( 'type-Video', 'iconType-Video' );
                }
                if ( 'oEmbed' === hotspot.realType ) {
                    hotspot.div.classList.add( 'type-oEmbed', `iconType-oEmbed-${ hotspot.iconType }` );
                }
                if ( 'Scene' === hotspot.realType ) {
                    hotspot.div.classList.add( 'type-Scene', 'iconType-Scene' );

                    if ( hotspot.iconDirection ) {
                        hotspot.div.classList.add( `rotate-${hotspot.iconDirection}` );
                    }
                }
            });
        });

        // Sort scenes by position
        const sceneKeys = Object.keys( scenes ).sort( ( a, b ) => {
            return scenes[a].position - scenes[b].position;
        });

        sceneKeys.forEach( sceneKey => {
            navigatorHTML += `<li scene_id="${ sceneKey }">${ scenes[sceneKey].title }</li>`;
        });

        // Hotspot content modal HTML.
        let hotspotContentModal =
            `<div class="pnlm-container__hotspot-modal">
                <div class="pnlm-container__hotspot-modal-heading">
                    <h2></h2>
                    <button><img src="${ ubc_vrpress_admin.plugin_url + 'assets/src/image/times-solid.svg' }" alt=""></button>
                </div>
                <div class="pnlm-container__hotspot-modal-content">
                    <div class="pnlm-container__hotspot-modal-content-inner"></div>
                </div>
            </div>`;

        // Append controls to control container.
        $( container ).find( '.pnlm-controls-container' ).prepend( `
            <div class="pnlm-container__controls">
                ${ configs.showHomeControl ? `<div class="pnlm-container__controls--home"><img src="${ ubc_vrpress_admin.plugin_url + 'assets/src/image/home-solid.svg' }" alt=""></div>` : '' }
                ${ configs.showNavigatorControl ? `<div class="pnlm-container__controls--menu"><img src="${ ubc_vrpress_admin.plugin_url + 'assets/src/image/bars-solid.svg' }" alt=""></div>` : '' }
                ${ configs.showEmbed ? `<div class="pnlm-container__controls--embed"><img src="${ ubc_vrpress_admin.plugin_url + 'assets/src/image/code-solid.svg' }" alt=""></div>` : '' }
                ${ configs.showEmbed ? `<div class="pnlm-container__controls--embed-modal"><textarea disabled><iframe src="${ ubc_vrpress_admin.site_url }/?post_type=ubcvrpress&p=${ panoId }" frameborder="0" width=\"600\" height=\"600\"></iframe></textarea></div>` : '' }
                <div class="pnlm-container__controls--menu-items">
                    <nav aria-label="scene navigation">
                        <ul>
                            ${ navigatorHTML }
                        </ul>
                    </nav>
                </div>
            </div>
        ` );

        // Append modal to render container.
        $( container ).find( '.pnlm-render-container' ).prepend( `
            ${ hotspotContentModal }
        ` );

        $( container ).find( '.pnlm-container__hotspot-modal button' ).on( 'click', function( e ) {
            e.preventDefault();
            $( this ).closest( '.pnlm-container__hotspot-modal' ).removeClass( 'show' ).find( '.pnlm-container__hotspot-modal-content-inner' ).html( '' );
            $( this ).closest( '.pnlm-container' ).removeClass( 'modal-opened' );
        });

        $( container ).find( '.pnlm-container__controls--menu' ).on( 'click', function() {
            $( this ).closest( '.pnlm-container' ).find( '.pnlm-container__controls--menu-items' ).toggleClass( 'show' );
        });

        $( container ).find( '.pnlm-container__controls--embed' ).on( 'click', function() {
            $( this ).closest( '.pnlm-container' ).find( '.pnlm-container__controls--embed-modal' ).toggleClass( 'show' );
        });

        $( container ).find( '.pnlm-container__controls--menu-items li' ).on( 'click', function() {
            const sceneId = $( this ).attr( 'scene_id' );

            viewer.loadScene( sceneId );
            $( this ).closest( '.pnlm-container__controls--menu-items' ).toggleClass( 'show' );
        });

        $( container ).find( '.pnlm-container__controls--home' ).on( 'click', function() {
            viewer.loadScene( defaultScene );
        });
    };
} ( jQuery ) );
