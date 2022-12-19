/**
 * Extend google map javascript API streetview.
 * Add custom modal html, controls and etc.
 */

/* eslint-disable camelcase */
( function( $ ) {
    window.generateStreetViewModalCtrl = () => {
        const mainDiv = document.createElement( 'DIV' );
        mainDiv.classList.add( 'map-container__hotspot-modal' );
        mainDiv.innerHTML = `
          <div class='map-container__hotspot-modal-heading'>
            <h2></h2>
            <button><img src='${ ubc_vrpress_admin.plugin_url }assets/src/image/times-solid.svg' alt="" /></button>
          </div>
          <div class='map-container__hotspot-modal-content'></div>
      `;

        return mainDiv;
    };

    window.generatePanoNavigatorCtrl = ( defaultMarker, markers, cb ) => {
      const mainDiv = document.createElement( 'DIV' );
      mainDiv.classList.add( 'map-container__pano-navigator' );

      let navigatorHTML = '';

      markers.forEach( marker => {
        navigatorHTML += `<li lat="${ marker.position.lat }" lng="${ marker.position.lng }">${ marker.title }</li>`;
      });

      mainDiv.innerHTML = `
        <div class="streetview__controls">
            <div class="streetview__controls--menu"><img src="${ ubc_vrpress_admin.plugin_url + 'assets/src/image/bars-solid-gray.svg' }" alt=""></div>
            <div class="streetview__controls--home"><img src="${ ubc_vrpress_admin.plugin_url + 'assets/src/image/home-solid-gray.svg' }" alt=""></div>
        </div>
        <div class="streetview__controls--menu-items">
            <nav aria-label="scene navigation">
                <ul>
                    ${ navigatorHTML }
                </ul>
            </nav>
        </div>
      `;

      mainDiv.querySelector( '.streetview__controls--menu' ).addEventListener( 'click', () => {
        mainDiv.querySelector( '.streetview__controls--menu-items' ).classList.toggle( 'show' );
      });

      mainDiv.querySelectorAll( '.streetview__controls--menu-items li' ).forEach( item => {
        item.addEventListener( 'click', ( event ) => {
          const lat = parseFloat( event.target.getAttribute( 'lat' ) );
          const lng = parseFloat( event.target.getAttribute( 'lng' ) );
          cb( lat, lng );
          mainDiv.querySelector( '.streetview__controls--menu-items' ).classList.remove( 'show' );
        });
      });

      mainDiv.querySelector( '.streetview__controls--home' ).addEventListener( 'click', () => {
        cb( defaultMarker.position.lat, defaultMarker.position.lng );
        mainDiv.querySelector( '.streetview__controls--menu-items' ).classList.remove( 'show' );
      });

      return mainDiv;
  };

    $( document ).on( 'click', '.map-container__hotspot-modal button', function( e ) {
        e.preventDefault();
        const modal = $( this ).closest( '.map-container__hotspot-modal' );
        modal.find( '.map-container__hotspot-modal-heading h2' ).html( '' );
        modal.find( '.map-container__hotspot-modal-content' ).html( '' );
        modal.removeClass( 'show' );
    });
} ( jQuery ) );
