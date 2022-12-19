/* eslint-disable camelcase */
/**
 * BLOCK: Tabs
 */
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl } = wp.components;
const { useEffect, useState } = wp.element;
const { __ } = wp.i18n;

const Edit = ({ attributes, setAttributes }) => {
	const { postID, width, height } = attributes;
    const [ posts, setPosts ] = useState([]);

    useEffect( () => {
        fetch( `${ ubc_vrpress_editor.site_address }/wp-json/wp/v2/ubcvrpress/` )
        .then( res => res.json() )
        .then(
          ( result ) => {
            setPosts( result.filter( ( post ) => {
                return 'google' === post.ubc_vr_type;
            }) );
          },
          ( error ) => {
            alert( 'An unexcepted error occured, please contact site administrator.' );
          }
        );
    }, []);

	/**
	 * Render default gray box to insert url when source is empty.
	 */
	function renderDefaultView() {
        const instance = posts.filter( ( post ) => {
            return post.id === postID;
        });

        const title = 1 === instance.length ? instance[0].title.rendered : '';

		return (
			<div className="ubc-vrpress-default-view">
				<div>VRPress Instance selected : <strong style={ { paddingLeft: '5px' } }>{ -1 === postID ? 'None' : title }</strong></div>
			</div>
		);
    }

	return (
		<>
			{ renderDefaultView() }

			<InspectorControls>
				<PanelBody title="Settings" initialOpen={ true }>
                    <SelectControl
                        label={ __( 'Select VRPress Streetview Instance:' ) }
                        value={ postID }
                        onChange={ ( newValue ) => {
                            setAttributes({
                                postID: parseInt( newValue )
                            });
                        } }
                        options={ [ {
                            value: -1,
                            label: 'None'
                        }, ...posts.map( ( post ) => {
                            return {
                                value: post.id,
                                label: post.title.rendered
                            };
                        }) ] }
                    />
                    <RangeControl
                        label="Map Width"
                        value={ width }
                        min={ 2 }
                        max={ 3840 }
                        onChange={ value => {
                            setAttributes({
                                width: value
                            });
                        } }
                    />
                    <RangeControl
                        label="Map Height"
                        value={ height }
                        min={ 2 }
                        max={ 3840 }
                        onChange={ value => {
                            setAttributes({
                                height: value
                            });
                        } }
                    />
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Edit;
