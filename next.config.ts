import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Важно: экспорт статического сайта
  basePath: process.env.NODE_ENV === 'production' ? '/planner' : '', // Название репозитория
  images: {
    unoptimized: true, // Для GitHub Pages
  },
  trailingSlash: true, // Рекомендуется для GitHub Pages
};

export default nextConfig;