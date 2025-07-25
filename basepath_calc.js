const pathSegments = window.location.pathname.split('/').filter(p => p);
const depth = pathSegments.length - (window.location.pathname.endsWith('/') ? 0 : 1);
window.basePath = depth > 0 ? '../'.repeat(depth) : './';
