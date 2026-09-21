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

// Define plugin constants for easy path referencing in later files
define( 'RESUME_BUILDER_PATH', plugin_dir_path( __FILE__ ) );
define( 'RESUME_BUILDER_URL', plugin_dir_url( __FILE__ ) );
