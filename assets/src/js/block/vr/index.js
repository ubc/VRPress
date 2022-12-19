/**
 * BLOCK: UBC VRPress.
 */

// Import block dependencies and components.
import Edit from './edit';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

registerBlockType( 'ubc/vrpress', {
	title: __( 'VRPress', 'ubc-vrpress' ),
	description: __( 'Render 360 panorama images with hotspots.', 'ubc-vrpress' ),
	icon: 'format-image',
	keywords: [ __( '360', 'ubc-vrpress' ), __( 'Panorama', 'ubc-vrpress' ) ],
	category: 'media',
	edit: Edit,
	save: () => null
});
