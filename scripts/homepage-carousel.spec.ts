import { expect as playwrightExpect, test, type Page } from "@playwright/test";
import credits from "../public/homepage/photography-credits.json";

const privateReviewMode = process.env.NEXT_PUBLIC_QX_BANNER_REVIEW === "1";
const privateReviewPhotoNames = [
  "estimate",
  "local-bids",
  "ai-planning",
  "visualize-kitchen",
  "inspiration",
  "contractor",
];
const expect = privateReviewMode ? playwrightExpect.configure({ timeout: 15_000 }) : playwrightExpect;

test.use({ baseURL: "http://127.0.0.1:3102", hasTouch: true, viewport: { width: 1440, height: 1000 } });
test.setTimeout(60_000);

async function openHomepage(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  await expect(carousel).toBeVisible();
  const journeyPhotos = carousel.locator(".journey-photo img");
  await expect(journeyPhotos).toHaveCount(2);
  await expect.poll(() => journeyPhotos.evaluateAll(images =>
    images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0),
  )).toBe(true);
}

test("six journeys fit mobile/desktop and the inspiration banner opens the available gallery", async ({ page }) => {
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
  const inspirationSlide = carousel.locator('[aria-hidden="false"]');
  await expect(inspirationSlide.getByRole("heading")).toHaveText("Your dream home starts here.");
  await expect(inspirationSlide).toContainText("Explore renovation ideas and find inspiration for your next home project.");
  await expect(carousel.getByRole("link", { name: "Get inspired" })).toHaveAttribute("href", "/visualizer-library");
  await page.goto("/visualizer-library", { waitUntil: "domcontentloaded" });
  await expect(page.getByText(/Illustrative stock-image examples/)).toBeVisible();
});

test("homepage sections use plain language and keep the estimate disclosure", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Get an estimate, review it, and choose whether to share your project with local contractors.")).toBeVisible();
  await expect(page.getByText("Example photos, not customer projects.", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How QuoteXbert works", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plan your renovation with QuoteXbert" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What to know about your estimate" })).toBeVisible();
  await expect(page.getByText("Your estimate is a starting range, not a contractor's final quote", { exact: true })).toBeVisible();
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

test("reduced motion disables carousel autoplay", async ({ page }) => {
  await page.clock.install();
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHomepage(page);
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const active = carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]');
  await expect(carousel.getByRole("button", { name: /disabled for reduced motion/ })).toBeDisabled();
  await expect(active).toHaveAttribute("aria-label", "1 of 6");
  await page.clock.fastForward(15000);
  await expect(active).toHaveAttribute("aria-label", "1 of 6");
});

test("existing homepage actions use available destinations without writing data", async ({ page }) => {
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
  await carousel.getByRole("link", { name: "Get an estimate" }).click();
  await expect(page.locator("#estimator-tool")).toBeInViewport();
  await carousel.scrollIntoViewIfNeeded();
  await carousel.getByRole("button", { name: /^Show journey 2:/ }).click();
  await expect(active).toHaveAttribute("aria-label", "2 of 6");
  await expect(carousel.getByRole("link", { name: "Post a job" })).toHaveAttribute("href", "/create-lead");
  await carousel.getByRole("button", { name: /^Show journey 3:/ }).click();
  await expect(active).toHaveAttribute("aria-label", "3 of 6");
  await expect(page.locator("#quotexbert-ai-launcher")).toBeAttached();
  await carousel.getByRole("button", { name: "Ask QuoteXbert AI", exact: true }).click();
  await expect(page.locator("#quotexbert-ai-panel")).toBeVisible();
  await expect(page.getByText(/Guided AI planning is not enabled/)).toBeVisible();
  expect(writes).toEqual([]);
});

test("horizontal touch changes journeys while a vertical gesture remains available", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHomepage(page);
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const active = carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]');
  await carousel.evaluate(element => {
    const start = new Touch({ identifier: 1, target: element, clientX: 220, clientY: 150 });
    const end = new Touch({ identifier: 1, target: element, clientX: 80, clientY: 155 });
    element.dispatchEvent(new TouchEvent("touchstart", { touches: [start], bubbles: true }));
    element.dispatchEvent(new TouchEvent("touchend", { changedTouches: [end], bubbles: true }));
  });
  await expect(active).toHaveAttribute("aria-label", "2 of 6");
  await carousel.evaluate(element => {
    const start = new Touch({ identifier: 1, target: element, clientX: 100, clientY: 220 });
    const end = new Touch({ identifier: 1, target: element, clientX: 105, clientY: 40 });
    element.dispatchEvent(new TouchEvent("touchstart", { touches: [start], bubbles: true }));
    element.dispatchEvent(new TouchEvent("touchend", { changedTouches: [end], bubbles: true }));
  });
  await expect(active).toHaveAttribute("aria-label", "2 of 6");
});

