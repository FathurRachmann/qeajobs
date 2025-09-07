
/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: {
        buildActivity: false
    },
    experimental: {
        allowedDevOrigins: [
            "https://9000-firebase-qeajobs-1757236629174.cluster-qxqlf3vb3nbf2r42l5qfoebdry.cloudworkstations.dev"
        ]
    }
};

export default nextConfig;
