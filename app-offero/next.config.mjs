/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  /* Cache Components desactivado durante el MVP (D-12) */
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
