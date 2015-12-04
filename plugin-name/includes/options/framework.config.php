<?php if ( ! defined( 'ABSPATH' ) ) { die; } // Cannot access pages directly.

/**
 * Framework page settings
 */
$settings = array(
    'header_title' => __( 'Plugin Name', 'pressapps' ),
    'menu_title'   => __( 'Plugin Name', 'pressapps' ),
    'menu_type'    => 'add_submenu_page',
    'menu_slug'    => 'pressapps-plugin-name',
    'ajax_save'    => false,
);


/**
 * sections and fields option
 * @var array
 */
$options        = array();

/*
 *  Styling options tab and fields settings
 */
$options[]      = array(
    'name'        => 'styling',
    'title'       => __( 'Styling', 'pressapps' ),
    'icon'        => 'si-brush',
    'fields'      => array(
        array(
            'id'      => 'custom_css', 
            'type'    => 'textarea',
            'title'   => __( 'Custom CSS', 'pressapps' ),
        ),
    ),
);

SkeletFramework::instance( $settings, $options );
