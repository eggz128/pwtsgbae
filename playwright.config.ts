import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './tests/my-test';

export const STORAGE_STATE = 'user.json'
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  testDir: './tests',
  expect: {timeout: 3000},
  timeout: 20 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0, //if else
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'json-results/testresults.json'} ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://www.edgewordstraining.co.uk/',
    //launchOptions: {slowMo: 2000}, //Debugging option - slow down test execution

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    headless: true,
    //launchOptions: {slowMo: 500},
    //actionTimeout: 5000,
    screenshot: 'on',

    
  },

  /* Configure projects for major browsers */
  projects: [

    {
      name: 'setup',
      testMatch: 'globalSetup.ts',
      timeout: 2 * 60 * 1000,
      teardown: 'teardown'
    },
    {
      name: 'teardown',
      testMatch: 'globalTeardown.ts',
      use: { storageState: STORAGE_STATE }
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        person: 'Bob',
        storageState: STORAGE_STATE
       },
      default: false,
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'],
        //viewport: { width: 320, height: 200 },
        //headless: true,
        person: 'Alice',
        storageState: STORAGE_STATE
      },
      dependencies: ['setup']
      
      
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'],
        person: 'John'
       },
      default: false,
      //retries: 2,
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'],
        viewport: { width: 600, height: 400}  ,
           },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPad Pro 11 landscape'] },
    },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
