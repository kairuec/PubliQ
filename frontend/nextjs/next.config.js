/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    REGION: process.env.REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  },
  images: {
    unoptimized: true,
    domains: ["s3-ap-northeast-1.amazonaws.com", "https://via.placeholder.com"], // 画像を読み込む許可するホスト名を指定
  },
};

module.exports = nextConfig;
