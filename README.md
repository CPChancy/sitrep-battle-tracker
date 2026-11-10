# SITREP

A simple score tracker for **Bolt Action** and **Konflikt '47**. Keep track of victory points during your game without pen, paper or mental arithmetic.

**Open the app:** https://cpchancy.github.io/sitrep-battle-tracker/

## What it does

* Tracks victory points for both players as the game goes on
* Includes every matched mission from the Bolt Action and Konflikt '47 rulebooks, scored the way the book says, so you just pick one and play
* Shows a short summary of each mission's rules, with the full details tucked away until you need them
* Can roll the mission, deployment zones and deployment type for you, or you can choose them yourself
* Lets you change the scoring for a single game if you're using house rules
* Saves your games so you can come back to them later, and lets you change a game's setup if you got something wrong
* Copies the result, ready to paste into your club's Discord
* Works without signal once it's installed, so a dodgy club Wi-Fi won't stop you

Your games are saved on your own phone or computer only. Nothing is sent anywhere.

Story missions are on the way in a future update.

## Playing a game

1. Tap **Create new**, then **Create new game**.
2. Choose your system, enter both armies, and check the game size. It starts at 1,250 points for Bolt Action and 1,500 for Konflikt '47.
3. Pick a mission, or tap **Roll for me** to roll the mission and deployment.
4. Tap **Start game**, then use the **+** and **−** buttons as the game goes on.
5. When you're done, tap **Copy for Discord** to share the result.

To carry on with a game later, tap **Select existing game** on the main menu.

## Installing it

You don't need an app store. You add it straight from the web page.

### iPhone or iPad

1. Open the app link in **Safari**.
2. Tap the **Share** button (the square with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**, then **Add**.

### Android

1. Open the app link in **Chrome**.
2. Tap the **⋮** menu in the top-right corner.
3. Tap **Install app** (or **Add to Home screen**), then confirm.

### Windows or Mac computer

1. Open the app link in **Chrome** or **Edge**.
2. Click the install icon at the right of the address bar (or open the browser menu and choose **Install SITREP**).

### Before your first game

Open the app once while you're connected to the internet. After that it works anywhere, with or without signal.

## Getting updates

Updates arrive automatically. Next time you open the app while connected to the internet, it will pick up the latest version. If you don't see a change straight away, close the app fully and open it again.

## Uninstalling it

**Removing the app also deletes your saved games**, so finish or note down anything you want to keep first.

### iPhone or iPad

1. Press and hold the SITREP icon on your home screen.
2. Tap **Remove App**, then **Delete from Home Screen**.

### Android

1. Press and hold the SITREP icon.
2. Tap **Uninstall** (or drag it to **Uninstall** at the top of the screen) and confirm.

To make sure every saved game is gone, open Chrome, go to **Settings → Site settings → All sites**, find the SITREP site and tap **Clear \& reset**.

### Windows or Mac computer

1. Open SITREP.
2. Click the **⋯** menu at the top of its window.
3. Choose **Uninstall SITREP** and confirm. Tick the option to clear data if you want your saved games removed as well.

## About the rules

The mission rules are short summaries in my own words, taken from the Bolt Action rulebook (pages 162–180) and the Konflikt '47 rulebook (pages 144–160). Each one shows the page it comes from so you can check the book. A page number with a **\*** is a best guess, so double-check that one in your copy.

## Help

If something isn't working, try closing the app and opening it again while you're online. If that doesn't fix it, please contact the developer.

## For developers

The app is plain HTML, CSS and JavaScript, with no build step.

* `index.html` is the page, `styles.css` holds all the styling, and the scripts are in `js/`:
  * `utils.js`: small shared helpers
  * `scenarios.js`: the missions for both systems, how each is scored, and their rules summaries
  * `deployment.js`: deployment zones and types, reserves rules, and the "Roll for me" dice
  * `briefing.js`: the rules summaries and fold-out briefings
  * `storage.js`: saving and loading games on the device
  * `calculator.js`: the playing screen
  * `saved-games.js`: the saved games list
  * `setup.js`: the new game and Edit game setup screen
  * `navigation.js`: switching between screens
  * `app.js`: starts the app and turns on offline support
* `manifest.webmanifest` lets devices install the app, and `sw.js` keeps it working offline.
* **When you change any file**, bump `VERSION` in `sw.js` (for example `fsc-v13` to `fsc-v14`) so installed copies pick up the update.
* Each mission and deployment option is tagged with its system, so setup only offers the chosen system's options. Story missions are in the data but hidden until their scoring is added. Default game sizes are set in `DEFAULT_POINTS` in `scenarios.js`.
* `index.html` has a security policy (the `Content-Security-Policy` line) that only lets the page load its own files and Google Fonts. If you add anything from another website, add its address to that line or the browser will block it.
* To try it on your computer, run it from a local web server. Opening `index.html` directly works in most browsers, but offline support needs the app to be served over https.
