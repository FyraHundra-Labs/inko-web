// Uses the native repo's existing Playwright installation; start the static server first.
const { chromium, devices, expect } = require(
	require("node:path").resolve(
		__dirname,
		"../../inko/node_modules/@playwright/test",
	),
);
const assert = require("node:assert/strict");
(async () => {
	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({
		...devices["iPhone 13"],
		locale: "en-US",
	});
	const page = await context.newPage();
	const errors = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.goto("http://localhost:8080/demo/");
	await page.getByRole("button", { name: "Close", exact: true }).click();
	await page.locator('.header [data-action="people"]').click();
	for (const name of ["Mom", "Dad", "Sofia", "<img src=x onerror=alert(1)>"]) {
		await page.getByLabel("Name", { exact: true }).fill(name);
		await page.getByLabel("Streak (days)").fill("7");
		await page.getByRole("button", { name: "Add", exact: true }).click();
	}
	let state = await page.evaluate(() =>
		JSON.parse(localStorage.getItem("inko-creator-demo-v1")),
	);
	assert.equal(state.people.length, 4);
	assert(state.people.every((p) => p.streak === 7 && p.emoji[0] === "😊"));
	await page.getByRole("button", { name: "Start recording mode" }).click();
	await expect(page.locator(".person")).toHaveCount(4);
	assert.equal(await page.locator("img").count(), 0);
	await page.locator(".heart").click();
	const emojiButtons = page.locator(".emoji-option");
	assert.equal(await emojiButtons.count(), 50);
	for (let i = 0; i < 4; i++) await emojiButtons.nth(i).click();
	assert.equal(await page.locator('[aria-pressed="true"]').count(), 3);
	await page.getByRole("button", { name: "Done", exact: true }).click();
	await page.locator(".celebration").waitFor();
	await page.reload();
	assert.equal(await page.locator(".own-emojis").textContent(), "😊😎😴");

	await page.getByRole("button", { name: "Mom", exact: true }).click();
	await page.getByLabel("Streak (days)").fill("11");
	await page.getByRole("button", { name: "Save", exact: true }).click();
	await expect(page.locator("#modal")).toBeVisible();
	assert.equal(
		await page.getByLabel("Streak (days)").evaluate((el) => el.validity.valid),
		false,
	);
	await page.getByLabel("Streak (days)").fill("10");
	await page.locator(".contact-emojis summary").click();
	await page.getByRole("button", { name: "🐶", exact: true }).click();
	await page.getByRole("button", { name: "😊", exact: true }).click();
	await page.getByRole("button", { name: "❤️", exact: true }).click();
	await page.getByRole("button", { name: "☕", exact: true }).click();
	await page.getByRole("button", { name: "😎", exact: true }).click();
	await expect(page.locator('[aria-pressed="true"]')).toHaveCount(3);
	await page.getByRole("button", { name: "Save", exact: true }).click();
	await page.reload();
	state = await page.evaluate(() =>
		JSON.parse(localStorage.getItem("inko-creator-demo-v1")),
	);
	assert.deepEqual(state.people[0].emoji, ["🐶", "❤️", "☕"]);
	assert.equal(state.people[0].streak, 10);
	await page.getByRole("button", { name: "Mom", exact: true }).click();
	await page
		.getByRole("button", { name: "Clear check-in", exact: true })
		.click();
	assert.equal(await page.locator(".celebration").count(), 0);
	await page.getByRole("button", { name: "Mom", exact: true }).click();
	await page.getByRole("button", { name: "Check in", exact: true }).click();
	await page.locator(".celebration").waitFor();
	await page.getByRole("button", { name: "Settings", exact: true }).click();
	await expect(page.locator(".page > button")).toHaveCount(1);
	await page.locator('[data-action="language"]').click();
	await page.getByRole("button", { name: "Svenska", exact: true }).click();
	assert.equal(await page.locator("html").getAttribute("lang"), "sv");
	await page.reload();
	assert.equal(await page.locator("html").getAttribute("lang"), "sv");
	await page.locator('[data-action="language"]').click();
	await page.getByRole("button", { name: "English", exact: true }).click();
	await page.locator('[data-action="home"]').click();
	await page.locator(".heart").waitFor();
	await page.screenshot({ path: "/tmp/inko-demo-home.png" });
	await page.locator('.header [data-action="people"]').click();
	await page.locator(".tools summary").click();
	await page
		.getByRole("button", { name: "Reset check-ins", exact: true })
		.click();
	state = await page.evaluate(() =>
		JSON.parse(localStorage.getItem("inko-creator-demo-v1")),
	);
	assert.equal(state.own.length, 0);
	assert(state.people.every((p) => p.emoji.length === 0));
	await page.locator(".tools summary").click();
	await page
		.getByRole("button", { name: "Check everyone in", exact: true })
		.click();
	state = await page.evaluate(() =>
		JSON.parse(localStorage.getItem("inko-creator-demo-v1")),
	);
	assert.deepEqual(state.people[0].emoji, ["🐶", "❤️", "☕"]);
	assert.equal(state.people[0].streak, 10);
	await page.getByRole("button", { name: "Start recording mode" }).click();
	await page.evaluate(() => navigator.serviceWorker.ready);
	await page.reload();
	await context.setOffline(true);
	await page.reload();
	await expect(page.locator(".person")).toHaveCount(4);
	await page.locator(".heart").click();
	await page.getByRole("button", { name: "🐶", exact: true }).click();
	await page.getByRole("button", { name: "Done", exact: true }).click();
	await page.locator(".celebration").waitFor();
	await context.setOffline(false);
	for (const [width, height] of [
		[320, 568],
		[390, 844],
		[430, 932],
		[768, 1024],
	]) {
		await page.setViewportSize({ width, height });
		await page.locator(".heart").click();
		assert(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth,
			),
		);
		await page
			.getByRole("button", { name: "Done", exact: true })
			.scrollIntoViewIfNeeded();
		await page.getByRole("button", { name: "Close", exact: true }).click();
	}
	const manifest = await (
		await page.request.get("http://localhost:8080/demo/manifest.webmanifest")
	).json();
	assert.equal(manifest.scope, "/demo/");
	assert.equal(manifest.display, "standalone");
	assert.deepEqual(errors, []);
	console.log(
		"PASS: creation, safe names, chosen contact emojis and streaks, premium selection, check-ins, language persistence, reset, offline reload, mobile widths, manifest, no browser errors.",
	);
	await browser.close();
})().catch((error) => {
	console.error(error);
	process.exit(1);
});
