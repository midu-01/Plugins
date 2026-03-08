<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class EM_Database {

    public static function get_table_name() {
        global $wpdb;
        return $wpdb->prefix . 'em_employees';
    }

    public static function create_table() {
        global $wpdb;

        $table_name      = self::get_table_name();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            full_name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            phone varchar(50) DEFAULT '',
            department varchar(255) DEFAULT '',
            photo_id bigint(20) unsigned DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }

    public static function get_employees( $args = [] ) {
        global $wpdb;

        $table    = self::get_table_name();
        $defaults = [
            'per_page' => 10,
            'page'     => 1,
            'orderby'  => 'id',
            'order'    => 'DESC',
            'search'   => '',
        ];

        $args   = wp_parse_args( $args, $defaults );
        $offset = ( $args['page'] - 1 ) * $args['per_page'];

        $allowed_orderby = [ 'id', 'full_name', 'email', 'department', 'created_at' ];
        $orderby         = in_array( $args['orderby'], $allowed_orderby, true ) ? $args['orderby'] : 'id';
        $order           = strtoupper( $args['order'] ) === 'ASC' ? 'ASC' : 'DESC';

        $where = '';
        if ( ! empty( $args['search'] ) ) {
            $search = '%' . $wpdb->esc_like( $args['search'] ) . '%';
            $where  = $wpdb->prepare(
                'WHERE full_name LIKE %s OR email LIKE %s OR department LIKE %s',
                $search,
                $search,
                $search
            );
        }

        $total = $wpdb->get_var( "SELECT COUNT(*) FROM $table $where" );

        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM $table $where ORDER BY $orderby $order LIMIT %d OFFSET %d",
                $args['per_page'],
                $offset
            )
        );

        return [
            'items'      => $results,
            'total'      => (int) $total,
            'total_pages' => ceil( $total / $args['per_page'] ),
        ];
    }

    public static function get_employee( $id ) {
        global $wpdb;
        $table = self::get_table_name();
        return $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE id = %d", $id ) );
    }

    public static function create_employee( $data ) {
        global $wpdb;
        $table = self::get_table_name();

        $wpdb->insert( $table, [
            'full_name'  => sanitize_text_field( $data['full_name'] ),
            'email'      => sanitize_email( $data['email'] ),
            'phone'      => sanitize_text_field( $data['phone'] ?? '' ),
            'department' => sanitize_text_field( $data['department'] ?? '' ),
            'photo_id'   => absint( $data['photo_id'] ?? 0 ),
        ] );

        return $wpdb->insert_id;
    }

    public static function update_employee( $id, $data ) {
        global $wpdb;
        $table = self::get_table_name();

        $update = [];
        if ( isset( $data['full_name'] ) ) {
            $update['full_name'] = sanitize_text_field( $data['full_name'] );
        }
        if ( isset( $data['email'] ) ) {
            $update['email'] = sanitize_email( $data['email'] );
        }
        if ( isset( $data['phone'] ) ) {
            $update['phone'] = sanitize_text_field( $data['phone'] );
        }
        if ( isset( $data['department'] ) ) {
            $update['department'] = sanitize_text_field( $data['department'] );
        }
        if ( isset( $data['photo_id'] ) ) {
            $update['photo_id'] = absint( $data['photo_id'] );
        }

        if ( empty( $update ) ) {
            return false;
        }

        return $wpdb->update( $table, $update, [ 'id' => $id ] );
    }

    public static function delete_employee( $id ) {
        global $wpdb;
        $table = self::get_table_name();
        return $wpdb->delete( $table, [ 'id' => $id ] );
    }
}
