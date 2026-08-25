const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@portfolio/db"],
  turbopack: {
    root: path.join(__dirname, "../..")
  }
};

module.exports = nextConfig;
