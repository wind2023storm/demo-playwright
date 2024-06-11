//playwright.config.ts

import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",

  timeout: 60 * 1000,

  expect: {
    timeout: 5000,
  },

  reporter: "html",

  use: {
    actionTimeout: 0,

    trace: "on-first-retry",
    headless: false, // set to true if you want headless mode
    viewport: { width: 1920, height: 1080 }, // set the viewport size
  },
};

export default config;
