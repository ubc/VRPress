/* eslint-disable camelcase */
import React, { Fragment } from 'react';

export default ( props ) => {

	const setImage = () => {
        jQuery( function( $ ) {

            // Set all variables to be used in scope
            var frame;

            // If the media frame already exists, reopen it.
            if ( frame ) {
                frame.open();
                return;
            }

            // Create a new media frame
            frame = wp.media({
                title: 'Select or Upload Media Of Your Chosen Persuasion',
                button: {
                    text: 'Use this media'
                },
                multiple: false  // Set to true to allow multiple files to be selected
            });

            // When an image is selected in the media frame...
            frame.on( 'select', function() {

                // Get media attachment details from the frame state
                var attachment = frame.state().get( 'selection' ).first().toJSON();
                props.setCallBack( attachment );
            });

            // Finally, open the modal on click
            frame.open();
        });
    };

    return (
        <Fragment>
            <div className="custom-img-container">
                <p className="hide-if-no-js">
                    <a
                        className={ `upload-custom-img ${ props.url ? 'hidden' : ''}` }
                        href={ ubc_vrpress_admin.upload_url }
                        onClick={ ( e ) => {
                            e.preventDefault();
                            setImage();
                        } }
                    >
                        Set media
                    </a>
                    <a
                        className={ `delete-custom-img ${ props.url ? '' : 'hidden'}` }
                        href="#"
                        onClick={ ( e ) => {
                            e.preventDefault();
                            props.clearCallBack();
                        } }
                        style={ { color: '#DC3232' } }
                    >
                        Remove media
                    </a>
                </p>

                <input
                    className="custom-img-id"
                    name={ props.name }
                    type="hidden"
                    value={ props.url ? props.url : '' }
                />
            </div>
        </Fragment>
    );
};
