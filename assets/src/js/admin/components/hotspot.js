import React, { Fragment, useContext } from 'react';
import AppContext from './../context.js';

import MediaUpload from './media-upload';

export default ( props ) => {
    const { hotspot, setHotspot, name, currentScene, hotSpotTypes } = props;
    const appContext = useContext( AppContext );
    const { scenes } = appContext;

    const setHotspotByType = ( type ) => {
        const temp = hotspot[ type ] ? hotspot[ type ] : {};
        return ( property, value ) => {
            temp[ property ] = value;
            setHotspot( type, temp );
        };
    };

    const getoEmbed = ( url ) => {
        if ( ! url ) {
            return;
        }

        const data = {
            action: 'ubc_vrpress_get_oembed',
            // eslint-disable-next-line camelcase
            ubc_vrpress_nonce: ubc_vrpress_admin.ajax_nonce,
            url: url
        };

        return jQuery.post( ajaxurl, data );
    };

    const iconTypes = [ 'Image', 'Video', 'Document' ];

    return (
        <Fragment>
            <input
                type="hidden"
                value={ hotspot.id }
                name = { `${ name }[id]` }
                onChange={ () => { return; } }
            />
            <input
                type="hidden"
                value={ hotspot.pitch }
                name={ `${ name }[pitch]` }
                onChange={ () => { return; } }
            />
            <input
                type="hidden"
                value={ hotspot.yaw }
                name={ `${ name }[yaw]` }
                onChange={ () => { return; } }
            />

            <table className="form-table" role="presentation">
                <tbody>

                    <tr>
                        <th>Hotspot Title</th>
                        <td>
                            <input
                                value={ hotspot.text }
                                name={ `${ name }[text]` }
                                type="text"
                                className='large-text'
                                onChange={ ( e ) => {
                                    e.preventDefault();
                                    setHotspot( 'text', e.target.value );
                                } }
                            />
                            <p className="description">Title of the hotspot, will show inside the modal on click.</p>
                        </td>
                    </tr>

                    <tr>
                        <th>Hotspot Type</th>
                        <td>
                            <select
                                value={ hotspot.realType }
                                className='large-text'
                                name={ `${ name }[realType]` }
                                onChange={ ( e ) => {
                                    e.preventDefault();
                                    setHotspot( 'realType', e.target.value );
                                } }
                            >
                                { hotSpotTypes.map( ( type, index ) => {
                                    let label = 'oEmbed' === type ? 'Embeds' : type;
                                    label = 'Scene' === type ? 'Pano' : label;
                                    return <option value={ type } key={ index } >{ label }</option>;
                                }) }
                            </select>
                            <p className="description">Type of the hotspot</p>
                        </td>
                    </tr>

                    { 'Info' === hotspot.realType ? (
                        <tr>
                            <th>Content</th>
                            <td>
                                <textarea
                                    value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].content ? hotspot[ hotspot.realType ].content : '' }
                                    name={ `${ name }[${ hotspot.realType }][content]` }
                                    rows="10"
                                    className='large-text'
                                    onChange={ ( e ) => {
                                        e.preventDefault();
                                        setHotspotByType( hotspot.realType )( 'content', e.target.value );
                                    } }
                                >
                                </textarea>
                                <p className="description">Content to be displayed in the modal. Valid html is acceptable.</p>
                            </td>
                        </tr>
                    ) : null }

                    { 'Link' === hotspot.realType ? (
                        <tr>
                            <th>Link to</th>
                            <td>
                                <input
                                    type="url"
                                    value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].URL ? hotspot[ hotspot.realType ].URL : '' }
                                    name={ `${ name }[${ hotspot.realType }][URL]` }
                                    className='large-text'
                                    onChange={ ( e ) => {
                                        e.preventDefault();
                                        setHotspotByType( hotspot.realType )( 'URL', e.target.value );
                                    } }
                                >
                                </input>
                                <p className="description">Url to be redirected to on hotspot click.</p>
                            </td>
                        </tr>
                    ) : null }

                    { 'Image' === hotspot.realType ? (
                        <Fragment>
                            <tr>
                                <th>Image Url</th>
                                <td>
                                    <Fragment>
                                        { hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].url ? (
                                            <input
                                                realtype="text"
                                                className='large-text disabled'
                                                name={ `${ name }[${ hotspot.realType }][url]` }
                                                value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].url ? hotspot[ hotspot.realType ].url : '' }
                                                onChange={ () => { return; } }
                                            />
                                        ) : '' }
                                        <MediaUpload
                                            name={ `${ name }[${ hotspot.realType }][url]` }
                                            url={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].url ? hotspot[ hotspot.realType ].url : '' }
                                            setCallBack={ ( attachment ) => {
                                                setHotspotByType( hotspot.realType )( 'url', attachment.url );
                                            } }
                                            clearCallBack={ () => {
                                                setHotspotByType( hotspot.realType )( 'url', '' );
                                            } }
                                        />
                                        <p className="description">Show image content in modal.</p>
                                    </Fragment>
                                </td>
                            </tr>
                            <tr>
                                <th>Caption</th>
                                <td>
                                    <input
                                        type="text"
                                        value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].caption ? hotspot[ hotspot.realType ].caption : '' }
                                        name={ `${ name }[${ hotspot.realType }][caption]` }
                                        className='large-text'
                                        onChange={ ( e ) => {
                                            e.preventDefault();
                                            setHotspotByType( hotspot.realType )( 'caption', e.target.value );
                                        } }
                                    >
                                    </input>
                                    <p className="description">Image caption.</p>
                                </td>
                            </tr>
                            <tr>
                                <th>Alt Text</th>
                                <td>
                                    <input
                                        type="text"
                                        value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].alt ? hotspot[ hotspot.realType ].alt : '' }
                                        name={ `${ name }[${ hotspot.realType }][alt]` }
                                        className='large-text'
                                        onChange={ ( e ) => {
                                            e.preventDefault();
                                            setHotspotByType( hotspot.realType )( 'alt', e.target.value );
                                        } }
                                    >
                                    </input>
                                    <p className="description">Image alt text to show when image fail to load.</p>
                                </td>
                            </tr>
                        </Fragment>
                    ) : null }


                    { 'Scene' === hotspot.realType ? (
                        <tr>
                            <th>Link to Pano</th>
                            <td>
                                <Fragment>
                                    <select
                                        value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].sceneId ? hotspot[ hotspot.realType ].sceneId : '' }
                                        name={ `${ name }[${ hotspot.realType }][sceneId]` }
                                        className='large-text'
                                        onChange={ ( e ) => {
                                            e.preventDefault();
                                            setHotspotByType( hotspot.realType )( 'sceneId', e.target.value );
                                        } }
                                    >
                                        <option value="">Select a pano to link to</option>
                                        { scenes.map( ( scene, index ) => {
                                            return currentScene !== scene ? <option value={ scene.id } key={ index } >{ scene.title }</option> : '';
                                        }) }
                                    </select>
                                    <p className="description">Navigate to another pano on click event.</p>
                                </Fragment>
                            </td>
                        </tr>
                    ) : null }

                    { 'Video' === hotspot.realType ? (
                        <tr>
                            <th>Video Url</th>
                            <td>
                                <Fragment>
                                    { hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].url ? (
                                        <input
                                            type="text"
                                            className='large-text disabled'
                                            name={ `${ name }[${ hotspot.realType }][url]` }
                                            value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].url ? hotspot[ hotspot.realType ].url : '' }
                                            onChange={ () => { return; } }
                                        />
                                    ) : '' }
                                    <MediaUpload
                                        name={ `${ name }[${ hotspot.realType }][url]` }
                                        url={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].url ? hotspot[ hotspot.realType ].url : '' }
                                        setCallBack={ ( attachment ) => {
                                            setHotspotByType( hotspot.realType )( 'url', attachment.url );
                                        } }
                                        clearCallBack={ () => {
                                            setHotspotByType( hotspot.realType )( 'url', '' );
                                        } }
                                    />
                                    <p className="description">Show video content in modal.</p>
                                </Fragment>
                            </td>
                        </tr>
                    ) : null }

                    { 'oEmbed' === hotspot.realType ? (
                        <Fragment>
                            <tr>
                                <th>Icon Type:</th>
                                <td>
                                    <select
                                        value={ hotspot.iconType ? hotspot.iconType : 'Video' }
                                        className='large-text'
                                        name={ `${ name }[iconType]` }
                                        onChange={ ( e ) => {
                                            e.preventDefault();
                                            setHotspot( 'iconType', e.target.value );
                                        } }
                                    >
                                        { iconTypes.map( ( type, index ) => {
                                            return <option value={ type } key={ index } >{ type }</option>;
                                        }) }
                                    </select>
                                    <p className="description">Icon of the hotspot</p>
                                </td>
                            </tr>
                            <tr>
                                <th>Media URL:</th>
                                <td>
                                    <input
                                        type="url"
                                        className='large-text'
                                        name={ `${ name }[${ hotspot.realType }][url]` }
                                        value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].url ? hotspot[ hotspot.realType ].url : '' }
                                        onChange={ ( e ) => {
                                            e.preventDefault();
                                            setHotspotByType( hotspot.realType )( 'url', e.target.value );
                                        } }
                                    />
                                    <button
                                        className="className='button button-secondary button-large"
                                        style={ { 'marginTop': '10px' } }
                                        onClick={ async( e ) => {
                                            e.preventDefault();
                                            const response = await getoEmbed( hotspot[ hotspot.realType ].url );

                                            if ( 'object' !== typeof response || isNaN( response.width ) || isNaN( response.height ) ) {
                                                setHotspotByType( hotspot.realType )( 'width', '' );
                                                setHotspotByType( hotspot.realType )( 'height', '' );
                                                setHotspotByType( hotspot.realType )( 'embedUrl', '' );
                                                setHotspotByType( hotspot.realType )( 'status', 'Invalid' );
                                                return;
                                            }

                                            setHotspotByType( hotspot.realType )( 'width', response.width );
                                            setHotspotByType( hotspot.realType )( 'height', response.height );
                                            setHotspotByType( hotspot.realType )( 'embedUrl', response.src );
                                            setHotspotByType( hotspot.realType )( 'status', 'Valid' );
                                        } }
                                    >Fetch before save
                                    { hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].status ? (
                                        <span
                                            className={ `oembed-status ${ 'Valid' === hotspot[ hotspot.realType ].status ? 'valid' : 'invalid' }` }
                                            style={ { 'marginLeft': '10px' } }
                                        >({ 'Valid' === hotspot[ hotspot.realType ].status ? 'valid' : 'invalid' })</span>
                                    ) : '' }
                                    </button>
                                    <p className="description">Url to fetch oEmbed content from third party service. click 'Fetch before save' button after url is in place.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: 0 }}>
                                    <input
                                        type="hidden"
                                        className='large-text'
                                        name={ `${ name }[${ hotspot.realType }][width]` }
                                        value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].width ? hotspot[ hotspot.realType ].width : '' }
                                        onChange={ () => { return; } }
                                    />
                                    <input
                                        type="hidden"
                                        className='large-text'
                                        name={ `${ name }[${ hotspot.realType }][status]` }
                                        value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].status ? hotspot[ hotspot.realType ].status : '' }
                                        onChange={ () => { return; } }
                                    />
                                    <input
                                        type="hidden"
                                        className='large-text'
                                        name={ `${ name }[${ hotspot.realType }][height]` }
                                        value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].height ? hotspot[ hotspot.realType ].height : '' }
                                        onChange={ () => { return; } }
                                    />
                                    <input
                                        type="hidden"
                                        className='large-text'
                                        name={ `${ name }[${ hotspot.realType }][embedUrl]` }
                                        value={ hotspot[ hotspot.realType ] && hotspot[ hotspot.realType ].embedUrl ? hotspot[ hotspot.realType ].embedUrl : '' }
                                        onChange={ () => { return; } }
                                    />
                                </td>
                            </tr>
                        </Fragment>
                        ) : null }
                </tbody>
            </table>
        </Fragment>
    );
};
