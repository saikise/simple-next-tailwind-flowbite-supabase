/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from your Supabase project to be used in Next.js <Image /> components
  images: {
    domains: [process.env.SUPABASE_DOMAIN],
  },
};

module.exports = nextConfig;
