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
  for (const width of [320, 375, 390, 760, 768, 1024, 1280, 1440, 1920]) {
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
    const composition = await carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]').evaluate(slide => {
      const photo = slide.querySelector(".journey-photo")?.getBoundingClientRect();
      const copy = slide.querySelector(".journey-copy")?.getBoundingClientRect();
      return {
        photoLeft: photo?.left ?? 0,
        photoBottom: photo?.bottom ?? 0,
        copyLeft: copy?.left ?? 0,
        copyRight: copy?.right ?? 0,
        copyTop: copy?.top ?? 0,
      };
    });
    if (width <= 760) {
      expect(composition.photoBottom, `mobile photo/copy overlap at ${width}px`).toBeLessThanOrEqual(composition.copyTop + 1);
    } else {
      expect(composition.photoLeft, `desktop photo/copy overlap at ${width}px`).toBeGreaterThanOrEqual(composition.copyRight - 1);
    }
  }
  await carousel.getByRole("button", { name: /^Show journey 5:/ }).click();
  await expect(carousel.locator('[aria-hidden="false"]')).toContainText("social inspiration feed is coming soon");
  await expect(carousel.getByRole("link", { name: "Explore Example Gallery" })).toHaveAttribute("href", "/visualizer-library");
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

test("mobile contractor offer does not cover the sticky estimate action", async ({ page }) => {
  await page.clock.install();
  await page.setViewportSize({ width: 390, height: 844 });
  await openHomepage(page);
  await page.clock.fastForward(1600);
  await expect(page.locator(".sticky-cta-bar")).toBeVisible();
  await expect(page.locator('div[role="banner"][aria-label="New Contractor Offer"]')).toBeHidden();
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
  await expect(carousel.getByRole("link", { name: "Post a Job" })).toHaveAttribute("href", "/create-lead");
  await carousel.getByRole("button", { name: /^Show journey 1:/ }).click();
  await carousel.getByRole("link", { name: "Get My Estimate" }).click();
  await expect(page.locator("#estimator-tool")).toBeInViewport();
  await carousel.scrollIntoViewIfNeeded();
  await carousel.getByRole("button", { name: /^Show journey 2:/ }).click();
  await expect(carousel.getByRole("link", { name: "Post a Job" })).toHaveAttribute("href", "/create-lead");
  await carousel.getByRole("button", { name: /^Show journey 3:/ }).click();
  await carousel.getByRole("button", { name: "Plan My Project", exact: true }).click();
  await expect(page.locator("#quotexbert-ai-panel")).toBeVisible();
  await expect(page.getByText(/Guided AI planning is not enabled/)).toBeVisible();
  expect(writes).toEqual([]);
});

test("six licensed carousel photographs load with a two-image initial budget and stable desktop/mobile composition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const names = credits.photos.map(photo => photo.file.replace(/\.webp$/, ""));
  expect(new Set(credits.photos.map(photo => photo.source)).size).toBe(7);
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
  const initialCarouselRequests = new Set(await carousel.locator("img").evaluateAll(images =>
    images.map(image => image instanceof HTMLImageElement ? image.currentSrc : ""),
  ));
  const carouselResponses = [...photoResponses.entries()].filter(([url]) => initialCarouselRequests.has(url));
  const initialMedia = {
    photos: carouselResponses.length,
    fullSizeRequests: carouselResponses.filter(([url]) => Number(new URL(url).searchParams.get("w")) > 8).length,
    bytes: (await Promise.all(carouselResponses.map(([, bytes]) => bytes))).reduce((sum, bytes) => sum + bytes, 0),
    totalHomepagePhotoCount: new Set([...photoResponses.keys()].map(url => new URL(url).searchParams.get("url"))).size,
    totalHomepagePhotoBytes: (await Promise.all(photoResponses.values())).reduce((sum, bytes) => sum + bytes, 0),
    urls: carouselResponses.map(([url]) => url),
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
    "Post a Job From a Picture. Get Local Contractor Bids.",
    "Plan Your Renovation Smarter With QuoteXbert AI.",
    "See Your Renovation Before You Start.",
    "Get Inspired by Real Home Renovations.",
    "Find Local Renovation Opportunities.",
  ];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const sources = new Set<string>();
    let height: number | undefined;
    for (let index = 0; index < headings.length; index++) {
      await carousel.getByRole("button", { name: new RegExp(`^Show journey ${index + 1}:`) }).click();
      const slide = carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]');
      await expect(slide.getByRole("heading")).toHaveText(headings[index] ?? "");
      await expect(slide.locator(".journey-chip")).toBeVisible();
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
      const photoRegion = await slide.locator(".journey-photo").boundingBox();
      expect(photoBox?.width).toBe(photoRegion?.width);
      expect(photoBox?.height).toBe(photoRegion?.height);
      if (width > 760) {
        expect(photoRegion?.height).toBe(box?.height);
      } else {
        expect(photoRegion?.height ?? 0).toBeLessThan((box?.height ?? 0) * 0.6);
      }
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
    if (failLastPhoto && decodeURIComponent(route.request().url()).includes("/contractor-flooring.")) {
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

test("photo and job actions use existing destinations without submitting a project or generation", async ({ page }) => {
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
  await expect(carousel.getByRole("link", { name: "Post a Job" })).toHaveAttribute("href", "/create-lead");
  await carousel.getByRole("button", { name: /^Show journey 4:/ }).click();
  await expect(carousel).toContainText("Visualization preview");
  await expect(carousel.getByRole("link", { name: "Try Photo Visualization" })).toHaveAttribute("href", "/visualizer");
  await openHomepage(page);
  await carousel.getByRole("button", { name: /^Show journey 6:/ }).click();
  await expect(carousel.locator('[aria-label="6 of 6"]')).toHaveAttribute("aria-hidden", "false");
  await expect(carousel.getByRole("link", { name: "Browse Jobs" })).toHaveAttribute("href", "/contractor/jobs");
  expect(writes).toEqual([]);
});
