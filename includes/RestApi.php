<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class EM_RestApi {

    const NAMESPACE = 'employee-manager/v1';

    public static function register_routes() {
        register_rest_route( self::NAMESPACE, '/employees', [
            [
                'methods'             => 'GET',
                'callback'            => [ __CLASS__, 'get_employees' ],
                'permission_callback' => [ __CLASS__, 'check_permission' ],
                'args'                => [
                    'per_page' => [
                        'default'           => 10,
                        'sanitize_callback' => 'absint',
                    ],
                    'page' => [
                        'default'           => 1,
                        'sanitize_callback' => 'absint',
                    ],
                    'orderby' => [
                        'default'           => 'id',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'order' => [
                        'default'           => 'DESC',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'search' => [
                        'default'           => '',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                ],
            ],
            [
                'methods'             => 'POST',
                'callback'            => [ __CLASS__, 'create_employee' ],
                'permission_callback' => [ __CLASS__, 'check_permission' ],
            ],
        ] );

        register_rest_route( self::NAMESPACE, '/employees/(?P<id>\d+)', [
            [
                'methods'             => 'GET',
                'callback'            => [ __CLASS__, 'get_employee' ],
                'permission_callback' => [ __CLASS__, 'check_permission' ],
            ],
            [
                'methods'             => 'PUT',
                'callback'            => [ __CLASS__, 'update_employee' ],
                'permission_callback' => [ __CLASS__, 'check_permission' ],
            ],
            [
                'methods'             => 'DELETE',
                'callback'            => [ __CLASS__, 'delete_employee' ],
                'permission_callback' => [ __CLASS__, 'check_permission' ],
            ],
        ] );

        register_rest_route( self::NAMESPACE, '/settings', [
            [
                'methods'             => 'GET',
                'callback'            => [ __CLASS__, 'get_settings' ],
                'permission_callback' => [ __CLASS__, 'check_permission' ],
            ],
            [
                'methods'             => 'POST',
                'callback'            => [ __CLASS__, 'update_settings' ],
                'permission_callback' => [ __CLASS__, 'check_admin_permission' ],
            ],
        ] );
    }

    public static function check_permission() {
        return current_user_can( 'edit_posts' );
    }

    public static function check_admin_permission() {
        return current_user_can( 'manage_options' );
    }

    public static function get_employees( $request ) {
        $data = EM_Database::get_employees( [
            'per_page' => $request->get_param( 'per_page' ),
            'page'     => $request->get_param( 'page' ),
            'orderby'  => $request->get_param( 'orderby' ),
            'order'    => $request->get_param( 'order' ),
            'search'   => $request->get_param( 'search' ),
        ] );

        $items = array_map( [ __CLASS__, 'prepare_employee' ], $data['items'] );

        $response = new WP_REST_Response( $items, 200 );
        $response->header( 'X-WP-Total', $data['total'] );
        $response->header( 'X-WP-TotalPages', $data['total_pages'] );

        return $response;
    }

    public static function get_employee( $request ) {
        $employee = EM_Database::get_employee( $request['id'] );

        if ( ! $employee ) {
            return new WP_Error( 'not_found', __( 'Employee not found.', 'employee-manager' ), [ 'status' => 404 ] );
        }

        return new WP_REST_Response( self::prepare_employee( $employee ), 200 );
    }

    public static function create_employee( $request ) {
        $data   = $request->get_json_params();
        $errors = self::validate_employee( $data );

        if ( ! empty( $errors ) ) {
            return new WP_Error( 'validation_error', implode( ' ', $errors ), [ 'status' => 400 ] );
        }

        $id = EM_Database::create_employee( $data );

        if ( ! $id ) {
            return new WP_Error( 'create_failed', __( 'Failed to create employee.', 'employee-manager' ), [ 'status' => 500 ] );
        }

        $employee = EM_Database::get_employee( $id );
        return new WP_REST_Response( self::prepare_employee( $employee ), 201 );
    }

    public static function update_employee( $request ) {
        $id       = $request['id'];
        $employee = EM_Database::get_employee( $id );

        if ( ! $employee ) {
            return new WP_Error( 'not_found', __( 'Employee not found.', 'employee-manager' ), [ 'status' => 404 ] );
        }

        $data   = $request->get_json_params();
        $errors = self::validate_employee( $data, true );

        if ( ! empty( $errors ) ) {
            return new WP_Error( 'validation_error', implode( ' ', $errors ), [ 'status' => 400 ] );
        }

        EM_Database::update_employee( $id, $data );

        $updated = EM_Database::get_employee( $id );
        return new WP_REST_Response( self::prepare_employee( $updated ), 200 );
    }

    public static function delete_employee( $request ) {
        $id       = $request['id'];
        $employee = EM_Database::get_employee( $id );

        if ( ! $employee ) {
            return new WP_Error( 'not_found', __( 'Employee not found.', 'employee-manager' ), [ 'status' => 404 ] );
        }

        EM_Database::delete_employee( $id );

        return new WP_REST_Response( [ 'deleted' => true ], 200 );
    }

    public static function get_settings() {
        return new WP_REST_Response( EM_Settings::get_all(), 200 );
    }

    public static function update_settings( $request ) {
        $data = $request->get_json_params();
        EM_Settings::save( $data );
        return new WP_REST_Response( EM_Settings::get_all(), 200 );
    }

    private static function validate_employee( $data, $is_update = false ) {
        $errors   = [];
        $settings = EM_Settings::get_all();
        $required = $settings['required_fields'] ?? [ 'full_name', 'email' ];

        if ( ! $is_update || isset( $data['full_name'] ) ) {
            if ( in_array( 'full_name', $required, true ) && empty( $data['full_name'] ) ) {
                $errors[] = __( 'Full name is required.', 'employee-manager' );
            }
        }

        if ( ! $is_update || isset( $data['email'] ) ) {
            if ( in_array( 'email', $required, true ) && empty( $data['email'] ) ) {
                $errors[] = __( 'Email is required.', 'employee-manager' );
            } elseif ( ! empty( $data['email'] ) && ! is_email( $data['email'] ) ) {
                $errors[] = __( 'Invalid email format.', 'employee-manager' );
            }
        }

        if ( ! $is_update || isset( $data['phone'] ) ) {
            if ( in_array( 'phone', $required, true ) && empty( $data['phone'] ) ) {
                $errors[] = __( 'Phone is required.', 'employee-manager' );
            }
        }

        if ( ! $is_update || isset( $data['department'] ) ) {
            if ( in_array( 'department', $required, true ) && empty( $data['department'] ) ) {
                $errors[] = __( 'Department is required.', 'employee-manager' );
            }
        }

        if ( isset( $data['photo_id'] ) && ! self::is_valid_photo_attachment( $data['photo_id'] ) ) {
            $errors[] = __( 'Profile photo must be a valid image from the media library.', 'employee-manager' );
        }

        return $errors;
    }

    private static function is_valid_photo_attachment( $photo_id ) {
        $photo_id = absint( $photo_id );

        if ( empty( $photo_id ) ) {
            return true;
        }

        return 'attachment' === get_post_type( $photo_id ) && wp_attachment_is_image( $photo_id );
    }

    private static function prepare_employee( $employee ) {
        $photo_url = '';
        if ( ! empty( $employee->photo_id ) ) {
            $photo_url = wp_get_attachment_url( $employee->photo_id );
        }

        return [
            'id'         => (int) $employee->id,
            'full_name'  => $employee->full_name,
            'email'      => $employee->email,
            'phone'      => $employee->phone,
            'department' => $employee->department,
            'photo_id'   => (int) $employee->photo_id,
            'photo_url'  => $photo_url ?: '',
            'created_at' => $employee->created_at,
            'updated_at' => $employee->updated_at,
        ];
    }
}
