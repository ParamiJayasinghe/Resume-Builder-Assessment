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

    public function render_shortcode() {
        $asset_path = RESUME_BUILDER_PATH . 'build/index.asset.php';
        
        // Only enqueue if the build file exists
        if ( file_exists( $asset_path ) ) {
            $assets = include $asset_path;
            
            wp_enqueue_script(
                'resume-builder-frontend',
                RESUME_BUILDER_URL . 'build/index.js',
                $assets['dependencies'],
                $assets['version'],
                true
            );

            wp_localize_script( 'resume-builder-frontend', 'resumeBuilderData', array(
                'root_url' => esc_url_raw( rest_url() ),
                'nonce'    => wp_create_nonce( 'wp_rest' ),
                'postId'   => get_the_ID(),
            ));
        }

        return '<div id="resume-builder-root">Loading Resume Builder...</div>';
    }
}