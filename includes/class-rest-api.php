<?php
/**
 * Registers custom REST API endpoints for the React frontend.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Resume_Builder_REST_API {

    public function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

    public function register_routes() {
        register_rest_route( 'resume-builder/v1', '/resume/(?P<id>\d+)', array(
            array(
                'methods'             => 'GET',
                'callback'            => array( $this, 'get_resume' ),
                'permission_callback' => array( $this, 'check_permissions' ),
            ),
            array(
                'methods'             => 'POST',
                'callback'            => array( $this, 'save_resume' ),
                'permission_callback' => array( $this, 'check_permissions' ),
            ),
        ) );
    }

    public function check_permissions( $request ) {
        // Must be logged in
        if ( ! is_user_logged_in() ) {
            return new WP_Error( 'unauthorized', 'You must be logged in to access this resume.', array( 'status' => 401 ) );
        }

        $post_id = $request['id'];
        $post = get_post( $post_id );

        // If post exists, check ownership or admin privileges
        if ( $post ) {
            $current_user_id = get_current_user_id();
            $is_owner = (int) $post->post_author === $current_user_id;
            $is_admin = current_user_can( 'edit_others_posts' );

            if ( ! $is_owner && ! $is_admin ) {
                return new WP_Error( 'forbidden', 'You do not have permission to view or edit this resume.', array( 'status' => 403 ) );
            }
        }

        return true;
    }

    public function get_resume( $request ) {
        $post_id = $request['id'];
        $data = get_post_meta( $post_id, '_resume_data', true );
        $decoded = json_decode( $data, true );
        
        return rest_ensure_response( $decoded ? $decoded : array() );
    }

    public function save_resume( $request ) {
        $post_id = $request['id'];

        $params = $request->get_json_params();
        $sanitized_json = sanitize_textarea_field( wp_json_encode( $params ) );
        update_post_meta( $post_id, '_resume_data', $sanitized_json );
        
        return rest_ensure_response( array( 'success' => true ) );
    }
}