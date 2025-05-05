import React, { Fragment } from 'react';
import MediaUpload from './media-upload';

export default ( props ) => {
    const { hotspot, setHotspot, name, hotspotTypes } = props;

    const setHotspotByType = ( type ) => {
        const temp = hotspot[ type ] ? hotspot[ type ] : {};
        return ( property, value ) => {
            temp[ property ] = value;
            setHotspot( type, temp );
        };
    };

    const iconTypes = [ 'Image', 'Video', 'Document' ];

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

    return (
        <table className="form-table">
            <tbody>
                <tr>
                    <th style={ { padding: 0 }}></th>
                    <td style={ { padding: 0 }}>
                    <input
                        type="hidden"
                        value={ hotspot.id }
                        name = { `${ name }[id]` }
                    />
                    <input
                        type="hidden"
                        value={ hotspot.pano }
                        name = { `${ name }[pano]` }
                    />
                    <input
                        type="hidden"
                        value={ hotspot.pov.heading }
                        name = { `${ name }[pov][heading]` }
                    />
                    <input
                        type="hidden"
                        value={ hotspot.pov.pitch }
                        name = { `${ name }[pov][pitch]` }
                    />
                    <input
                        type="hidden"
                        value={ hotspot.markerId }
                        name = { `${ name }[markerId]` }
                    />
                    </td>
                </tr>

                <tr>
                    <th>Hotspot Title</th>
                    <td>
                        <input
                            value={ hotspot.title }
                            name={ `${ name }[title]` }
                            type="text"
                            className='large-text'
                            onChange={ ( e ) => {
                                e.preventDefault();
                                setHotspot( 'title', e.target.value );
                            } }
                        />
                        <p className="description">Title of the hotspot. Will show in the modal on hotspot click.</p>
                    </td>
                </tr>

                <tr>
                    <th>Hotspot Type</th>
                    <td>
                        <select
                            value={ hotspot.type }
                            className='large-text'
                            name={ `${ name }[type]` }
                            onChange={ ( e ) => {
                                e.preventDefault();
                                setHotspot( 'type', e.target.value );
                            } }
                        >
                            { hotspotTypes.map( ( type, index ) => {
                                const label = 'oEmbed' === type ? 'Embeds' : type;
                                return <option value={ type } key={ index } >{ label }</option>;
                            }) }
                        </select>
                        <p className="description">Defind the type and functionality of hotspot.</p>
                    </td>
                </tr>

                { 'Info' === hotspot.type ? (
                    <tr>
                        <th>Content</th>
                        <td>
                            <textarea
                                value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].content ? hotspot[ hotspot.type ].content : '' }
                                name={ `${ name }[${ hotspot.type }][content]` }
                                rows="10"
                                className='large-text'
                                onChange={ ( e ) => {
                                    e.preventDefault();
                                    setHotspotByType( hotspot.type )( 'content', e.target.value );
                                } }
                            >
                            </textarea>
                            <p className="description">Content to be displayed in the modal. Valid html is acceptable.</p>
                        </td>
                    </tr>
                ) : '' }

                { 'Link' === hotspot.type ? (
                    <tr>
                        <th>Link to</th>
                        <td>
                            <input
                                type="url"
                                value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].URL ? hotspot[ hotspot.type ].URL : '' }
                                name={ `${ name }[${ hotspot.type }][URL]` }
                                className='large-text'
                                onChange={ ( e ) => {
                                    e.preventDefault();
                                    setHotspotByType( hotspot.type )( 'URL', e.target.value );
                                } }
                            >
                            </input>
                            <p className="description">Url to be redirected to on hotspot click.</p>
                        </td>
                    </tr>
                ) : '' }

                { 'Image' === hotspot.type ? (
                    <Fragment>
                        <tr>
                            <th>Image Url</th>
                            <td>
                                <Fragment>
                                    { hotspot[ hotspot.type ] && hotspot[ hotspot.type ].url ? (
                                        <input type="text" className='large-text disabled' name={ `${ name }[${ hotspot.type }][url]` } value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].url ? hotspot[ hotspot.type ].url : '' }/>
                                    ) : '' }
                                    <MediaUpload
                                        name={ `${ name }[${ hotspot.type }][url]` }
                                        url={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].url ? hotspot[ hotspot.type ].url : '' }
                                        setCallBack={ ( attachment ) => {
                                            setHotspotByType( hotspot.type )( 'url', attachment.url );
                                        } }
                                        clearCallBack={ () => {
                                            setHotspotByType( hotspot.type )( 'url', '' );
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
                                    value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].caption ? hotspot[ hotspot.type ].caption : '' }
                                    name={ `${ name }[${ hotspot.type }][caption]` }
                                    className='large-text'
                                    onChange={ ( e ) => {
                                        e.preventDefault();
                                        setHotspotByType( hotspot.type )( 'caption', e.target.value );
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
                                    value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].alt ? hotspot[ hotspot.type ].alt : '' }
                                    name={ `${ name }[${ hotspot.type }][alt]` }
                                    className='large-text'
                                    onChange={ ( e ) => {
                                        e.preventDefault();
                                        setHotspotByType( hotspot.type )( 'alt', e.target.value );
                                    } }
                                >
                                </input>
                                <p className="description">Image alt text to show when image fail to load.</p>
                            </td>
                        </tr>
                    </Fragment>
                ) : '' }

                { 'Video' === hotspot.type || 'Audio' === hotspot.type ? (
                    <tr>
                        <th>Video Url</th>
                        <td>
                            <Fragment>
                                { hotspot[ hotspot.type ] && hotspot[ hotspot.type ].url ? (
                                    <input type="text" className='large-text disabled' name={ `${ name }[${ hotspot.type }][url]` } value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].url ? hotspot[ hotspot.type ].url : '' }/>
                                ) : '' }
                                <MediaUpload
                                    name={ `${ name }[${ hotspot.type }][url]` }
                                    url={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].url ? hotspot[ hotspot.type ].url : '' }
                                    setCallBack={ ( attachment ) => {
                                        setHotspotByType( hotspot.type )( 'url', attachment.url );
                                    } }
                                    clearCallBack={ () => {
                                        setHotspotByType( hotspot.type )( 'url', '' );
                                    } }
                                />
                                <p className="description">Show video content in modal.</p>
                            </Fragment>
                        </td>
                    </tr>
                ) : '' }

                { 'oEmbed' === hotspot.type ? (
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
                                    name={ `${ name }[${ hotspot.type }][url]` }
                                    value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].url ? hotspot[ hotspot.type ].url : '' }
                                    onChange={ ( e ) => {
                                        e.preventDefault();
                                        setHotspotByType( hotspot.type )( 'url', e.target.value );
                                    } }
                                />
                                <button
                                    className="className='button button-secondary button-large"
                                    style={ { 'marginTop': '10px' } }
                                    onClick={ async( e ) => {
                                        e.preventDefault();
                                        const response = await getoEmbed( hotspot[ hotspot.type ].url );

                                        if ( 'object' !== typeof response || isNaN( response.width ) || isNaN( response.height ) ) {
                                            setHotspotByType( hotspot.type )( 'width', '' );
                                            setHotspotByType( hotspot.type )( 'height', '' );
                                            setHotspotByType( hotspot.type )( 'embedUrl', '' );
                                            setHotspotByType( hotspot.type )( 'status', 'Invalid' );
                                            return;
                                        }

                                        setHotspotByType( hotspot.type )( 'width', response.width );
                                        setHotspotByType( hotspot.type )( 'height', response.height );
                                        setHotspotByType( hotspot.type )( 'embedUrl', response.src );
                                        setHotspotByType( hotspot.type )( 'status', 'Valid' );
                                    } }
                                >Fetch before save
                                { hotspot[ hotspot.type ] && hotspot[ hotspot.type ].status ? (
                                    <span
                                        className={ `oembed-status ${ 'Valid' === hotspot[ hotspot.type ].status ? 'valid' : 'invalid' }` }
                                        style={ { 'marginLeft': '10px' } }
                                    >({ 'Valid' === hotspot[ hotspot.type ].status ? 'valid' : 'invalid' })</span>
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
                                    name={ `${ name }[${ hotspot.type }][width]` }
                                    value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].width ? hotspot[ hotspot.type ].width : '' }
                                    onChange={ ( e ) => {} }
                                />
                                <input
                                    type="hidden"
                                    className='large-text'
                                    name={ `${ name }[${ hotspot.type }][status]` }
                                    value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].status ? hotspot[ hotspot.type ].status : '' }
                                    onChange={ ( e ) => {} }
                                />
                                <input
                                    type="hidden"
                                    className='large-text'
                                    name={ `${ name }[${ hotspot.type }][height]` }
                                    value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].height ? hotspot[ hotspot.type ].height : '' }
                                    onChange={ ( e ) => {} }
                                />
                                <input
                                    type="hidden"
                                    className='large-text'
                                    name={ `${ name }[${ hotspot.type }][embedUrl]` }
                                    value={ hotspot[ hotspot.type ] && hotspot[ hotspot.type ].embedUrl ? hotspot[ hotspot.type ].embedUrl : '' }
                                    onChange={ ( e ) => {} }
                                />
                            </td>
                        </tr>
                </Fragment>
            ) : '' }
            </tbody>
        </table>
    );
};
