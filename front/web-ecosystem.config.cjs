module.exports = {
  apps: [
    {
      name: 'web-app',
      script: 'nx run web-app:serve',
    },
    {
      name: 'webportal',
      script: 'nx run webportal:serve',
    },
  ],
};
