import { createRoot } from '@wordpress/element';
import EmployeeApp from './components/EmployeeApp';
import SettingsApp from './components/SettingsApp';
import './style.css';

const employeeRoot = document.getElementById( 'employee-manager-app' );
const settingsRoot = document.getElementById( 'employee-manager-settings' );

if ( employeeRoot ) {
    createRoot( employeeRoot ).render( <EmployeeApp /> );
}

if ( settingsRoot ) {
    createRoot( settingsRoot ).render( <SettingsApp /> );
}
