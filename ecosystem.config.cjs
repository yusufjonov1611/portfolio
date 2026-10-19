module.exports = {
  apps: [
    {
      name: "uwp-portfolio",
      script: "server/index.js",
      cwd: __dirname,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
