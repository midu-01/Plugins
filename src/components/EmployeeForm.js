import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function EmployeeForm( { employee, onSubmit, settings } ) {
    const [ formData, setFormData ] = useState( {
        full_name: employee?.full_name || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        department: employee?.department || '',
        photo_id: employee?.photo_id || 0,
    } );
    const [ photoPreview, setPhotoPreview ] = useState( employee?.photo_url || '' );
    const [ submitting, setSubmitting ] = useState( false );

    const visibleFields = settings.visible_fields || [];
    const requiredFields = settings.required_fields || [];
    const placeholders = settings.placeholders || {};
    const photoUploadEnabled = settings.photo_upload;

    const updateField = ( field, value ) => {
        setFormData( { ...formData, [ field ]: value } );
    };

    const handlePhotoSelect = () => {
        const frame = wp.media( {
            title: __( 'Select Profile Photo', 'employee-manager' ),
            multiple: false,
            library: { type: 'image' },
        } );

        frame.on( 'select', () => {
            const attachment = frame.state().get( 'selection' ).first().toJSON();
            updateField( 'photo_id', attachment.id );
            setPhotoPreview( attachment.url );
        } );

        frame.open();
    };

    const handleRemovePhoto = () => {
        updateField( 'photo_id', 0 );
        setPhotoPreview( '' );
    };

    const handleSubmit = async ( e ) => {
        e.preventDefault();
        setSubmitting( true );
        await onSubmit( formData );
        setSubmitting( false );
    };

    const isRequired = ( field ) => requiredFields.includes( field );

    return (
        <div className="em-form-card">
            <div className="em-form-card-header">
                <h2>{ employee ? __( 'Employee Details', 'employee-manager' ) : __( 'New Employee', 'employee-manager' ) }</h2>
                <p>{ employee ? __( 'Update the information below', 'employee-manager' ) : __( 'Fill in the details for the new team member', 'employee-manager' ) }</p>
            </div>

            <form onSubmit={ handleSubmit } className="em-form">
                <div className="em-form-body">
                    { visibleFields.includes( 'photo' ) && photoUploadEnabled && (
                        <div className="em-photo-upload">
                            <label>{ __( 'Profile Photo', 'employee-manager' ) }</label>
                            { photoPreview ? (
                                <div className="em-photo-selected">
                                    <img src={ photoPreview } alt="" />
                                    <div className="em-photo-selected-actions">
                                        <Button variant="secondary" size="small" onClick={ handlePhotoSelect }>
                                            { __( 'Change Photo', 'employee-manager' ) }
                                        </Button>
                                        <Button variant="link" isDestructive size="small" onClick={ handleRemovePhoto }>
                                            { __( 'Remove', 'employee-manager' ) }
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="em-photo-dropzone" onClick={ handlePhotoSelect } role="button" tabIndex={ 0 } onKeyDown={ ( e ) => e.key === 'Enter' && handlePhotoSelect() }>
                                    <div className="em-upload-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <p><strong>{ __( 'Click to upload', 'employee-manager' ) }</strong> { __( 'a profile photo', 'employee-manager' ) }</p>
                                    <p className="em-upload-hint">PNG, JPG { __( 'up to 2MB', 'employee-manager' ) }</p>
                                </div>
                            ) }
                        </div>
                    ) }

                    <div className="em-field-row">
                        { visibleFields.includes( 'full_name' ) && (
                            <div className="em-field-group">
                                <label>
                                    { __( 'Full Name', 'employee-manager' ) }
                                    { isRequired( 'full_name' ) && <span className="em-required">*</span> }
                                </label>
                                <input
                                    type="text"
                                    value={ formData.full_name }
                                    onChange={ ( e ) => updateField( 'full_name', e.target.value ) }
                                    placeholder={ placeholders.full_name || '' }
                                    required={ isRequired( 'full_name' ) }
                                />
                            </div>
                        ) }

                        { visibleFields.includes( 'email' ) && (
                            <div className="em-field-group">
                                <label>
                                    { __( 'Email Address', 'employee-manager' ) }
                                    { isRequired( 'email' ) && <span className="em-required">*</span> }
                                </label>
                                <input
                                    type="email"
                                    value={ formData.email }
                                    onChange={ ( e ) => updateField( 'email', e.target.value ) }
                                    placeholder={ placeholders.email || '' }
                                    required={ isRequired( 'email' ) }
                                />
                            </div>
                        ) }
                    </div>

                    <div className="em-field-row">
                        { visibleFields.includes( 'phone' ) && (
                            <div className="em-field-group">
                                <label>
                                    { __( 'Phone Number', 'employee-manager' ) }
                                    { isRequired( 'phone' ) && <span className="em-required">*</span> }
                                </label>
                                <input
                                    type="tel"
                                    value={ formData.phone }
                                    onChange={ ( e ) => updateField( 'phone', e.target.value ) }
                                    placeholder={ placeholders.phone || '' }
                                    required={ isRequired( 'phone' ) }
                                />
                            </div>
                        ) }

                        { visibleFields.includes( 'department' ) && (
                            <div className="em-field-group">
                                <label>
                                    { __( 'Department', 'employee-manager' ) }
                                    { isRequired( 'department' ) && <span className="em-required">*</span> }
                                </label>
                                <input
                                    type="text"
                                    value={ formData.department }
                                    onChange={ ( e ) => updateField( 'department', e.target.value ) }
                                    placeholder={ placeholders.department || '' }
                                    required={ isRequired( 'department' ) }
                                />
                            </div>
                        ) }
                    </div>
                </div>

                <div className="em-form-footer">
                    <button
                        type="submit"
                        className="em-btn-submit"
                        disabled={ submitting }
                    >
                        { submitting
                            ? __( 'Saving...', 'employee-manager' )
                            : employee
                                ? __( 'Update Employee', 'employee-manager' )
                                : __( 'Create Employee', 'employee-manager' )
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}
