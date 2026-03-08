<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class EM_Admin {

    public static function register_menu() {
        add_menu_page(
            __( 'Employee Manager', 'employee-manager' ),
            __( 'Employees', 'employee-manager' ),
            'edit_posts',
            'employee-manager',
            [ __CLASS__, 'render_page' ],
            'dashicons-groups',
            30
        );

        add_submenu_page(
            'employee-manager',
            __( 'All Employees', 'employee-manager' ),
            __( 'All Employees', 'employee-manager' ),
            'edit_posts',
            'employee-manager',
            [ __CLASS__, 'render_page' ]
        );

        add_submenu_page(
            'employee-manager',
            __( 'Settings', 'employee-manager' ),
            __( 'Settings', 'employee-manager' ),
            'manage_options',
            'employee-manager-settings',
            [ __CLASS__, 'render_settings_page' ]
        );
    }

    public static function render_page() {
        echo '<div class="wrap"><div id="employee-manager-app"></div></div>';
    }

    public static function render_settings_page() {
        echo '<div class="wrap"><div id="employee-manager-settings"></div></div>';
    }

    public static function enqueue_assets( $hook ) {
        if ( ! in_array( $hook, [ 'toplevel_page_employee-manager', 'employees_page_employee-manager-settings' ], true ) ) {
            return;
        }

        $asset_file = EM_PLUGIN_DIR . 'build/index.asset.php';
        $assets     = file_exists( $asset_file ) ? require $asset_file : [
            'dependencies' => [],
            'version'      => EM_VERSION,
        ];

        wp_enqueue_media();

        wp_enqueue_script(
            'employee-manager',
            EM_PLUGIN_URL . 'build/index.js',
            $assets['dependencies'],
            $assets['version'],
            true
        );

        wp_enqueue_style(
            'employee-manager',
            EM_PLUGIN_URL . 'build/style-index.css',
            [ 'wp-components' ],
            $assets['version']
        );

        wp_localize_script( 'employee-manager', 'emData', [
            'restUrl'     => rest_url( 'employee-manager/v1/' ),
            'nonce'       => wp_create_nonce( 'wp_rest' ),
            'settings'    => EM_Settings::get_all(),
            'settingsUrl' => admin_url( 'admin.php?page=employee-manager-settings' ),
            'page'        => $hook === 'employees_page_employee-manager-settings' ? 'settings' : 'employees',
        ] );
    }
}
