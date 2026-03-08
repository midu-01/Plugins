const { restUrl, nonce } = window.emData;

const headers = {
    'Content-Type': 'application/json',
    'X-WP-Nonce': nonce,
};

export async function fetchEmployees( params = {} ) {
    const query = new URLSearchParams( params ).toString();
    const response = await fetch( `${ restUrl }employees?${ query }`, { headers } );

    if ( ! response.ok ) {
        throw new Error( 'Failed to fetch employees' );
    }

    const data = await response.json();
    return {
        items: data,
        total: parseInt( response.headers.get( 'X-WP-Total' ), 10 ),
        totalPages: parseInt( response.headers.get( 'X-WP-TotalPages' ), 10 ),
    };
}

export async function createEmployee( data ) {
    const response = await fetch( `${ restUrl }employees`, {
        method: 'POST',
        headers,
        body: JSON.stringify( data ),
    } );

    if ( ! response.ok ) {
        const error = await response.json();
        throw new Error( error.message || 'Failed to create employee' );
    }

    return response.json();
}

export async function updateEmployee( id, data ) {
    const response = await fetch( `${ restUrl }employees/${ id }`, {
        method: 'PUT',
        headers,
        body: JSON.stringify( data ),
    } );

    if ( ! response.ok ) {
        const error = await response.json();
        throw new Error( error.message || 'Failed to update employee' );
    }

    return response.json();
}

export async function deleteEmployee( id ) {
    const response = await fetch( `${ restUrl }employees/${ id }`, {
        method: 'DELETE',
        headers,
    } );

    if ( ! response.ok ) {
        throw new Error( 'Failed to delete employee' );
    }

    return response.json();
}

export async function fetchSettings() {
    const response = await fetch( `${ restUrl }settings`, { headers } );
    if ( ! response.ok ) {
        throw new Error( 'Failed to fetch settings' );
    }
    return response.json();
}

export async function saveSettings( data ) {
    const response = await fetch( `${ restUrl }settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify( data ),
    } );

    if ( ! response.ok ) {
        throw new Error( 'Failed to save settings' );
    }

    return response.json();
}
