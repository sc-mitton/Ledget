module.exports = {
  apps: [
    {
      name: 'web-app-main',
      script: 'nx run web-app:serve',
    },
    {
      name: 'web-portal-app',
      script: 'nx run web-portal-app:serve',
    },
  ],
};
