<?php
/**
 * Handles the registration of the Resume Custom Post Type.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Resume_Builder_CPT {

    public function __construct() {
        add_action( 'init', array( $this, 'register_post_type' ) );
    }

    public function register_post_type() {
        // Minimal configuration for initial setup
        $args = array(
            'label'    => __( 'Resumes', 'resume-builder' ), // Basic i18n-ready label
            'public'   => false, 
            'show_ui'  => true,  
            'supports' => array( 'title' ), 
        );

        register_post_type( 'resume', $args );
    }
}