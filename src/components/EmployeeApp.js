import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api';

export default function EmployeeApp() {
    const [ employees, setEmployees ] = useState( [] );
    const [ total, setTotal ] = useState( 0 );
    const [ totalPages, setTotalPages ] = useState( 0 );
    const [ page, setPage ] = useState( 1 );
    const [ perPage ] = useState( 10 );
    const [ search, setSearch ] = useState( '' );
    const [ sortField, setSortField ] = useState( 'id' );
    const [ sortOrder, setSortOrder ] = useState( 'desc' );
    const [ loading, setLoading ] = useState( false );
    const [ notice, setNotice ] = useState( null );
    const [ view, setView ] = useState( 'list' );
    const [ editingEmployee, setEditingEmployee ] = useState( null );

    const settings = window.emData.settings;
    const settingsUrl = window.emData.settingsUrl;

    const loadEmployees = useCallback( async () => {
        setLoading( true );
        try {
            const result = await fetchEmployees( {
                page,
                per_page: perPage,
                orderby: sortField,
                order: sortOrder,
                search,
            } );
            setEmployees( result.items );
            setTotal( result.total );
            setTotalPages( result.totalPages );
        } catch ( err ) {
            setNotice( { type: 'error', message: err.message } );
        }
        setLoading( false );
    }, [ page, perPage, sortField, sortOrder, search ] );

    useEffect( () => {
        loadEmployees();
    }, [ loadEmployees ] );

    // Auto-dismiss notices after 4s
    useEffect( () => {
        if ( notice ) {
            const timer = setTimeout( () => setNotice( null ), 4000 );
            return () => clearTimeout( timer );
        }
    }, [ notice ] );

    const departments = useMemo( () => {
        const deptSet = new Set( employees.map( ( e ) => e.department ).filter( Boolean ) );
        return deptSet.size;
    }, [ employees ] );

    const handleCreate = async ( data ) => {
        try {
            await createEmployee( data );
            setNotice( { type: 'success', message: __( 'Employee created successfully.', 'employee-manager' ) } );
            setView( 'list' );
            setPage( 1 );
            loadEmployees();
        } catch ( err ) {
            setNotice( { type: 'error', message: err.message } );
        }
    };

    const handleUpdate = async ( data ) => {
        try {
            await updateEmployee( editingEmployee.id, data );
            setNotice( { type: 'success', message: __( 'Employee updated successfully.', 'employee-manager' ) } );
            setView( 'list' );
            setEditingEmployee( null );
            loadEmployees();
        } catch ( err ) {
            setNotice( { type: 'error', message: err.message } );
        }
    };

    const handleDelete = async ( id ) => {
        if ( ! window.confirm( __( 'Are you sure you want to delete this employee?', 'employee-manager' ) ) ) {
            return;
        }
        try {
            await deleteEmployee( id );
            setNotice( { type: 'success', message: __( 'Employee deleted.', 'employee-manager' ) } );
            loadEmployees();
        } catch ( err ) {
            setNotice( { type: 'error', message: err.message } );
        }
    };

    const handleEdit = ( employee ) => {
        setEditingEmployee( employee );
        setView( 'edit' );
    };

    const handleSort = ( field ) => {
        if ( sortField === field ) {
            setSortOrder( sortOrder === 'asc' ? 'desc' : 'asc' );
        } else {
            setSortField( field );
            setSortOrder( 'asc' );
        }
        setPage( 1 );
    };

    return (
        <div className="em-app">
            <div className="em-header">
                <div className="em-header-left">
                    <h1>{ view === 'list' ? __( 'Employee Manager', 'employee-manager' ) : view === 'add' ? __( 'Add Employee', 'employee-manager' ) : __( 'Edit Employee', 'employee-manager' ) }</h1>
                    <div className="em-subtitle">
                        { view === 'list'
                            ? __( 'Manage your team members and their information', 'employee-manager' )
                            : view === 'add'
                                ? __( 'Fill in the details to add a new team member', 'employee-manager' )
                                : __( 'Update employee information', 'employee-manager' )
                        }
                    </div>
                </div>
                { view === 'list' ? (
                    <div className="em-header-actions">
                        <button className="em-btn-add" onClick={ () => setView( 'add' ) }>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            { __( 'Add Employee', 'employee-manager' ) }
                        </button>
                        <a
                            className="em-btn-settings"
                            href={ settingsUrl }
                            aria-label={ __( 'Settings', 'employee-manager' ) }
                            title={ __( 'Settings', 'employee-manager' ) }
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </a>
                    </div>
                ) : (
                    <button className="em-btn-back" onClick={ () => { setView( 'list' ); setEditingEmployee( null ); } }>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
                        { __( 'Back to List', 'employee-manager' ) }
                    </button>
                ) }
            </div>

            { notice && (
                <Notice
                    status={ notice.type }
                    isDismissible
                    onDismiss={ () => setNotice( null ) }
                >
                    { notice.message }
                </Notice>
            ) }

            { view === 'list' && (
                <>
                    <div className="em-stats">
                        <div className="em-stat-card">
                            <div className="em-stat-icon blue">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </div>
                            <div className="em-stat-value">{ total }</div>
                            <div className="em-stat-label">{ __( 'Total Employees', 'employee-manager' ) }</div>
                        </div>
                        <div className="em-stat-card">
                            <div className="em-stat-icon green">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </div>
                            <div className="em-stat-value">{ departments }</div>
                            <div className="em-stat-label">{ __( 'Departments', 'employee-manager' ) }</div>
                        </div>
                        <div className="em-stat-card">
                            <div className="em-stat-icon orange">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                            </div>
                            <div className="em-stat-value">{ employees.filter( ( e ) => e.photo_url ).length }</div>
                            <div className="em-stat-label">{ __( 'With Photos', 'employee-manager' ) }</div>
                        </div>
                    </div>

                    <EmployeeList
                        employees={ employees }
                        loading={ loading }
                        total={ total }
                        totalPages={ totalPages }
                        page={ page }
                        perPage={ perPage }
                        onPageChange={ setPage }
                        search={ search }
                        onSearchChange={ ( val ) => {
                            setSearch( val );
                            setPage( 1 );
                        } }
                        sortField={ sortField }
                        sortOrder={ sortOrder }
                        onSort={ handleSort }
                        onEdit={ handleEdit }
                        onDelete={ handleDelete }
                        settings={ settings }
                    />
                </>
            ) }

            { view === 'add' && (
                <div className="em-form-view">
                    <EmployeeForm
                        onSubmit={ handleCreate }
                        settings={ settings }
                    />
                </div>
            ) }

            { view === 'edit' && editingEmployee && (
                <div className="em-form-view">
                    <EmployeeForm
                        employee={ editingEmployee }
                        onSubmit={ handleUpdate }
                        settings={ settings }
                    />
                </div>
            ) }
        </div>
    );
}
