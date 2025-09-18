const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://negari-ten.vercel.app",
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",

    // Screenshots and videos
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
  },
})
