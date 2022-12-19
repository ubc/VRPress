import React, { Fragment, useState } from 'react';

import VR from './admin-vr';
import StreetView from './admin-streetview';

import './../../scss/tour-backend.scss';
import '../streetview-extend';

export default () => {

    // eslint-disable-next-line camelcase
    const [ vrType, setVrType ] = useState( ubc_vrpress_admin.vr_type ? ubc_vrpress_admin.vr_type : '' );
    return (
        <Fragment>
            <Fragment>
                <div
                    style={ { margin: '20px 0 10px 0' } }
                >
                    {
                        '' !== vrType ? '' : (
                            <label
                                htmlFor="vr_type"
                                style={ { fontWeight: 'bold', fontSize: '1rem' } }
                            >VR Content Source</label>
                        )
                    }
                    <select
                        name = { 'ubc_vr_type' }
                        id = "vr_type"
                        value = { vrType }
                        onChange = { ( e ) => {
                            e.preventDefault();
                            setVrType( e.target.value );
                        } }
                        hidden={ '' !== vrType }
                    >
                        <option value="">Please select a VR source type</option>
                        <option value="self">Self Uploaded</option>
                        <option value="google">Google Map Street View</option>
                    </select>
                </div>
            </Fragment>

            { 'self' === vrType ? <VR /> : '' }
            { 'google' === vrType ? (
                <StreetView
                    center={ {lat: 49.2577301, lng: -123.1590091} }
                    height='400px'
                    zoom={ 15 }
                />
            ) : '' }
        </Fragment>
    );
};
