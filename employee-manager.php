<?php
/**
 * Plugin Name: Employee Manager
 * Description: A CRUD plugin for managing employee records with DataForm, DataViews, and configurable settings.
 * Version: 1.0.0
 * Author: Midu Mojumder
 * Text Domain: employee-manager
 * Requires at least: 6.4
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'EM_PLUGIN_FILE', __FILE__ );
define( 'EM_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'EM_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'EM_VERSION', '1.0.0' );

require_once EM_PLUGIN_DIR . 'includes/Database.php';
require_once EM_PLUGIN_DIR . 'includes/RestApi.php';
require_once EM_PLUGIN_DIR . 'includes/Settings.php';
require_once EM_PLUGIN_DIR . 'includes/Admin.php';

register_activation_hook( __FILE__, [ 'EM_Database', 'create_table' ] );

add_action( 'rest_api_init', [ 'EM_RestApi', 'register_routes' ] );
add_action( 'admin_menu', [ 'EM_Admin', 'register_menu' ] );
add_action( 'admin_enqueue_scripts', [ 'EM_Admin', 'enqueue_assets' ] );
add_action( 'admin_init', [ 'EM_Settings', 'register_settings' ] );
