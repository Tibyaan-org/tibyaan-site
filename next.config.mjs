// basePath is empty by default (an org GitHub Pages site or a custom domain serves
// at the root). For a project-path deploy (e.g. tibyaan-org.github.io/tibyaan/), set
// BASE_PATH=/tibyaan at build time and assets resolve correctly.
const basePath = process.env.BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: no server. Deploys as plain files to any static host.
  output: "export",
  // Trailing slashes so /how-it-works/ resolves as a directory on static hosts.
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
