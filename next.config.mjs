/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          // Basic redirect
          {
            source: '/',
            destination: '/login',
            permanent: true,
          },
        ]
      },
    images: {
        // unoptimized: true ,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "gw.alipayobjects.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
