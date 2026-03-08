import { SearchControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function getAvatarClass( id ) {
    return 'bg-' + ( ( id % 6 ) + 1 );
}

function getInitials( name ) {
    if ( ! name ) return '?';
    const parts = name.trim().split( /\s+/ );
    if ( parts.length >= 2 ) {
        return parts[ 0 ][ 0 ] + parts[ 1 ][ 0 ];
    }
    return parts[ 0 ].substring( 0, 2 );
}

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const DeleteIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

export default function EmployeeList( {
    employees,
    loading,
    total,
    totalPages,
    page,
    perPage,
    onPageChange,
    search,
    onSearchChange,
    sortField,
    sortOrder,
    onSort,
    onEdit,
    onDelete,
    settings,
} ) {
    const visibleFields = settings.visible_fields || [];

    const getSortIcon = ( field ) => {
        if ( sortField !== field ) return null;
        return (
            <span className="em-sort-icon">
                { sortOrder === 'asc' ? '\u25B2' : '\u25BC' }
            </span>
        );
    };

    const startItem = ( page - 1 ) * perPage + 1;
    const endItem = Math.min( page * perPage, total );

    return (
        <div className="em-list-card">
            <div className="em-list-toolbar">
                <SearchControl
                    value={ search }
                    onChange={ onSearchChange }
                    placeholder={ __( 'Search by name, email or department...', 'employee-manager' ) }
                />
            </div>

            { loading ? (
                <div className="em-loading">
                    <Spinner />
                </div>
            ) : employees.length === 0 ? (
                <div className="em-empty-state">
                    <div className="em-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <h3>{ __( 'No employees yet', 'employee-manager' ) }</h3>
                    <p>{ __( 'Get started by adding your first team member.', 'employee-manager' ) }</p>
                </div>
            ) : (
                <>
                    <table className="em-table">
                        <thead>
                            <tr>
                                { visibleFields.includes( 'full_name' ) && (
                                    <th
                                        className="em-sortable"
                                        onClick={ () => onSort( 'full_name' ) }
                                    >
                                        { __( 'Employee', 'employee-manager' ) }{ getSortIcon( 'full_name' ) }
                                    </th>
                                ) }
                                { visibleFields.includes( 'email' ) && ! visibleFields.includes( 'full_name' ) && (
                                    <th
                                        className="em-sortable"
                                        onClick={ () => onSort( 'email' ) }
                                    >
                                        { __( 'Email', 'employee-manager' ) }{ getSortIcon( 'email' ) }
                                    </th>
                                ) }
                                { visibleFields.includes( 'phone' ) && (
                                    <th>{ __( 'Phone', 'employee-manager' ) }</th>
                                ) }
                                { visibleFields.includes( 'department' ) && (
                                    <th
                                        className="em-sortable"
                                        onClick={ () => onSort( 'department' ) }
                                    >
                                        { __( 'Department', 'employee-manager' ) }{ getSortIcon( 'department' ) }
                                    </th>
                                ) }
                                <th>{ __( 'Actions', 'employee-manager' ) }</th>
                            </tr>
                        </thead>
                        <tbody>
                            { employees.map( ( emp ) => (
                                <tr key={ emp.id }>
                                    { visibleFields.includes( 'full_name' ) && (
                                        <td>
                                            <div className="em-employee-info">
                                                <div className={ `em-avatar ${ getAvatarClass( emp.id ) }` }>
                                                    { emp.photo_url ? (
                                                        <img src={ emp.photo_url } alt={ emp.full_name } />
                                                    ) : (
                                                        getInitials( emp.full_name )
                                                    ) }
                                                </div>
                                                <div>
                                                    <div className="em-employee-name">{ emp.full_name }</div>
                                                    { visibleFields.includes( 'email' ) && (
                                                        <div className="em-employee-email-sub">{ emp.email }</div>
                                                    ) }
                                                </div>
                                            </div>
                                        </td>
                                    ) }
                                    { visibleFields.includes( 'email' ) && ! visibleFields.includes( 'full_name' ) && (
                                        <td>{ emp.email }</td>
                                    ) }
                                    { visibleFields.includes( 'phone' ) && (
                                        <td>{ emp.phone || <span style={ { color: '#9ca3af' } }>—</span> }</td>
                                    ) }
                                    { visibleFields.includes( 'department' ) && (
                                        <td>
                                            { emp.department ? (
                                                <span className="em-dept-badge">{ emp.department }</span>
                                            ) : (
                                                <span style={ { color: '#9ca3af' } }>—</span>
                                            ) }
                                        </td>
                                    ) }
                                    <td>
                                        <div className="em-row-actions">
                                            <button
                                                className="em-action-btn"
                                                onClick={ () => onEdit( emp ) }
                                                title={ __( 'Edit', 'employee-manager' ) }
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                className="em-action-btn delete"
                                                onClick={ () => onDelete( emp.id ) }
                                                title={ __( 'Delete', 'employee-manager' ) }
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) ) }
                        </tbody>
                    </table>

                    { totalPages > 1 && (
                        <div className="em-pagination">
                            <div className="em-pagination-info">
                                { __( 'Showing', 'employee-manager' ) }{ ' ' }
                                <strong>{ startItem }–{ endItem }</strong>{ ' ' }
                                { __( 'of', 'employee-manager' ) }{ ' ' }
                                <strong>{ total }</strong>
                            </div>
                            <div className="em-pagination-buttons">
                                <button
                                    className="em-page-btn"
                                    disabled={ page <= 1 }
                                    onClick={ () => onPageChange( page - 1 ) }
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>
                                { Array.from( { length: totalPages }, ( _, i ) => i + 1 )
                                    .filter( ( p ) => p === 1 || p === totalPages || Math.abs( p - page ) <= 1 )
                                    .map( ( p, idx, arr ) => {
                                        const items = [];
                                        if ( idx > 0 && arr[ idx - 1 ] < p - 1 ) {
                                            items.push(
                                                <span key={ `dots-${ p }` } className="em-page-btn" style={ { border: 'none', cursor: 'default' } }>...</span>
                                            );
                                        }
                                        items.push(
                                            <button
                                                key={ p }
                                                className={ `em-page-btn ${ p === page ? 'current' : '' }` }
                                                onClick={ () => onPageChange( p ) }
                                            >
                                                { p }
                                            </button>
                                        );
                                        return items;
                                    } )
                                }
                                <button
                                    className="em-page-btn"
                                    disabled={ page >= totalPages }
                                    onClick={ () => onPageChange( page + 1 ) }
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
                                </button>
                            </div>
                        </div>
                    ) }
                </>
            ) }
        </div>
    );
}
