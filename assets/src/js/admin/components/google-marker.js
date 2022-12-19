import React, { Fragment } from 'react';
import MediaUpload from './media-upload';

export default ( props ) => {
    const { index, marker, setMarker, name, setDefaultMarker, defaultMarker } = props;

    return (
        <table className="form-table" role="presentation">
            <tbody>
                <tr>
                    <th style={ { padding: 0 }}></th>
                    <td style={ { padding: 0 }}>
                    <input
                        type="hidden"
                        value={ marker.id }
                        name = { `${ name }[id]` }
                    />
                    <input
                        type="hidden"
                        value={ marker.position.lat }
                        name = { `${ name }[position][lat]` }
                    />
                    <input
                        type="hidden"
                        value={ marker.position.lng }
                        name = { `${ name }[position][lng]` }
                    />
                    <input
                        type="hidden"
                        value={ marker.pov.heading }
                        name = { `${ name }[pov][heading]` }
                    />
                    <input
                        type="hidden"
                        value={ marker.pov.pitch }
                        name = { `${ name }[pov][pitch]` }
                    />
                    <input
                        type="hidden"
                        value={ marker.pov.zoom }
                        name = { `${ name }[pov][zoom]` }
                    />
                    <input
                        type="hidden"
                        value={ marker.pano }
                        name = { `${ name }[pano]` }
                    />
                    </td>
                </tr>

                <tr>
                    <th>Default Location?</th>
                    <td>
                        <label>
                            <input
                                type="checkbox"
                                checked={ index === defaultMarker }
                                onChange={ ( e ) => {
                                    const valueSelected = 'checkbox' === e.target.type ? e.target.checked : e.target.value;
                                    if ( valueSelected  ) {
                                        setDefaultMarker( index );
                                    } else {
                                        setDefaultMarker( 0 );
                                    }
                                } }
                            />
                            Default Location?
                        </label>
                        <p className="description">Default location will be loaded first during tour intialization.</p>
                    </td>
                </tr>

                <tr>
                    <th>Disable ClickToGo?</th>
                    <td>
                        <label>
                            <input
                                type="checkbox"
                                value={ 'true' === marker.clickToGo ? 'true' : 'false' }
                                checked={ 'true' === marker.clickToGo }
                                onChange={ ( e ) => {
                                    setMarker( 'clickToGo', 'true' === marker.clickToGo ? 'false' : 'true' );
                                } }
                                name={ `${ name }[clickToGo]` }
                            />
                        </label>
                        <p className="description">When checked, the ability to navigate away from current location is disabled. Use controls such as navigator and home button are exceptional.</p>
                    </td>
                </tr>

                <tr>
                    <th>Location Title</th>
                    <td>
                        <input
                            value={ marker.title }
                            name={ `${ name }[title]` }
                            type="text"
                            className='large-text'
                            onChange={ ( e ) => {
                                e.preventDefault();
                                setMarker( 'title', e.target.value );
                            } }
                        />
                        <p className="description">Title of the location, will show in navigator.</p>
                    </td>
                </tr>

                <tr>
                    <th>Location Description</th>
                    <td>
                        <textarea
                            value={ marker.description }
                            name={ `${ name }[description]` }
                            className='large-text'
                            rows="10"
                            onChange={ ( e ) => {
                                e.preventDefault();
                                setMarker( 'description', e.target.value );
                            } }
                        >
                        </textarea>
                        <p className="description">Description of the location.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
