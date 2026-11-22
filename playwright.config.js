const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
  },
});
