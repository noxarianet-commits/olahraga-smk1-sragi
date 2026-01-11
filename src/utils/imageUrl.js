/**
 * Utility to ensure image URLs are accessible from external devices.
 * If a URL points to localhost, it replaces it with the current window location's hostname.
 * This allows devices on the same network to access images served by the local backend.
 * 
 * @param {string} url - The original image URL
 * @returns {string} - The corrected image URL
 */
export const getProperImageUrl = (url) => {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';

    // If it's already an external URL (e.g. placehold.co, imgbb, or cloudinary), return as is
    // unless it is localhost, which we need to fix.
    if (url.includes('localhost')) {
        return url.replace('localhost', window.location.hostname);
    }

    // If it is a relative path (e.g. /uploads/...), prepend the API base URL logic
    // We assume the backend is on port 5000 based on previous findings, 
    // or we can try to infer from the current location if we want to be more dynamic.
    // However, usually static files are served relative to backend root.
    if (url.startsWith('/')) {
        // Warning: This assumes the backend is on port 5000. 
        // Ideally this should use the environment variable, but this is a quick utility.
        return `http://${window.location.hostname}:5000${url}`;
    }

    return url;
};
