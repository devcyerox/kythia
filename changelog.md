# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.11.0-beta](https://github.com/kythia/kythia/compare/v0.10.1-beta...v0.11.0-beta) (2025-12-17)

### ⚠️ BREAKING CHANGES

* Dashboard is now seperated from the bot.

### 🔨 Fixed

* improve tempvoice channel fetching error handling with logging and ephemeral user feedback. ([56873ec](https://github.com/kythia/kythia/commit/56873ecf5c63f08bb98709c2fbb1770960786a3f))
* **invite:** prevent invite count reset on existing records ([84942cf](https://github.com/kythia/kythia/commit/84942cfdac8712498ff001731fedbb9d68724fc0))


### 🔧 Changed

* **adventure:** code standardization step 1 ([2451b0c](https://github.com/kythia/kythia/commit/2451b0c292968f395bde15ee722e6cd66899a57b))
* **adventure:** code standardization step 2, final ([7995d43](https://github.com/kythia/kythia/commit/7995d433f87f72914f9f60ef0132d9008dcb7ab0))
* fixing guarded in all models ([c40df69](https://github.com/kythia/kythia/commit/c40df69741f3e320067ba2e87e76402f760c77e2))
* improve BigInt handling in economy commands and update Discord message flags for components. ([04000ec](https://github.com/kythia/kythia/commit/04000ec3e84e93edceeba76b02705325a0952e79))
* Introduce `toBigIntSafe` helper and apply it across economy commands for robust BigInt handling. ([870bb99](https://github.com/kythia/kythia/commit/870bb9909b57e58cc419a05a773ac3695d3e0bed))
* Remove verbose descriptions and messages from English language files. ([7cebaa7](https://github.com/kythia/kythia/commit/7cebaa71c65c24856630eae95592714015697f6e))
* Replace dashboard web application with a new API addon. ([30a4166](https://github.com/kythia/kythia/commit/30a4166c5d2902c2861dd7df3bafed245da44623))
* Update Discord permission flags, enhance server setting retrieval with creation, and streamline command configurations. ([a9f9cbf](https://github.com/kythia/kythia/commit/a9f9cbf15de85362d3567d67bdcec645474f0c28))


### ✨ Added

* Add `ManageGuild` permission requirement to the ticket command. ([855fff7](https://github.com/kythia/kythia/commit/855fff77a5f18b33b493f058b0e3dc3ff3f56ded))
* Add localization for multiple addons and update core settings, economy, and adventure features. ([50c818d](https://github.com/kythia/kythia/commit/50c818ddb2bb1009c4e93d23119ff20578de2544))
* Add localization for multiple addons and update core settings, economy, and adventure features. ([b4ccfec](https://github.com/kythia/kythia/commit/b4ccfec356a425c73726d3c765adbf25bf7b5f8b))
* Add nickprefix command, update database schemas, and refine various bot commands, events, and dashboard assets. ([2b11d8a](https://github.com/kythia/kythia/commit/2b11d8a29eeea7fd0db9ebc9bbfc2670cd0dae4b))
* Add TempVoice sync command to clean up channels and provide a UI for fixing missing configuration. ([14c39f1](https://github.com/kythia/kythia/commit/14c39f141136263625f6ed1febd1bc31bea32b73))
* Centralize access to `kythiaConfig`, `t`, `embedFooter`, and `logger` via `client.container` across server commands and core events. ([edb059a](https://github.com/kythia/kythia/commit/edb059a96b999a3bacc55d9b815ca2e9ecabdc0b))
* destructure `helpers` and `getChannelSafe` from the container ([71ae4fa](https://github.com/kythia/kythia/commit/71ae4fabccd0c45de4927d468cf4db7a6c0e9117))
* Implement AI bot reply for empty mentions and remove unused donate localization strings. ([203090b](https://github.com/kythia/kythia/commit/203090b07d74349759e07e50bbfd37a945873bb1))
* Implement server-specific bot branding and custom prefixes, adding a new API route for guild branding and extending server settings. ([b13f3e6](https://github.com/kythia/kythia/commit/b13f3e6b709b8a7eaabd3fe0999b169475b54355))
* introduce configurable emojis for TempVoice and Music, refactor guild API routes, and enhance server settings creation with nullable guild names. ([8eea2b9](https://github.com/kythia/kythia/commit/8eea2b9dc70c0ef4f6be1dc8847226817281abff))
* **music api:** Implement WebSocket-based music player state broadcasting and introduce a comprehensive leveling system with detailed configuration options. ([4e5e4d8](https://github.com/kythia/kythia/commit/4e5e4d83319268b7beb7ad4ebd9f5cdc46b490b9))
* update kythia-core, add sqlite3, and refine example configurations for environment variables and addons. ([d820128](https://github.com/kythia/kythia/commit/d820128134ba2897a4443f12f7d1eb6d1cfc23d7))
* Update various commands, helpers, and language strings across all addons for improved functionality and consistency. ([802b25e](https://github.com/kythia/kythia/commit/802b25e19ae41c737a7dc7a1f58de8f9d1297a79))

### [0.10.1-beta](https://github.com/kythia/kythia/compare/v0.9.12-beta...v0.10.1-beta) (2025-12-03)


### ⚠️ BREAKING CHANGES

* Database schema is now managed strictly via migrations.

### 🔨 Fixed

* update pre-commit script to use npx and adjust lint-staged configuration for TypeScript ([df1be69](https://github.com/kythia/kythia/commit/df1be693ebd1719fc42eee8e0fb549b5f0686b51))


### ✨ Added

* Add debug command, remove role prefix feature, update core dependency, and delete unused banner assets. ([7c181a1](https://github.com/kythia/kythia/commit/7c181a12292a4180947ad5a340964e7e9cec167d))
* Add EJS templating engine dependency. ([6880740](https://github.com/kythia/kythia/commit/68807408d8952f22c348d37f78b23fc6c854d1cb))
* Add safe channel fetching helpers and enhance invite tracking on member leave. ([b6fa1fe](https://github.com/kythia/kythia/commit/b6fa1fed7e67512fd94570db1eed548c7c3e79d2))
* **giveaway:** enhance giveaway functionality with new options and UI improvements ([7014020](https://github.com/kythia/kythia/commit/7014020f7a840422f08ec8eba6a796a441f954d7))
* **globalchat:** implement cleanup of old webhooks before creating new ones in handleFailedGlobalChat function ([143a291](https://github.com/kythia/kythia/commit/143a2913294f73789d0e51ae1896cac9a9353b48))
* **guildCreate:** enhance guild creation event with new v2 components ([0219111](https://github.com/kythia/kythia/commit/021911147143788a1a7b9662ad1debef63ab706d))
* implement comprehensive invite management system with new add, remove, reset, user, and leaderboard commands, replacing the previous invite command. ([6e2ea14](https://github.com/kythia/kythia/commit/6e2ea14070535ed1871ffc68fc3c924feeac6ffc))
* **leaveguild:** Add owner-only `leaveguild` command ([86c75ec](https://github.com/kythia/kythia/commit/86c75ec4716ca86887fc7820065d8a7c077675bf))
* **music:** add radio command to search and play live radio stations; enhance user interaction with autocomplete and selection options ([eb87146](https://github.com/kythia/kythia/commit/eb87146b8bb98f96d29ec5f7ae327148841f9dee))
* **redis:** enhance flush command to use shared Redis connection; improve error handling and user feedback ([cf8cb16](https://github.com/kythia/kythia/commit/cf8cb1648524876d29378ecf966a36de580fbc50))
* **ticket:** add getSafeEmoji function to ensure valid emoji usage in ticket actions; improve user experience with fallback options ([f3c42c9](https://github.com/kythia/kythia/commit/f3c42c9f9fa764db8a0cef6a6bae9ec0162487f5))
* **ticket:** add reason prompts for ticket creation and closure; enhance user interaction with modals and error messages ([974ebe2](https://github.com/kythia/kythia/commit/974ebe2793922e6d4640e614d503bd7a2538cfad))
* **ticket:** add type and panel delete, and panel reload command ([0d9caaf](https://github.com/kythia/kythia/commit/0d9caaff8e69cfbf81e11a17b140bdce78369c73))
* **ticket:** implement ticket closure confirmation and reason prompts; enhance user interaction with new buttons and modals ([0da83a3](https://github.com/kythia/kythia/commit/0da83a3c96dfc4347260a9e5707089f2d815b7d2))
* **ticket:** initial adding ticket addon ([7af3938](https://github.com/kythia/kythia/commit/7af3938235ba9a366760f49a829ec08d9b47f9de))
* upgrade architecture to v0.10.0-beta (Migration-First System) ([b999b8f](https://github.com/kythia/kythia/commit/b999b8f9c76941552bf0de6cc39b8040d7d827b0))


### 🔧 Changed

* destructure Discord helpers from bot instance. ([ad4e9d1](https://github.com/kythia/kythia/commit/ad4e9d1d2a090b8289ded18230921453f1663e78))
* **giveaway:** on progress ([2778201](https://github.com/kythia/kythia/commit/2778201c01fe57faed59d2b5c83588a667047ff5))
* **giveaway:** streamline giveaway command structure and remove deprecated manager ([9d488c9](https://github.com/kythia/kythia/commit/9d488c9f40ec308d4b6c614b38cc4af12d591c4f))
* **music:** migrate to DI classes, fix history state, and add hybrid radio ([15e6a13](https://github.com/kythia/kythia/commit/15e6a137e7a5a2b0cd64572ecc9802a01f81602b))
* **music:** replace musicManager helper with MusicManager class; update command handlers to utilize new structure and improve maintainability ([90125df](https://github.com/kythia/kythia/commit/90125df392d32293274e424febe0c5067475753e))
* Replace custom `getCache` and `getAllCache` methods with standard `findOne` and `findAll` for data retrieval. ([c0beae1](https://github.com/kythia/kythia/commit/c0beae1f2e15ad6cafd87201d32bb45b3b517295))
* temporary fix visitor ([dca6f95](https://github.com/kythia/kythia/commit/dca6f95283f3f348093f0cad05c226f3f45709d1))
* **ticket:** update ticket system components and structure; enhance error handling and user feedback ([d51a281](https://github.com/kythia/kythia/commit/d51a28156194a1717afccbff3f0d11b8b0f16b3f))

### [0.9.12-beta](https://github.com/kythia/kythia/compare/v0.9.11-beta...v0.9.12-beta) (2025-11-13)


### 🔧 Changed

* **afk command:** rename AFK model to UserAFK for clarity and consistency; update related cache and creation logic ([8634f68](https://github.com/kythia/kythia/commit/8634f68c03d2d1488520cf6838b2d9ab70c4b651))
* **ai:** enhance message handling in AI events to consolidate user message history; improve string handling consistency and update stats command to reflect server boosts (not tested yet) ([a2d8a5c](https://github.com/kythia/kythia/commit/a2d8a5c24e0117533d4947747ab92b8d15dcd9e9))
* **commands:** remove commented-out code and streamline command logic across multiple files; update language keys for consistency ([5b6695a](https://github.com/kythia/kythia/commit/5b6695a598dc420b1252d8bf5ed3a6169dc740d6))
* **commands:** update command aliases and improve parameter names for clarity; remove unused donate command ([7fff5b4](https://github.com/kythia/kythia/commit/7fff5b419d1e5115d151311f9aa92de2a74741ff))
* **core events:** streamline role and guild member update handling by consolidating settings retrieval and adding role prefix functionality ([9ac5dcc](https://github.com/kythia/kythia/commit/9ac5dccac5d2cbaf40d6cc177ed2b9324e23f143))
* **dependencies:** replace @kenndeclouv/kythia-core with kythia-core; update package-lock.json and package.json accordingly, make core addon events all using DI ([4a67e8e](https://github.com/kythia/kythia/commit/4a67e8e5e0014c7dd0920c5fce82fa2339d8cc48))
* **dependencies:** update all references from @kenndeclouv/kythia-core to kythia-core across the codebase ([441572c](https://github.com/kythia/kythia/commit/441572cf729de6db85e0f53b1b73dc44ebcedf8c))
* **economy:** enhance command structure by implementing dependency injection for models and helpers; update color handling for embeds ([25abe33](https://github.com/kythia/kythia/commit/25abe33379c2d0b8f881c8a9e93919d388f1b2df))
* **index:** add formatDuration to time container dependencies ([b9d6501](https://github.com/kythia/kythia/commit/b9d6501ec7fc47d79971147dd83d84d582fb2329))
* **index:** update Redis dependency injection to use configuration options instead of client instance ([020205f](https://github.com/kythia/kythia/commit/020205f8f40399ad7efe82ae854c5fb9900fb93b))
* **moderation:** moderation commands to use new command structure, /mod kick /mod ban etc, and improve error handling ([2f32b61](https://github.com/kythia/kythia/commit/2f32b612c5483e20a4719a5bcc21fd686af4e62d))
* **music:** clean up imports and streamline command structure; enhance autocomplete and execution handling with container integration ([71250d8](https://github.com/kythia/kythia/commit/71250d8c507a43de932671a00fc4d1477028310e))
* **musicManager:** streamline error handling for Lavalink node connections and update voice channel status management ([578d648](https://github.com/kythia/kythia/commit/578d648600b219d89729de4377a8e4255fa5a482))
* **ping command:** enhance buildPingEmbed function to accept initial latencies and improve loading state handling; update language file for loading message ([770544e](https://github.com/kythia/kythia/commit/770544e6a57909bab97ef8dcb7607cfea31e7413))
* **premium:** refactor premium command to use seperate file for each subcommand ([73d76d3](https://github.com/kythia/kythia/commit/73d76d3c4b29d16df6901ab325c4e3dc229aa44b))
* **settings:** implement dependency injection for settings command; ([15388b6](https://github.com/kythia/kythia/commit/15388b6682c6705f6fe3d459c71288b48412cb93))
* **slots:** update result key format for slot machine outcomes to use dot notation for consistency ([5f45b9e](https://github.com/kythia/kythia/commit/5f45b9e55b5dc24321f1c578fe1b5a1ee47c795f))
* **tools:** implement dependency injection for command execution ([f5e464f](https://github.com/kythia/kythia/commit/f5e464fb6aff5ed2fcdd965b0403a27cec4b7c3f))
* **utils:** implement dependency injection and remove spam feature ([7f494b7](https://github.com/kythia/kythia/commit/7f494b71f41d633a70fab532a12f668d706e88b9))


### 🔨 Fixed

* **clientReady event:** fixing typo ([acda42c](https://github.com/kythia/kythia/commit/acda42ccc4305685030fc1ecf0e0b137de278904))
* **config example:** update environment variable from REDIS_URL to REDIS_URLS for consistency in kythia config ([f2b3383](https://github.com/kythia/kythia/commit/f2b3383ead8041bca2cc921b76222074b0065149))
* **musicManager:** simplify now playing check by removing redundant player state condition ([6d2fea6](https://github.com/kythia/kythia/commit/6d2fea613b7224a26722441f7f62d1af4f2d95e3))
* **music:** update seek command to accept string input for time; enhance track title handling and user display in Now Playing and ended messages ([105550e](https://github.com/kythia/kythia/commit/105550ebe6f0b2e90dea5a77a0144f7733e0cbf3))
* **ping command:** ensure deferUpdate is called after collecting interaction to maintain proper loading state ([65db269](https://github.com/kythia/kythia/commit/65db2691651048e3eb646ae788822e1be360ea36))


### ✨ Added

* **about, help:** add new banner images to about and help commands; update configuration to support additional images ([ae6ccb4](https://github.com/kythia/kythia/commit/ae6ccb46dce4a014f4235a4e01192bdc30aea1d4))
* **act:** implement new action command with diverse user interactions and self-referential actions; enhance language support for various actions ([ef633df](https://github.com/kythia/kythia/commit/ef633df5698d188d3e46fbda817da28ac623784b))
* add new script for Bun support in package.json; enhance message handling in AI events for better text extraction and error handling; update stats command to include Kythia Core version ([1f6d721](https://github.com/kythia/kythia/commit/1f6d721c7df0fb019e218b28a609e8db8b638242))
* add Top.gg auto-poster integration and command alias support; update package dependencies ([8ea29bd](https://github.com/kythia/kythia/commit/8ea29bd7b2498fd373fb684c57eecbf2fff2f175))
* **assets:** update Kythia banner images for dashboard; replace existing logo files with new versions ([2271b38](https://github.com/kythia/kythia/commit/2271b38f8500ba39be2983028aff2da05d7c0d86))
* **config:** update Kythia configuration with new Discord support links; enhance music addon documentation and update banner image references ([22b1fa5](https://github.com/kythia/kythia/commit/22b1fa53515663095e165eb93b63604c96fc87c5))
* **dashboard:** update example.env with detailed DASHBOARD_URL instructions for Discord OAuth2; enhance logging in server.js for clarity; fixing music 24/7 feature ([c95a4f4](https://github.com/kythia/kythia/commit/c95a4f487073fd399940fed66b8137ac74d0b28b))
* **discord:** add premium and voting status checks to Discord helper functions; update KythiaUser model to track voting information; enhance account creation flow for voters in API ([0d9c049](https://github.com/kythia/kythia/commit/0d9c049a6136ab69dc4c65414bc879e6c05cdde3))
* **docs:** adding new command and edit the docs for help and websites ([5a5e12f](https://github.com/kythia/kythia/commit/5a5e12f7a891a3fab3dc9211f26d0b4db7bb717c))
* **globalchat:** add API key support for global chat; refactor webhook health check and command handling to utilize new configuration; enhance error handling and database synchronization for webhook management ([36c4b5d](https://github.com/kythia/kythia/commit/36c4b5d877dbaca5eb9851b0e50d802cb5082328))
* **help:** enhance help command UI by adding banner image support and refining button visibility logic ([91d10e9](https://github.com/kythia/kythia/commit/91d10e94c1bb20d48c36cc6cc125e2f871939954))
* **image:** adding tempvoice banner image ([0c83b76](https://github.com/kythia/kythia/commit/0c83b76f95d1c7030b6a7463acf6b9b8ed8f1b2f))
* **lang:** adding auto translation by google api, add id and mandarin ([84bea79](https://github.com/kythia/kythia/commit/84bea79ec50cefb3679148c13bb4752f30ebb0a9))
* **music:** add 24/7 mode functionality to keep the bot active in voice channel; update language file for related messages ([346dbff](https://github.com/kythia/kythia/commit/346dbff3bfe0c102d459dc6df79fdc083f512dc6))
* **music:** enhance seek command to support multiple time formats and improve idle disconnect messaging ([af1e5f5](https://github.com/kythia/kythia/commit/af1e5f59233607bb65641f57cec30958116d4b03))
* **music:** implement 24/7 session restoration and enhance interaction handling for persistent music playback ([9c5f516](https://github.com/kythia/kythia/commit/9c5f51607eae3439b5cf8c35d77b8bbd209112d7))
* **music:** implement error suppression for Lavalink node connection issues; enhance logging to warn for connection problems while allowing normal error handling for other cases ([d94212b](https://github.com/kythia/kythia/commit/d94212b07e0e9fd434373898ca8ed0fc1fa524fa))
* **musicManager:** enhance music control UI with new button rows and update now playing functionality for better user interaction ([ee63756](https://github.com/kythia/kythia/commit/ee63756efeea150c9eb532555c2c891ca276b409))
* **quest:** implement quest fetching from multiple API URLs with timeout handling; update quest configuration structure ([67cb668](https://github.com/kythia/kythia/commit/67cb668cb82d7902ba6b0288ae971081009cc0eb))
* **questnotifier:** add quest notifier setup and trigger messages to language file; enhance user notifications ([8f2a2ff](https://github.com/kythia/kythia/commit/8f2a2ffa3a9ba6f16bbc38d35ac2ebb5b10aea01))
* **tempvoice:** adding foundation of tempvoice feature,  intervace in progress ([231885c](https://github.com/kythia/kythia/commit/231885c66e9ccd4e71f867c0badd4f5beb77cfa6))
* **tempvoice:** adding new tempvoice features, await (waiting room and chat ) ([7ef8929](https://github.com/kythia/kythia/commit/7ef8929314613586c621b17f31faf279fd170c17))
* **tempvoice:** enhance DNS management commands with improved error handling, user feedback, and language support; refactor to use new component structures for replies ([4187f4c](https://github.com/kythia/kythia/commit/4187f4c289aa81358dead381c97c2d175b250d8b))
* **tempvoice:** update tempvoice configuration and add new waiting room features; replace banner images and enhance language support ([d48994a](https://github.com/kythia/kythia/commit/d48994a5a5265f4d86d265c3c439a89bb9f126a6))
* **tiktok command:** adding new core tools command, to allow tiktok url convert to video that can watch in discord ([b5e048f](https://github.com/kythia/kythia/commit/b5e048f5da75a14956b9bb4c08284e80a6c70816))

### [0.9.11-beta](https://github.com/kythia/kythia/compare/v0.9.10-beta...v0.9.11-beta) (2025-10-28)


### ⚠️ BREAKING CHANGES

* **core:** The core functionalities located in the 'src/' directory have been moved to a separate NPM package 'kythia-core'. The main bot project now depends on this package.

This refactor includes several key changes:
- Moved core classes (Kythia, KythiaClient, managers, utils, database helpers) to the new package.
- Established the core package as CommonJS (CJS) to maintain compatibility with existing CJS addons.
- Implemented Dependency Injection (DI) via the container for accessing models, core helpers (logger, translator, etc.), and config within addon commands, resolving critical circular dependency issues during addon loading. Addon commands must now retrieve these dependencies from `interaction.client.container` inside the `execute` function instead of using top-level `require`.
- Configured `discord.js` as a `peerDependency` in the core package to resolve `instanceof` errors caused by multiple `discord.js` instances when using `npm link` or similar setups. The main bot project is now responsible for providing `discord.js`.
- Updated main bot entry point (`index.js`) to import core components from the new package and inject necessary dependencies (like `appRoot` and `discord.js` during the inject-phase, though `discord.js` injection was later removed due to `peerDependencies`).
- Adjusted internal path resolutions within the core package (e.g., for loading addons and models) to correctly use the injected `appRoot`.

### 🔧 Changed

* **adventure:** to use dependency injection, rename charManager to characters for more readablity, ADVENTURE ADDON READY v.1.0.0 ([e6ce9e6](https://github.com/kythia/kythia/commit/e6ce9e66222410e128433223756cbd3e8d90205b))
* **ai:** translation and server settings using DI ([b1a7ce2](https://github.com/kythia/kythia/commit/b1a7ce2627f8f01249db349e653d89f254db1a9a))
* **ai:** update AI addon to use dependency injection for configuration and logging, enhance command handling, and improve overall structure, ADVENTURE ADDON READY v1.0.0 ([b10551a](https://github.com/kythia/kythia/commit/b10551a1ee841de521c25e08be8a027418468046))
* **core:** Enhance Kythia initialization and dependency management ([b838bbf](https://github.com/kythia/kythia/commit/b838bbfb251154427c6ed9f49e9d82f6f4a978fe))
* **core:** Extract core engine into kythia-core package ([0125a6b](https://github.com/kythia/kythia/commit/0125a6b6b6d3a1e46a4360407bbb7b0f0504d35b))
* remove unused files and move src/utils/time to addons/core/helpers ([ed04be7](https://github.com/kythia/kythia/commit/ed04be7a78cd292c5765eb72ff2a5e7cecc23f31))

### [0.9.10-beta](https://github.com/kythia/kythia/compare/v0.9.9-beta-rc.5...v0.9.10-beta) (2025-10-27)


### 🔨 Fixed

* a bunch of errors ([e5e6cae](https://github.com/kythia/kythia/commit/e5e6caea4cec3e963393cec4c9145b9f27bf21b5))
* correct permission check logic for message handling to ensure proper automod system invocation ([3c14208](https://github.com/kythia/kythia/commit/3c142084b6ebeea0e09fec3fb65bbad150eb0e1b))


### ✨ Added

* add anti-all caps, anti-emoji spam, and anti-zalgo features to automod settings; ([d8ffb89](https://github.com/kythia/kythia/commit/d8ffb89f5a92d9b8261165b17003e3a2a3948011))
* add audit log channel support for channel creation, deletion, member updates, and removals; refactor server settings to include auditLogChannelId ([629afe3](https://github.com/kythia/kythia/commit/629afe3d9bcd6c0d8e3fda881f7eeb4c2a7de73f))
* add discord-arts dependency and update package-lock.json; refactor settings routes to improve input handling and validation ([55d232d](https://github.com/kythia/kythia/commit/55d232d47d3a35d959425bbe31b39aa9555db7be))
* add global chat management messages to enhance user experience and provide feedback on server registration status ([ee55db8](https://github.com/kythia/kythia/commit/ee55db8e63445e77fe6dbecad7e42d8baddd8cec))
* add health check delay to global chat configuration and implement sleep function for webhook health checks ([adc69f2](https://github.com/kythia/kythia/commit/adc69f2ec8dddab46a8fc4e11b7da7458feba289))
* add health check schedule to global chat configuration and improve error logging in handleFailedGlobalChat ([bef021b](https://github.com/kythia/kythia/commit/bef021bbb9b4c5bf445e2ab5c4313b62c898de14))
* add support for audit log channel in settings; update command structure and UI to accommodate new channel options ([b180dc9](https://github.com/kythia/kythia/commit/b180dc9d6ac65d5da253e56c917fb3e571de2492))
* enhance command documentation for adventure, economy, fun, giveaway, setting, and utils commands with new subcommands and options ([5523107](https://github.com/kythia/kythia/commit/55231072b8dec790c60ca5de6c3e62bd2104daea))
* enhance global chat logging with improved error handling and user feedback; update canonical link in main layout and add voting messages in language file ([dca82a5](https://github.com/kythia/kythia/commit/dca82a5c65cf9b9f2aee823b4fba61b4bd56a0c8))
* handleFailedGlobalChat in globalchat addon to automaticly fix webhook ([9de8825](https://github.com/kythia/kythia/commit/9de882557e95585090eb4139686d31235568298f))
* Implement EventManager, InteractionManager, and ShutdownManager for enhanced event handling and graceful shutdown procedures ([721d989](https://github.com/kythia/kythia/commit/721d989961b8e74a4228cbc7a086491d5b810533))
* implement GlobalChat model and enhance global chat command handling; add database existence check and improve webhook health checks ([c6b964b](https://github.com/kythia/kythia/commit/c6b964b8e7114a73bdb1f513cf661afe6a31d8fb))
* update landing page with new Global Chat feature and enhance existing content layout ([5645cd0](https://github.com/kythia/kythia/commit/5645cd0c64e79e908995cf61f64185333b281353))


### 🔧 Changed

* big change key language structure to get nested. (not tested all yet) ([87e4199](https://github.com/kythia/kythia/commit/87e4199d291546a6bbdfd729be08f2ff04fcb762))
* **core:** Implement Dependency Injection architecture ✨ ([d24d5fc](https://github.com/kythia/kythia/commit/d24d5fc93126543f09147bd92b3a999da6a3072e))
* remove guildId from AFK data handling in commands and database model, make it global ([962f3f1](https://github.com/kythia/kythia/commit/962f3f18474d48371210c4301e37c83ce2833d59))
* remove unused utility files and clean up codebase by deleting obsolete modules ([d9710fa](https://github.com/kythia/kythia/commit/d9710fa6f02744c99006c09bb88af705f8965829))
* restructure Kythia initialization and dependency management; remove KythiaManager and enhance error handling ([877be6b](https://github.com/kythia/kythia/commit/877be6bedb7f07137188630eea38ea02bca88fb4))
* update UI components for improved server name display and branding ([1b3e263](https://github.com/kythia/kythia/commit/1b3e263d1fbcf389f8dddac266757f9716e5038d))

### [0.9.9-beta-rc.5](https://github.com/kythia/kythia/compare/v0.9.9-beta-rc.4...v0.9.9-beta-rc.5) (2025-10-20)


### 🔧 Changed

* make adventure commands globally ([1e791a7](https://github.com/kythia/kythia/commit/1e791a741bb172b6f1d110a581bcc7a242d7a7ad))
* rename User and Inventory models for consistency and update battle command logic to enhance item usage and user stats management ([5006259](https://github.com/kythia/kythia/commit/500625967bf17dfc124a78f3e48dd15d52bb568c))
* update marriage handling to use getAllCache for improved data retrieval and error handling ([9477bbd](https://github.com/kythia/kythia/commit/9477bbdd07e22f44cfb1c9f9bdeeb6b3069b179e))


### ✨ Added

* add message for no listeners in voice channel to music manager ([1ef6997](https://github.com/kythia/kythia/commit/1ef6997963514a454d6f1fa689cb4cff573f7e3f))
* add Redis ping functionality to the ping command and improve command alias handling ([7358709](https://github.com/kythia/kythia/commit/73587096c55b1163b5bb264306bdad6488b824fa))
* add short message threshold to automod settings and improve message handling efficiency ([c6f872e](https://github.com/kythia/kythia/commit/c6f872efecc04356ab84989ea788ad3c7dc75ea6))
* free image host like imgur, catbox etc ([0e0de5f](https://github.com/kythia/kythia/commit/0e0de5fcdaf5ac8574f88edec35ab87a886a7fcc))
* implement character selection and bonuses in adventure commands ([b919771](https://github.com/kythia/kythia/commit/b919771955c01d4996023682e287811490ce45e6))

### [0.9.9-beta-rc.4](https://github.com/kythia/kythia/compare/v0.9.9-beta-rc.3...v0.9.9-beta-rc.4) (2025-10-18)


### 🔧 Changed

* enhance caching and model interactions across various commands ([574636b](https://github.com/kythia/kythia/commit/574636b72dd0c40e4080e84051262b9a9f2232f7))
* improve caching and command structure across various modules ([fb3d7e5](https://github.com/kythia/kythia/commit/fb3d7e5513c2ef3d10d15baf310484b765300d84))
* improve Redis auto-reconnect logic and code consistency ([4f8f182](https://github.com/kythia/kythia/commit/4f8f1827511006fffdb658f94052612cae743520))
* streamline model definitions and enhance touch method ([a2c3465](https://github.com/kythia/kythia/commit/a2c346589d692f495a39aaac0b85dbd4784a69fc))
* streamline order processing and enhance model definitions ([244327c](https://github.com/kythia/kythia/commit/244327c625daf192e11ab86d1e3a049e091c49e6))
* update economy commands to use BigInt for currency calculations ([5545223](https://github.com/kythia/kythia/commit/5545223abe770e51450aec016f57dcdbd9629c0a))
* update version mark to all files to v0.9.9-beta-rc.3 ([6558870](https://github.com/kythia/kythia/commit/655887038ba36f2299b5588ba7c3a1f7048d3241))


### 🔨 Fixed

* add GuildMember partial to improve message handling and refine user filter logic ([59da428](https://github.com/kythia/kythia/commit/59da42847c220a51a39434441d851ddecaf5dcad))
* correct user filter function syntax in KythiaClient (again) ([a779792](https://github.com/kythia/kythia/commit/a779792cefbefaa657b13c625f341e8656f81117))
* enhance prefix matching in message handling to be case-insensitive ([db9c677](https://github.com/kythia/kythia/commit/db9c6774d302c54455240f860e697a5d69c3d501))
* refine user filter logic in KythiaClient to handle potential null values for guild and voice properties ([236fbbc](https://github.com/kythia/kythia/commit/236fbbc7950f7034a6724c5b42702a20e28b6e10))
* still trying to fix cache and database miss data cuz BigInt func ([e872164](https://github.com/kythia/kythia/commit/e8721640ae6e32dd622ef1da0fa341dff4eef99c))
* update embed color in economy commands and refine user filter logic in KythiaClient ([b591a29](https://github.com/kythia/kythia/commit/b591a297af2c15db06ebc3d58d64f35ca1e4f4f8))


### ✨ Added

* add booster log settings and commands ([f534903](https://github.com/kythia/kythia/commit/f53490378094def9947ce1136ab20ca94bf0a935))
* add owner bypass filter for AI response to allow privileged users ([db13983](https://github.com/kythia/kythia/commit/db139830b6d31578a0548c4d8132c90285712acb))
* add ownerSkipCooldown setting and enhance Redis auto-reconnect logic ([e80ef95](https://github.com/kythia/kythia/commit/e80ef95b2920d9da8bf37fde1b4ec1180b3399d4))
* enhance guild creation event with dynamic invite link generation and improved embed details ([a048457](https://github.com/kythia/kythia/commit/a048457b10bff688f2575fb160925549c9fef25d))
* Enhance market command with realistic trading features ([4a25690](https://github.com/kythia/kythia/commit/4a256909b9bca12b79f2dbe0bbe8329d5f766a53))
* global merriage system; ([52cf603](https://github.com/kythia/kythia/commit/52cf60304ef8c7ba33f64fcb61b8bf0ca476d1dc))
* implement AI response filtering to prevent unwanted tags in messages ([8c6de02](https://github.com/kythia/kythia/commit/8c6de0263ab75b8c3fecb591398eb6ab1f5a18df))
* implement server booster log feature toggle in settings; ([78d5d82](https://github.com/kythia/kythia/commit/78d5d82af18f7254806c15b3e145b7b37c9ad11b))

### [0.9.9-beta-rc.3](https://github.com/kythia/kythia/compare/v0.9.9-beta-rc.2...v0.9.9-beta-rc.3) (2025-10-13)


### 🔨 Fixed

* changing example.env and example.kythia.config.js to main as is ([2e995fa](https://github.com/kythia/kythia/commit/2e995fa37a75dae702f6439eb6383c803e25b180))
* update start script in package.json to include --deploy flag for proper deployment ([5302312](https://github.com/kythia/kythia/commit/530231261a017574c02cbfd3e69a4b1276642f48))


### 🔧 Changed

* changing pet addon to follow kythia user and coin ([3289cfb](https://github.com/kythia/kythia/commit/3289cfb7d7540e627a2c3d28f72d8591fbe99486))
* remove cooldown settings from various economy commands and update language strings to use "kythia coin" instead of "cash" ([f964b43](https://github.com/kythia/kythia/commit/f964b43c2535aea7b7970e6aafc037340a13f6ab))
* update dashboard routes to improve settings handling and enhance feature toggles; remove deprecated routes and streamline automod settings ([4947de9](https://github.com/kythia/kythia/commit/4947de944b5fa515658ea4dee2283571b4881bf1))
* update navbar and sidebar icons for improved UI consistency; ([0f6a530](https://github.com/kythia/kythia/commit/0f6a530d8ab239852cf3ddb3189c8f9d5e469166))
* update permissions for 'say' command and enhance landing page content; remove deprecated mobile navigation and improve layout styling ([f5fd57e](https://github.com/kythia/kythia/commit/f5fd57eef980233c8545ea3073c4a024db2374e4))


### ✨ Added

* (api) Enhance Top.gg webhook handling with user account prompts and rewards ([3b715e0](https://github.com/kythia/kythia/commit/3b715e0159f77e1fd2c807bbe85982dde953eeb8))
* (economy) Enhance bank command information, functionality and user experience ([0c2bff8](https://github.com/kythia/kythia/commit/0c2bff80280e6e3777c3f5951f8c36871104901a))
* add GuildMemberRemove event handler to track user departures and send goodbye messages with customizable banners (not tested yet) ([6f84826](https://github.com/kythia/kythia/commit/6f8482666e417940c5cc9c191115d3f3aaee1a17))
* Add new market-related language strings for asset transactions in economy addon ([82acfc9](https://github.com/kythia/kythia/commit/82acfc991e15c7eb5a52354ca651dc2bce5f55ca))
* **economy:** Enhance economy commands with bank type benefits ([eb22c56](https://github.com/kythia/kythia/commit/eb22c5661e30d3581fd5deb1ddbd662bfa0d0359))
* **economy:** Refactor economy commands to use a global user model ([6dfb60b](https://github.com/kythia/kythia/commit/6dfb60b5899bd6b6e9cd2721748d6325186417e2))
* **economy:** Update economy commands to use kythiaCoin and kythiaBank ([e71b40e](https://github.com/kythia/kythia/commit/e71b40e7cf7da35d210b7b85a2fe214be5520a76))
* implement Kythia team management command with add, delete, and list functionalities; enhance error handling and logging ([ee3f94d](https://github.com/kythia/kythia/commit/ee3f94dea4065fa8172b19c9cecde6c35416c5cd))

### 0.9.9-beta-rc.2 (2025-10-09)


### 🔨 Fixed

* forEach is not a function on dashboard addon ([20f3ece](https://github.com/kythia/kythia/commit/20f3ecef6b8a707c6a8477048b431dc359fecd2a))
* safely resolve guild owner's username and update webhook description ([2cba2fb](https://github.com/kythia/kythia/commit/2cba2fba2d0249e1caa2057ba6b148e31a5c34c0))


### ✨ Added

* add Kythia CLI documentation and enhance server settings handling; normalize settings structure and improve error logging ([0c288fa](https://github.com/kythia/kythia/commit/0c288fa8fb656c1a6af8fbe15f57fe14120f91e1))
* add localization support for adventure commands; enhance command descriptions  and names in multiple languages in adventure addons ([42794e6](https://github.com/kythia/kythia/commit/42794e6711dbd5446e761dd33674221e8c417e5a))
* implement pagination for settings embed; enhance user interaction with navigation buttons for multi-page descriptions ([6245ce2](https://github.com/kythia/kythia/commit/6245ce242c1660413d194c879b26e78b9f649dd7))


### 🔧 Changed

* enhance Kythia initialization in Kythia.js and update intents in KythiaClient.js ([053fd3d](https://github.com/kythia/kythia/commit/053fd3d80095015ecd4fc05ef2568332eb103e3e))
* enhance various command structures and improve database models across multiple addons; streamline event handling and optimize performance; v0.9.9-beta-rc1 ([59f9140](https://github.com/kythia/kythia/commit/59f9140a82f301ce0fd7ed27221ab388ab137824))
* optimize KythiaClient configuration; streamline intents and partials setup, and enhance cache and sweeper settings ([5d9bbc2](https://github.com/kythia/kythia/commit/5d9bbc20bbf45a25b2bde0f64a1bd4245ee0eaa3))
* owner id now can more than 1 ([3b40662](https://github.com/kythia/kythia/commit/3b40662fecb5367a6d1a6b87775ebb4cc18fb2d0))
* streamline ping and stats commands; enhance Lavalink node ping handling and add Git commit ID to stats embed ([5660451](https://github.com/kythia/kythia/commit/566045105722249eb7d89900e022feebe21026b7))
* update bot owner configuration to support multiple IDs and names; enhance AI translation command with improved error handling and token management ([9c3ccd9](https://github.com/kythia/kythia/commit/9c3ccd9b08d841820b55d6e0ac677d4aab534008))

### 0.9.9-beta-rc.1 (2025-10-09)


### ✨ Added 

#### ⚔️ Adventure
- **battle:** Engage in battles with creatures.
- **inventory:** View your adventure inventory.
- **recall:** Recall your character.
- **shop:** Access the adventure shop.
- **start:** Begin your adventure.
- **stats:** Check your adventure statistics.

#### 🤖 AI
- **ai:** Interact with the AI.
- **translate:** Translate text to other languages.

#### ✅ Checklist
- **personal:** Manage your personal checklist.
- **server:** Manage the server's checklist.

#### ⚙️ CORE
- **autosetup:** Automatically configure server settings.
- **embed:** Create and manage embeds.
- **moderation:** Access moderation commands.
- **premium:** Manage premium features.
- **setting:** Configure bot settings.
- **tools:** Access various tools.
- **utils:** Access utility commands.

#### 💰 Economy
- **account:** Manage your economy account.
- **bank:** Interact with your bank account.
- **beg:** Beg for some cash.
- **cash:** Check your cash balance.
- **coinflip:** Gamble your cash in a coinflip.
- **daily:** Claim your daily reward.
- **deposit:** Deposit cash into your bank.
- **give:** Give cash to another user.
- **hack:** Attempt to hack for cash.
- **inventory:** View your economy inventory.
- **lootbox:** Open a lootbox.
- **profile:** View your economy profile.
- **rob:** Rob another user.
- **shop:** Access the economy shop.
- **slots:** Play the slot machine.
- **transfer:** Transfer cash to another user.
- **withdraw:** Withdraw cash from your bank.
- **work:** Work for some cash.

#### 🎉 Fun
- **8ball:** Ask the magic 8ball a question.
- **guessnumber:** Play a number guessing game.
- **uno:** Play a game of Uno.
- **tictactoe:** Play a game of Tic Tac Toe.
- **wordle:** Play a game of Wordle.

#### 🎁 Giveaway
- **giveaway:** Create and manage giveaways.

#### 💌 Invite
- **invite:** Get the bot's invite link.

#### 📈 Leveling
- **add:** Add experience to a user.
- **leaderboard:** View the leveling leaderboard.
- **profile:** View your leveling profile.
- **set:** Set a user's level.
- **xp-add:** Add experience points to a user.
- **xp-set:** Set a user's experience points.

#### 🎶 Music
- **music:** Control music playback.
- **reloadnode:** Reload the music node.

#### 🐾 Pet
- **admin:** Pet administration commands.
- **adopt:** Adopt a new pet.
- **editname:** Change your pet's name.
- **feed:** Feed your pet.
- **gacha:** Try your luck with the pet gacha.
- **info:** Get information about your pet.
- **leaderboard:** View the pet leaderboard.
- **play:** Play with your pet.
- **sell:** Sell your pet.
- **use:** Use a pet-related item.

#### ⚙️ Server
- **server:** Manage server settings.

#### 🔥 Streak
- **streak:** Manage your streaks.
