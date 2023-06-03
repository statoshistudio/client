module.exports = {
  apps: [
    {
      name: 'app',
      script: './dist/app.js',
    },
    {
      name: 'worker',
      script: './dist/worker.js',
    },
  ],
};
