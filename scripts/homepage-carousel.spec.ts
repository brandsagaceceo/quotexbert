import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://127.0.0.1:3102", hasTouch: true });
test.setTimeout(60_000);

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("region", { name: "Renovation journeys" })).toBeVisible();
});

test("six existing journeys fit mobile/desktop without hidden focus targets or false feed claims", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  await expect(carousel.locator('[aria-roledescription="slide"]')).toHaveCount(6);
  for (const width of [320, 375, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await carousel.evaluate(element => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      clipping: [...element.querySelectorAll("h2,p,a,button")].filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && (rect.left < 0 || rect.right > innerWidth || node.scrollWidth > node.clientWidth + 1);
      }).length,
      hiddenTabStops: [...element.querySelectorAll<HTMLElement>('[aria-hidden="true"] a,[aria-hidden="true"] button')]
        .filter(node => node.tabIndex !== -1).length,
    }));
    expect(layout, `viewport ${width}`).toEqual({ overflow: false, clipping: 0, hiddenTabStops: 0 });
  }
  await carousel.getByRole("button", { name: /^Show journey 6:/ }).click();
  await expect(carousel.locator('[aria-hidden="false"]')).toContainText("social inspiration feed is not released");
  await expect(carousel.getByRole("link", { name: "Browse design examples" })).toHaveAttribute("href", "/visualizer-library");
  await page.goto("/visualizer-library", { waitUntil: "domcontentloaded" });
  await expect(page.getByText(/Illustrative stock-image examples/)).toBeVisible();
});

test("automatic rotation pauses for hover/focus and manual keyboard/navigation works", async ({ page }) => {
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const active = carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]');
  await expect(carousel.getByRole("button", { name: "Pause automatic rotation" })).toBeEnabled();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(6100);
  await expect(active).toHaveAttribute("aria-label", "2 of 6");
  await carousel.hover();
  await page.clock.fastForward(12000);
  await expect(active).toHaveAttribute("aria-label", "2 of 6");
  await carousel.focus();
  await expect(carousel.getByRole("button", { name: "Start automatic rotation" })).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(12000);
  await expect(active).toHaveAttribute("aria-label", "2 of 6");
  await carousel.press("End");
  await expect(active).toHaveAttribute("aria-label", "6 of 6");
  await carousel.press("ArrowRight");
  await expect(active).toHaveAttribute("aria-label", "1 of 6");
  await carousel.getByRole("button", { name: "Previous journey" }).click();
  await expect(active).toHaveAttribute("aria-label", "6 of 6");
  await carousel.getByRole("button", { name: "Next journey" }).click();
  await expect(active).toHaveAttribute("aria-label", "1 of 6");
});

test("reduced motion disables autoplay, horizontal touch works, and existing actions do not write data", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const active = carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]');
  const writes: string[] = [];
  await page.route("**/api/**", async route => {
    const request = route.request();
    if (new URL(request.url()).origin === "http://127.0.0.1:3102" && request.method() !== "GET") {
      writes.push(request.url());
      await route.abort();
      return;
    }
    await route.continue();
  });
  await expect(carousel.getByRole("button", { name: /disabled for reduced motion/ })).toBeDisabled();
  await page.clock.fastForward(15000);
  await expect(active).toHaveAttribute("aria-label", "1 of 6");
  await carousel.evaluate(element => {
    const gesture = (startX: number, startY: number, endX: number, endY: number) => {
      const start = new Touch({ identifier: 1, target: element, clientX: startX, clientY: startY });
      const end = new Touch({ identifier: 1, target: element, clientX: endX, clientY: endY });
      element.dispatchEvent(new TouchEvent("touchstart", { touches: [start], bubbles: true }));
      element.dispatchEvent(new TouchEvent("touchend", { changedTouches: [end], bubbles: true }));
    };
    gesture(220, 150, 80, 155);
  });
  await expect(active).toHaveAttribute("aria-label", "2 of 6");
  await carousel.evaluate(element => {
    const start = new Touch({ identifier: 1, target: element, clientX: 100, clientY: 220 });
    const end = new Touch({ identifier: 1, target: element, clientX: 105, clientY: 40 });
    element.dispatchEvent(new TouchEvent("touchstart", { touches: [start], bubbles: true }));
    element.dispatchEvent(new TouchEvent("touchend", { changedTouches: [end], bubbles: true }));
  });
  await expect(active).toHaveAttribute("aria-label", "2 of 6");
  await carousel.getByRole("link", { name: "Start a photo project" }).click();
  await expect(page.locator("#estimator-tool")).toBeInViewport();
  await carousel.scrollIntoViewIfNeeded();
  await carousel.getByRole("button", { name: /^Show journey 3:/ }).click();
  await expect(carousel.getByRole("link", { name: "Prepare a job post" })).toHaveAttribute("href", "/create-lead");
  await carousel.getByRole("button", { name: /^Show journey 4:/ }).click();
  await carousel.getByRole("button", { name: "Open QuoteXbert AI", exact: true }).click();
  await expect(page.locator("#quotexbert-ai-panel")).toBeVisible();
  await expect(page.getByText(/Guided AI planning is not enabled/)).toBeVisible();
  expect(writes).toEqual([]);
});

test("existing public activity never substitutes fake events for errors and normalizes real timestamps", async ({ page }) => {
  let state: "failed" | "ready" | "malformed" | "empty" = "failed";
  await page.route("**/api/activity-feed*", async route => {
    const activity = {
      id: "isolated-fixture",
      type: "job_posted",
      category: "Fixture project",
      city: "Isolated fixture city",
      timestamp: state === "malformed" ? "not-a-date" : new Date().toISOString(),
    };
    await route.fulfill({
      status: state === "failed" ? 503 : 200,
      contentType: "application/json",
      body: JSON.stringify({ activities: state === "empty" ? [] : [activity] }),
    });
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  const feed = page.getByRole("region", { name: "Recent Renovation Estimates" });
  await expect(feed.getByRole("alert")).toContainText("No example activity is shown");
  await expect(feed.getByRole("heading", { level: 3 })).toHaveCount(0);
  state = "ready";
  await feed.getByRole("button", { name: "Try again" }).click();
  await expect(feed).toContainText("Fixture project posted");
  await expect(feed).toContainText("Isolated fixture city");
  await expect(feed).not.toContainText("NaN");
  state = "malformed";
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(feed.getByRole("alert")).toBeVisible();
  await expect(feed.getByRole("heading", { level: 3 })).toHaveCount(0);
  state = "empty";
  await feed.getByRole("button", { name: "Try again" }).click();
  await expect(feed).toContainText("No public activity is available");
  await expect(page.getByRole("heading", { name: "Trusted by Toronto Homeowners" })).toHaveCount(0);
});
