import { useState, useEffect } from '@wordpress/element';
import { Notice, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { fetchSettings, saveSettings } from '../api';

const FIELD_OPTIONS = [
    {
        key: 'full_name',
        label: __( 'Full Name', 'employee-manager' ),
        description: __( 'Primary name field shown in the form and employee table.', 'employee-manager' ),
        placeholder: __( 'Enter full name', 'employee-manager' ),
    },
    {
        key: 'email',
        label: __( 'Email', 'employee-manager' ),
        description: __( 'Used for employee contact details and list display.', 'employee-manager' ),
        placeholder: __( 'Enter email address', 'employee-manager' ),
    },
    {
        key: 'phone',
        label: __( 'Phone', 'employee-manager' ),
        description: __( 'Optional contact number field for employee records.', 'employee-manager' ),
        placeholder: __( 'Enter phone number', 'employee-manager' ),
    },
    {
        key: 'department',
        label: __( 'Department', 'employee-manager' ),
        description: __( 'Organize employees by their assigned department.', 'employee-manager' ),
        placeholder: __( 'Enter department', 'employee-manager' ),
    },
];

function SwitchControl( { label, checked, onChange, disabled = false } ) {
    return (
        <label className={ `em-switch ${ disabled ? 'is-disabled' : '' }` }>
            <span className="screen-reader-text">{ label }</span>
            <input
                type="checkbox"
                checked={ checked }
                onChange={ ( event ) => onChange( event.target.checked ) }
                disabled={ disabled }
            />
            <span className="em-switch-track" aria-hidden="true">
                <span className="em-switch-thumb" />
            </span>
        </label>
    );
}

function RowToggle( { label, checked, onChange, disabled = false } ) {
    return (
        <div className="em-settings-toggle">
            <span className="em-settings-toggle__label">{ label }</span>
            <SwitchControl
                label={ label }
                checked={ checked }
                onChange={ onChange }
                disabled={ disabled }
            />
        </div>
    );
}

export default function SettingsApp() {
    const [ settings, setSettings ] = useState( null );
    const [ saving, setSaving ] = useState( false );
    const [ notice, setNotice ] = useState( null );

    useEffect( () => {
        fetchSettings().then( setSettings ).catch( ( err ) => {
            setNotice( { type: 'error', message: err.message } );
        } );
    }, [] );

    useEffect( () => {
        if ( notice ) {
            const timer = setTimeout( () => setNotice( null ), 4000 );
            return () => clearTimeout( timer );
        }
    }, [ notice ] );

    if ( ! settings ) {
        return (
            <div className="em-loading">
                <Spinner />
            </div>
        );
    }

    const hasArrayValue = ( key, value ) => settings[ key ]?.includes( value );

    const updateArraySetting = ( key, value, enabled ) => {
        const currentValues = settings[ key ] || [];
        const nextValues = enabled
            ? [ ...new Set( [ ...currentValues, value ] ) ]
            : currentValues.filter( ( item ) => item !== value );

        setSettings( {
            ...settings,
            [ key ]: nextValues,
        } );
    };

    const updateFieldVisibility = ( fieldKey, enabled ) => {
        const nextVisibleFields = enabled
            ? [ ...new Set( [ ...( settings.visible_fields || [] ), fieldKey ] ) ]
            : ( settings.visible_fields || [] ).filter( ( item ) => item !== fieldKey );

        const nextRequiredFields = enabled
            ? settings.required_fields || []
            : ( settings.required_fields || [] ).filter( ( item ) => item !== fieldKey );

        setSettings( {
            ...settings,
            visible_fields: nextVisibleFields,
            required_fields: nextRequiredFields,
        } );
    };

    const updatePlaceholder = ( fieldKey, value ) => {
        setSettings( {
            ...settings,
            placeholders: {
                ...settings.placeholders,
                [ fieldKey ]: value,
            },
        } );
    };

    const handleSave = async () => {
        setSaving( true );

        try {
            const updated = await saveSettings( settings );
            setSettings( updated );
            setNotice( {
                type: 'success',
                message: __( 'Settings saved successfully.', 'employee-manager' ),
            } );
        } catch ( err ) {
            setNotice( { type: 'error', message: err.message } );
        }

        setSaving( false );
    };

    return (
        <div className="em-settings">
            <div className="em-settings-shell">
                <div className="em-settings-header">
                    <div className="em-settings-header__top">
                        <h1>{ __( 'Settings', 'employee-manager' ) }</h1>
                        <span className="em-settings-eyebrow">
                            { __( 'Employee Manager', 'employee-manager' ) }
                        </span>
                    </div>
                    <p>{ __( 'Manage field visibility, validation, and media behavior from one clean settings screen.', 'employee-manager' ) }</p>
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

                <div className="em-settings-section">
                    <div className="em-settings-section__header">
                        <div>
                            <h2>{ __( 'Employee Fields', 'employee-manager' ) }</h2>
                            <p>{ __( 'Each field stays on its own row so you can control visibility, required status, and placeholder text without switching tabs.', 'employee-manager' ) }</p>
                        </div>
                    </div>

                    <div className="em-settings-list">
                        { FIELD_OPTIONS.map( ( field ) => {
                            const isVisible = hasArrayValue( 'visible_fields', field.key );
                            const isRequired = hasArrayValue( 'required_fields', field.key );

                            return (
                                <div key={ field.key } className="em-settings-row">
                                    <div className="em-settings-row__info">
                                        <h3>{ field.label }</h3>
                                        <p>{ field.description }</p>
                                    </div>

                                    <div className="em-settings-row__controls">
                                        <label className="em-settings-input">
                                            <span className="em-settings-input__label">
                                                { __( 'Placeholder text', 'employee-manager' ) }
                                            </span>
                                            <input
                                                type="text"
                                                value={ settings.placeholders?.[ field.key ] || '' }
                                                placeholder={ field.placeholder }
                                                onChange={ ( event ) => updatePlaceholder( field.key, event.target.value ) }
                                                disabled={ ! isVisible }
                                            />
                                        </label>

                                        <div className="em-settings-row__toggles">
                                            <RowToggle
                                                label={ __( 'Visible', 'employee-manager' ) }
                                                checked={ isVisible }
                                                onChange={ ( enabled ) => updateFieldVisibility( field.key, enabled ) }
                                            />

                                            <RowToggle
                                                label={ __( 'Required', 'employee-manager' ) }
                                                checked={ isRequired }
                                                onChange={ ( enabled ) => updateArraySetting( 'required_fields', field.key, enabled ) }
                                                disabled={ ! isVisible }
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        } ) }
                    </div>
                </div>

                <div className="em-settings-section">
                    <div className="em-settings-section__header">
                        <div>
                            <h2>{ __( 'Media', 'employee-manager' ) }</h2>
                            <p>{ __( 'Control whether the profile photo field is shown and whether uploads are allowed in the employee form.', 'employee-manager' ) }</p>
                        </div>
                    </div>

                    <div className="em-settings-list">
                        <div className="em-settings-row">
                            <div className="em-settings-row__info">
                                <h3>{ __( 'Profile Photo', 'employee-manager' ) }</h3>
                                <p>{ __( 'Display the profile photo field in the form and allow users to upload or change employee photos.', 'employee-manager' ) }</p>
                            </div>

                            <div className="em-settings-row__controls">
                                <div className="em-settings-row__toggles">
                                    <RowToggle
                                        label={ __( 'Visible', 'employee-manager' ) }
                                        checked={ hasArrayValue( 'visible_fields', 'photo' ) }
                                        onChange={ ( enabled ) => updateArraySetting( 'visible_fields', 'photo', enabled ) }
                                    />

                                    <RowToggle
                                        label={ __( 'Uploads enabled', 'employee-manager' ) }
                                        checked={ !! settings.photo_upload }
                                        onChange={ ( enabled ) => setSettings( { ...settings, photo_upload: enabled } ) }
                                        disabled={ ! hasArrayValue( 'visible_fields', 'photo' ) }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="em-settings-actions">
                    <button
                        className="em-btn-submit"
                        onClick={ handleSave }
                        disabled={ saving }
                    >
                        { saving ? __( 'Saving...', 'employee-manager' ) : __( 'Save Settings', 'employee-manager' ) }
                    </button>
                </div>
            </div>
        </div>
    );
}
