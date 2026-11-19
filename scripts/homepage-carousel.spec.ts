import { expect, test, type Page } from "@playwright/test";
import credits from "../public/homepage/photography-credits.json";

test.use({ baseURL: "http://127.0.0.1:3102", hasTouch: true, viewport: { width: 1440, height: 1000 } });
test.setTimeout(60_000);

async function openHomepage(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  await expect(carousel).toBeVisible();
  await expect(carousel.locator("img")).toHaveCount(2);
}

test("six existing journeys fit mobile/desktop without hidden focus targets or false feed claims", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHomepage(page);
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
    const logos = await page.getByRole("link", { name: "QuoteXbert", exact: true }).first().locator("img").evaluateAll(images =>
      images.map(image => ({
        loaded: image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
        centre: image.getBoundingClientRect().y + image.getBoundingClientRect().height / 2,
      })),
    );
    expect(logos).toHaveLength(2);
    expect(logos.every(logo => logo.loaded)).toBe(true);
    expect(Math.abs((logos[0]?.centre ?? 0) - (logos[1]?.centre ?? 0))).toBeLessThanOrEqual(1);
  }
  await carousel.getByRole("button", { name: /^Show journey 6:/ }).click();
  await expect(carousel.locator('[aria-hidden="false"]')).toContainText("social inspiration feed is not released");
  await expect(carousel.getByRole("link", { name: "Explore Renovation Ideas" })).toHaveAttribute("href", "/visualizer-library");
  await page.goto("/visualizer-library", { waitUntil: "domcontentloaded" });
  await expect(page.getByText(/Illustrative stock-image examples/)).toBeVisible();
});

test("automatic rotation pauses for hover/focus and manual keyboard/navigation works", async ({ page }) => {
  await page.clock.install();
  await openHomepage(page);
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
  await page.clock.install();
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHomepage(page);
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
  await expect(carousel.getByRole("link", { name: "Post My Project" })).toHaveAttribute("href", "/create-lead");
  await carousel.getByRole("button", { name: /^Show journey 1:/ }).click();
  await carousel.getByRole("link", { name: "Get My Free Estimate" }).click();
  await expect(page.locator("#estimator-tool")).toBeInViewport();
  await carousel.scrollIntoViewIfNeeded();
  await carousel.getByRole("button", { name: /^Show journey 3:/ }).click();
  await expect(carousel.getByRole("link", { name: "Post a Job" })).toHaveAttribute("href", "/create-lead");
  await carousel.getByRole("button", { name: /^Show journey 4:/ }).click();
  await carousel.getByRole("button", { name: "Plan With AI", exact: true }).click();
  await expect(page.locator("#quotexbert-ai-panel")).toBeVisible();
  await expect(page.getByText(/Guided AI planning is not enabled/)).toBeVisible();
  expect(writes).toEqual([]);
});