test("carousel photographs use the correct source with a two-image initial budget and stable desktop/mobile composition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const names = privateReviewMode
    ? privateReviewPhotoNames.flatMap(name => [name, `${name}-mobile`])
    : credits.photos.map(photo => photo.file.replace(/\.webp$/, ""));
  expect(new Set(credits.photos.map(photo => photo.source)).size).toBe(7);
  expect(credits.license.url).toBe("https://www.pexels.com/license/");
  const photoResponses = new Map<string, Promise<number>>();
  page.on("response", response => {
    if (names.some(name => decodeURIComponent(response.url()).includes(`/${name}.`))) {
      photoResponses.set(response.url(), response.body().then(body => body.byteLength));
    }
  });
  await openHomepage(page);
  const journeyPhotos = carousel.locator(".journey-photo img");
  await expect(journeyPhotos).toHaveCount(2);
  await expect.poll(() => journeyPhotos.evaluateAll(images =>
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
  expect(initialMedia.fullSizeRequests).toBe(privateReviewMode ? 0 : 2);
  expect(initialMedia.bytes).toBeGreaterThan(0);
  expect(initialMedia.bytes).toBeLessThan(350_000);
  await test.info().attach("initial-photo-network.json", {
    body: JSON.stringify(initialMedia),
    contentType: "application/json",
  });
  await expect(carousel.locator("img").first()).toHaveAttribute("fetchpriority", "high");
  const banners = [
    {
      title: "Take a picture. Get an instant quote.",
      description: "Upload a photo and let AI estimate the cost of your renovation.",
      action: "Get an estimate",
    },
    {
      title: "Post a job. Get local quotes.",
      description: "Upload a picture of what you need done and receive quotes from local contractors.",
      action: "Post a job",
    },
    {
      title: "Get help with your renovation.",
      description: "Explore estimates, cost guides and design ideas for your next project.",
      action: "Ask QuoteXbert AI",
    },
    {
      title: "See it before you build it.",
      description: "Upload a photo of your space and see how it could look after a renovation.",
      action: "Visualize your space",
    },
    {
      title: "Your dream home starts here.",
      description: "Explore renovation ideas and find inspiration for your next home project.",
      action: "Get inspired",
    },
    {
      title: "More jobs. More opportunities.",
      description: "Find local renovation jobs, send quotes and grow your contracting business.",
      action: "Find local jobs",
    },
  ];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const sources = new Set<string>();
    let height: number | undefined;
    for (let index = 0; index < banners.length; index++) {
      await carousel.getByRole("button", { name: new RegExp(`^Show journey ${index + 1}:`) }).click();
      const slide = carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]');
      const banner = banners[index];
      if (!banner) throw new Error(`Missing banner copy for journey ${index + 1}`);
      await expect(slide.getByRole("heading")).toHaveText(banner.title);
      await expect(slide.getByText(banner.description, { exact: true })).toBeVisible();
      await expect(slide.locator(".journey-chip, .journey-label, .journey-phone-composition")).toHaveCount(0);
      if (index === 2) {
        await expect(slide.getByRole("button", { name: banner.action })).toBeVisible();
      } else {
        await expect(slide.getByRole("link", { name: banner.action })).toBeVisible();
      }
      const image = slide.getByRole("img");
      await expect.poll(() => image.evaluate(node =>
        node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0,
      )).toBe(true);
      const currentSource = await image.evaluate(node => node instanceof HTMLImageElement ? node.currentSrc : "");
      sources.add(currentSource);
      if (privateReviewMode) {
        const photoName = privateReviewPhotoNames[index];
        expect(currentSource).toContain(`/api/local-banner-review/${photoName}${width <= 760 ? "-mobile" : ""}.webp`);
        await expect(slide.locator(".journey-photo-credit")).toHaveText("Private image review · attribution unverified");
        if (index === 3) {
          expect(currentSource).toContain(`/api/local-banner-review/visualize-kitchen${width <= 760 ? "-mobile" : ""}.webp`);
        }
      } else {
        await expect(slide.getByRole("link", { name: /Stock photo:/ })).toHaveAttribute("href", credits.photos[index]?.source ?? "");
      }
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
  test.skip(privateReviewMode, "The licensed-fallback suite covers replacement-image error handling.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHomepage(page);
  const carousel = page.getByRole("region", { name: "Renovation journeys" });
  const active = carousel.locator('[aria-roledescription="slide"][aria-hidden="false"]');
  await expect.poll(() => active.getByRole("img").evaluate(node =>
    node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0,
  )).toBe(true);
  let failLastPhoto = true;
  await page.route(privateReviewMode ? "**/api/local-banner-review/**" : "**/_next/image?**", async route => {
    const url = decodeURIComponent(route.request().url());
    if (failLastPhoto && (privateReviewMode ? url.includes("/contractor.webp") : url.includes("/contractor-flooring."))) {
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
  await expect(carousel.getByRole("link", { name: "Post a job" })).toHaveAttribute("href", "/create-lead");
  await carousel.getByRole("button", { name: /^Show journey 4:/ }).click();
  await expect(carousel).toContainText("Upload a photo of your space and see how it could look after a renovation.");
  await expect(carousel.getByRole("link", { name: "Visualize your space" })).toHaveAttribute("href", "/visualizer");
  await openHomepage(page);
  await carousel.getByRole("button", { name: /^Show journey 6:/ }).click();
  const contractorSlide = carousel.locator('[aria-label="6 of 6"]');
  await expect.poll(() => contractorSlide.locator("img").evaluate(image =>
    image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
  ), { timeout: 15_000 }).toBe(true);
  await expect(contractorSlide).toHaveAttribute("aria-hidden", "false", { timeout: 15_000 });
  await expect(carousel.getByRole("link", { name: "Find local jobs" })).toHaveAttribute("href", "/contractor/jobs");
  expect(writes).toEqual([]);
});
