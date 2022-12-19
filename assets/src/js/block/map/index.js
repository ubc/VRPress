/**
 * BLOCK: UBC VRPress MAP.
 */

import Edit from './edit';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

registerBlockType( 'ubc/vrpress-map', {
	title: __( 'VRPress Google Map', 'ubc-vrpress' ),
	description: __( 'Render google map associated with Streetview Panorama', 'ubc-vrpress' ),
	icon: 'format-image',
	keywords: [ __( '360', 'ubc-vrpress' ), __( 'Panorama', 'ubc-vrpress' ) ],
	category: 'media',
	edit: Edit,
	save: () => null
});
