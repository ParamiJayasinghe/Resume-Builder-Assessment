<?php
/**
 * Handles the [resume_builder] shortcode and enqueues React assets.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Resume_Builder_Shortcode {

    public function __construct() {
        add_shortcode( 'resume_builder', array( $this, 'render_shortcode' ) );
    }

    public function render_shortcode( $atts ) {
        $asset_file = include( RESUME_BUILDER_PATH . 'build/index.asset.php' );

        // Only enqueue if the build file exists
        wp_enqueue_script(
            'resume-builder-react',
            RESUME_BUILDER_URL . 'build/index.js',
            $asset_file['dependencies'],
            $asset_file['version'],
            true
        );

        // Enqueue CSS stylesheet 
        wp_enqueue_style(
            'resume-builder-style',
            RESUME_BUILDER_URL . 'build/index.css',
            array(),
            $asset_file['version']
        );

        wp_localize_script( 'resume-builder-react', 'resumeBuilderData', array(
            'root_url' => get_site_url() . '/wp-json/',
            'nonce'    => wp_create_nonce( 'wp_rest' ),
            'postId'   => get_the_ID(),
        ) );

        return '<div id="resume-builder-root"></div>';
    }
}