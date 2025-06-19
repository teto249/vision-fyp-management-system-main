/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // This disables Strict Mode
  api: {
    bodyParser: {
      sizeLimit: '0' // Remove size limit
    },
    responseLimit: false
  },
  // ...other config options
}

module.exports = nextConfig