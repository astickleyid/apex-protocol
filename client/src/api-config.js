// Auto-detect API URL based on environment
export function getApiUrl() {
    // Check if we're in Capacitor
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        // Use Mac's IP for native app
        return 'http://192.168.12.152:3001/api';
    }
    // Use relative URL for web
    return '/api';
}
