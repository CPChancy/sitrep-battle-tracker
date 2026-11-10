# SITREP

Victory-point tracker for Bolt Action and Konflikt '47.

## Files
- `index.html` – the app itself
- `styles.css` – all of the app's styling
- `js/` – the app's scripts, loaded in this order:
  - `utils.js` – small shared helpers
  - `scenarios.js` – the missions: how each is scored, its counters, and its rules summary
  - `deployment.js` – deployment zones and types, their rules, and the "Roll for me" dice
  - `briefing.js` – the summaries and fold-out briefings for missions and deployment
  - `storage.js` – saving and loading games on the device
  - `calculator.js` – the score calculator screen
  - `saved-games.js` – the saved games list (open and delete)
  - `setup.js` – the new game setup questions
  - `navigation.js` – switching between screens
  - `app.js` – starts the app and turns on offline support
- `manifest.webmanifest` – lets phones install it to the home screen
- `sw.js` – offline cache (service worker)
- `icons/` – app icons

## Try it on your PC
Double-click `index.html`. Everything works except offline install, which needs the app to be hosted over https.

## Put it on your phone (free, via GitHub Pages)
1. Create a free account at github.com and make a new **public** repository, e.g. `score-tracker`.
2. Choose **Add file → Upload files** and drag in everything from this folder, including the `icons` and `js` folders. Commit.
3. Go to **Settings → Pages**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute or two the app is live at `https://<your-username>.github.io/score-tracker/`.
5. Open that link on your phone:
   - **iPhone (Safari):** Share → Add to Home Screen
   - **Android (Chrome):** menu → Install app / Add to Home screen
6. Open it once while online. After that it works with no signal.

## Updating
Upload the changed files to the repository, then change `VERSION` in `sw.js` (e.g. `fsc-v2`) so phones fetch the new version. It updates the next time the app is opened online.

## Notes
- Scoring values are editable in the app ("Edit this game's scoring") and apply to that game only.
- Mission rules and scoring follow the Bolt Action rulebook (pp.162–180) and the Konflikt '47 rulebook (pp.144–160), summarised in `js/scenarios.js` and `js/deployment.js`. Each mission and deployment option is tagged with its system, so setup only offers the chosen system's options. Page numbers marked `*` were inferred, not printed in the source photos; check them against the book. Story missions are in the data but hidden until their scoring is added.
- New games default to 1,250 pts for Bolt Action and 1,500 pts for Konflikt '47 (set in `DEFAULT_POINTS` in `js/scenarios.js`).
- Game data is stored on the device only.
- `index.html` has a security policy (the `Content-Security-Policy` line) that only lets the page load its own files plus Google Fonts. If you add anything from another website later, such as analytics or a different font provider, add its address to that line or the browser will block it.
- Some browsers apply that policy strictly when `index.html` is opened by double-clicking. If the app looks unstyled or does nothing when opened that way, run it from a local web server or use the hosted GitHub Pages version.
