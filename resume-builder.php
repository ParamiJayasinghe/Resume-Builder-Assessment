<?php
/**
 * Plugin Name: Resume Builder Assignment
 * Description: A React-powered resume builder with custom REST API endpoints.
 * Version: 1.0.0
 * Author: Parami Jayasinghe
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define Plugin Constants
define( 'RESUME_BUILDER_PATH', plugin_dir_path( __FILE__ ) );
define( 'RESUME_BUILDER_URL', plugin_dir_url( __FILE__ ) );

require_once RESUME_BUILDER_PATH . 'includes/class-cpt-registry.php';
require_once RESUME_BUILDER_PATH . 'includes/class-shortcode.php';
require_once RESUME_BUILDER_PATH . 'includes/class-rest-api.php';

function resume_builder_init() {
    new Resume_Builder_CPT();
    new Resume_Builder_Shortcode();
    new Resume_Builder_REST_API();
}
add_action( 'plugins_loaded', 'resume_builder_init' );
