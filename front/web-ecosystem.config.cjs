module.exports = {
  apps: [
    {
      name: 'web-app-main',
      script: 'nx run web-app-main:serve',
    },
    {
      name: 'web-app-portal',
      script: 'nx run web-app-portal:serve',
    },
  ],
};
