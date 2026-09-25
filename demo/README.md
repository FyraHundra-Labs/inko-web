# Inko creator demo

Static PWA at `https://inko.today/demo/` (the static host redirects `/demo` to `/demo/`). Deploy alongside the existing site; no build step or backend is required.

Serve the repo locally with `python3 -m http.server 8080`, then visit `http://localhost:8080/demo/`. Service workers require HTTPS or localhost. Use HTTPS on a real phone.

## Creator flow

1. Open `/demo/` in Safari on iPhone or Chrome on Android and add it to the Home Screen using the initial instructions.
2. Launch the Inko icon. Open the people icon and add fictional people by name. Each starts checked in with a random premium emoji and a streak from 1–10.
3. Tap **Start recording mode** to return to the clean circle screen, then use the phone's screen recorder.
4. Tap the heart to pick up to three emojis from the native app's full premium set. There is no circle-size limit.
5. Tap a person to rename, check in again, clear their check-in, or remove them. The people screen also has expandable creator tools for clearing all check-ins or checking everyone in. Resetting preserves names and streaks for repeat takes.
6. Settings contains only the language picker (English, Swedish, Spanish, Portuguese).

All state is local to the browser/PWA; there are no real accounts, contact imports, messages, purchases, or API calls. Browser and installed-app storage may differ, so prepare the final circle inside the installed app. A streak of 1 is stored but its badge is hidden, matching the native app's display rule. The demo does not roll dates or streaks forward automatically, keeping takes repeatable.

## Keeping the visual reference current

The font, icons, premium emoji set, translation strings, and SVG heart/divider geometry are copied from `../inko`. To refresh them after native changes (with dependencies installed there):

```sh
node scripts/sync-demo.cjs ../inko
```

`app.css` follows the native `HomeScreen`, `ConnectionCard`, `CheckInHeart`, `EmojiPicker`, and language settings styles. The creator management screen is demo-specific. Web keyboard, emoji glyphs, and OS status areas still depend on the device; check a recording on actual iPhone and Android hardware before distributing to creators.

The service worker is scoped to `/demo/` only. Bump `CACHE` in `sw.js` whenever demo assets change. Updates install in the background and activate once all older demo windows close; this avoids replacing assets mid-recording. The whole demo is precached for subsequent offline use.

## Browser checks

With the local server running and the native repo's Playwright dependencies installed:

```sh
node scripts/test-demo.cjs
```

Checks cover fictional people, safe rendering of names, random streak bounds, the premium selection limit, check-in/reset flows, language persistence, offline reload, and narrow viewports in Chromium mobile emulation. Home Screen installation and real iOS keyboard/status bar behavior still need a physical-device check.
