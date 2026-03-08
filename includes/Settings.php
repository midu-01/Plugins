<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class EM_Settings {

    const OPTION_KEY = 'em_settings';

    public static function get_defaults() {
        return [
            'required_fields'    => [ 'full_name', 'email' ],
            'visible_fields'     => [ 'full_name', 'email', 'phone', 'department', 'photo' ],
            'photo_upload'       => true,
            'placeholders'       => [
                'full_name'  => 'Enter full name',
                'email'      => 'Enter email address',
                'phone'      => 'Enter phone number',
                'department' => 'Enter department',
            ],
        ];
    }

    public static function get_all() {
        $saved = get_option( self::OPTION_KEY, [] );
        return wp_parse_args( $saved, self::get_defaults() );
    }

    public static function save( $data ) {
        $settings = self::get_all();

        if ( isset( $data['required_fields'] ) && is_array( $data['required_fields'] ) ) {
            $allowed  = [ 'full_name', 'email', 'phone', 'department' ];
            $settings['required_fields'] = array_values( array_intersect( $data['required_fields'], $allowed ) );
        }

        if ( isset( $data['visible_fields'] ) && is_array( $data['visible_fields'] ) ) {
            $allowed  = [ 'full_name', 'email', 'phone', 'department', 'photo' ];
            $settings['visible_fields'] = array_values( array_intersect( $data['visible_fields'], $allowed ) );
        }

        if ( isset( $data['photo_upload'] ) ) {
            $settings['photo_upload'] = (bool) $data['photo_upload'];
        }

        if ( isset( $data['placeholders'] ) && is_array( $data['placeholders'] ) ) {
            foreach ( $data['placeholders'] as $field => $value ) {
                if ( in_array( $field, [ 'full_name', 'email', 'phone', 'department' ], true ) ) {
                    $settings['placeholders'][ $field ] = sanitize_text_field( $value );
                }
            }
        }

        update_option( self::OPTION_KEY, $settings );
    }

    public static function register_settings() {
        register_setting( 'em_settings_group', self::OPTION_KEY );
    }
}
