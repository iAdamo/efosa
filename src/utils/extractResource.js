export const extractResource = (endpoint) => {
    if (!endpoint || typeof endpoint !== 'string') {
        return null;
    }

    const segments = endpoint.split('/').filter(Boolean);
    if (!segments[0]) return null;

    const resource = segments[0]
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return resource;
}
