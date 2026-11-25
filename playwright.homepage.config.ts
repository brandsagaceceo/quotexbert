import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "scripts/homepage-carousel.spec.ts",
  outputDir: "test-results/homepage-carousel",
  reporter: "line",
  workers: 1,
});