test("six licensed photographs load with a two-image initial budget and stable desktop/mobile composition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const names = credits.photos.map(photo => photo.file.replace(/\.webp$/, ""));
  expect(new Set(credits.photos.map(photo => photo.source)).size).toBe(6);
  expect(credits.license.url).toBe("https://www.pexels.com/license/");
  const photoResponses = new Map<string, Promise<number>>();
  page.on("response", response => {
    if (names.some(name => decodeURIComponent(response.url()).includes(`/${name}.`))) {
      photoResponses.set(response.url(), response.body().then(body => body.byteLength));
    }
  });
  await openHomepage(page);
  await expect(carousel.locator("img")).toHaveCount(2);
  await expect.poll(() => carousel.locator("img").evaluateAll(images =>
    images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0),
  )).toBe(true);
  const initialMedia = {
    photos: new Set([...photoResponses.keys()].map(url => new URL(url).searchParams.get("url"))).size,
    fullSizeRequests: [...photoResponses.keys()].filter(url => Number(new URL(url).searchParams.get("w")) > 8).length,
    bytes: (await Promise.all(photoResponses.values())).reduce((sum, bytes) => sum + bytes, 0),
    urls: [...photoResponses.keys()],
  };
  expect(initialMedia.photos).toBe(2);
  expect(initialMedia.fullSizeRequests).toBe(2);
  expect(initialMedia.bytes).toBeGreaterThan(0);
  expect(initialMedia.bytes).toBeLessThan(350_000);
  await test.info().attach("initial-photo-network.json", {
    body: JSON.stringify(initialMedia),
    contentType: "application/json",
  });
  await expect(carousel.locator("img").first()).toHaveAttribute("fetchpriority", "high");
  const headings = [
    "Take a Picture. Get an Instant Renovation Quote.",
    "One Photo. Multiple Contractor Bids.",
    "Find the Right Contractor for Your Next Project.",
    "Plan Your Renovation Smarter With QuoteXbert AI.",
    "See Your Renovation Before You Start.",
    "Get Inspired for Your Next Renovation.",
  ];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const sources = new Set<string>();
    let height: number | undefined;
    for (let index = 0; index < headings.length; index++) {
      await carousel.getByRole("button", { name: new RegExp(`^Show journey ${index + 1}:`) }).click();
      const slide = carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]');
      await expect(slide.getByRole("heading")).toHaveText(headings[index] ?? "");
      const image = slide.getByRole("img");
      await expect.poll(() => image.evaluate(node =>
        node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0,
      )).toBe(true);
      sources.add(await image.getAttribute("src") ?? "");
      await expect(slide.getByRole("link", { name: /Stock photo:/ })).toHaveAttribute("href", credits.photos[index]?.source ?? "");
      const box = await carousel.boundingBox();
      expect(box).not.toBeNull();
      if (height === undefined) height = box?.height;
      expect(box?.height).toBe(height);
      const photoBox = await image.boundingBox();
      expect(photoBox?.width).toBe(box?.width);
      expect(photoBox?.height ?? 0).toBeGreaterThan((box?.height ?? 0) * 0.75);
      await carousel.screenshot({
        path: test.info().outputPath(`journey-${index + 1}-${width === 1440 ? "desktop" : "mobile"}.png`),
        animations: "disabled",
      });
      if (width === 1440 && index === 0) {
        await page.screenshot({ path: test.info().outputPath("homepage-desktop.png"), animations: "disabled" });
      }
    }
    expect(sources.size).toBe(6);
  }
});

test("failed replacement photography reports an error without blanking the current scene", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHomepage(page);
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const active = carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]');
  await expect.poll(() => active.getByRole("img").evaluate(node =>
    node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0,
  )).toBe(true);
  let failLastPhoto = true;
  await page.route("**/_next/image?**", async route => {
    if (failLastPhoto && decodeURIComponent(route.request().url()).includes("/finished-living-room.")) {
      await route.fulfill({ status: 503, body: "Isolated photo failure" });
    } else {
      await route.continue();
    }
  });
  await carousel.getByRole("button", { name: /^Show journey 6:/ }).click();
  await expect(carousel.getByRole("alert")).toContainText("photograph could not load");
  await expect(active).toHaveAttribute("aria-label", "1 of 6");
  await carousel.getByRole("button", { name: /^Show journey 2:/ }).click();
  await expect(active).toHaveAttribute("aria-label", "2 of 6");
  await expect(carousel.getByRole("alert")).toHaveCount(0);
  failLastPhoto = false;
  await carousel.getByRole("button", { name: /^Show journey 6:/ }).click();
  await expect(active).toHaveAttribute("aria-label", "6 of 6");
  await expect(carousel.getByRole("alert")).toHaveCount(0);
});

test("photo project and visualization actions open their existing pages without submitting a project or generation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHomepage(page);
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const writes: string[] = [];
  await page.route("**/api/**", async route => {
    if (new URL(route.request().url()).origin === "http://127.0.0.1:3102" && route.request().method() !== "GET") {
      writes.push(route.request().url());
      await route.abort();
      return;
    }
    await route.continue();
  });
  await carousel.getByRole("button", { name: /^Show journey 2:/ }).click();
  await carousel.getByRole("link", { name: "Post My Project" }).click();
  await expect(page).toHaveURL(/\/create-lead$/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Sign In Required" })).toBeVisible();
  await page.goBack({ waitUntil: "domcontentloaded" });
  await carousel.getByRole("button", { name: /^Show journey 5:/ }).click();
  await expect(carousel).toContainText("Visualization preview");
  await carousel.getByRole("link", { name: "Try Photo Visualization" }).click();
  await expect(page).toHaveURL(/\/visualizer$/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { level: 1, name: /Visualize Your Dream Space/ })).toBeVisible();
  expect(writes).toEqual([]);
});

test("existing public activity never substitutes fake events for errors and normalizes real timestamps", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHomepage(page);
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
