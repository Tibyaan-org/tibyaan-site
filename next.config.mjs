/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: no server. Deploys as plain files to any static host.
  output: "export",
  // Trailing slashes so /how-it-works/ resolves as a directory on static hosts.
  trailingSlash: true,
  images: { unoptimized: true },
  // A project GitHub Pages site would need basePath here; an org site (root) does not.
  // Left unset for launch; set at hosting time if the site lands on a sub-path.
};

export default nextConfig;
