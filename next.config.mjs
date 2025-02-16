/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'utfs.io'},
            { hostname: 'images.pexels.com' }
        ]
    }
};

export default nextConfig;
