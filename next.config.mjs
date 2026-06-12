/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.56.1', 'localhost', '127.0.0.1', '192.168.1.161'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aayulkhwmmingelsdbgw.supabase.co',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
