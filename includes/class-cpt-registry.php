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

    public function register_post_type(){
        $args = array(
            'label' => __( 'Resumes', 'resume-builder' ),
            'public' => true, 
            'show_ui' => true,
            'supports' => array( 'title', 'editor' ), 
        );
        register_post_type( 'resume', $args );
    }

}