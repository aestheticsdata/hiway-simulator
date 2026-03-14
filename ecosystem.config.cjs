// Production-only PM2 entrypoint for ks-b.
// Local development stays on `pnpm dev` with Next.js default port 3000.
const HOST = "127.0.0.1";
const PORT = "3001";

module.exports = {
  apps: [
    {
      name: "hiwaysim",
      cwd: __dirname,
      script: "./node_modules/next/dist/bin/next",
      args: `start -p ${PORT} -H ${HOST}`,
      interpreter: "node",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT,
        HOST,
      },
    },
  ],
};
