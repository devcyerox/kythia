<p align="center">
  <a href="https://kythia.me">
    <img src="./addons/dashboard/web/public/assets/img/logo/logo.png" alt="Kythia Logo" height="150" style="border-radius: 10px;">
  </a>
</p>

<h1 align="center">
  Kythia - Your Cutest Discord Companion
</h1>

<p align="center">
  <strong>Kythia Hye-Jin is more than just a bot; she's your sweet, cute, and beautiful companion, designed to bring life and order to your Discord server!</strong>
</p>

<p align="center">
  <a href="https://github.com/kythia/kythia/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-CC%20BYNC%204.0-blue?style=for-the-badge" alt="License"></a>
</p>

<p align="center">
  <a href="https://github.com/kythia/kythia/issues">Report a Bug</a>
  ·
  <a href="https://github.com/kythia/kythia/issues">Request a Feature</a>
</p>

<div align="center">
  <p><em>Powered by the following technologies:</em></p>
  <img alt="Discord" src="https://img.shields.io/badge/Discord-5865F2.svg?style=flat&logo=Discord&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=nodedotjs&logoColor=white">
  <img alt="Sequelize" src="https://img.shields.io/badge/Sequelize-52B0E7.svg?style=flat&logo=Sequelize&logoColor=white">
  <img alt="Express.js" src="https://img.shields.io/badge/Express.js-000000.svg?style=flat&logo=express&logoColor=white">
  <img alt="Gemini" src="https://img.shields.io/badge/Gemini-4285F4.svg?style=flat&logo=Google&logoColor=white">
</div>

---

## 🌟 Features

Kythia is packed with a massive amount of features, all organized into a clean, modular addon system. This means you can easily enable or disable features to tailor the bot to your server's specific needs.

Here's a glimpse of what Kythia has to offer:

### 🛡️ Core Features (from the `core` addon)

*   **Advanced Moderation:** A full suite of moderation commands, including `ban`, `kick`, `mute`, `warn`, `clear`, and more.
*   **Automod:** Automatically delete messages containing spam, bad words, or other unwanted content.
*   **Logging:** Keep track of everything that happens on your server with detailed logs for message deletions, member joins, and more.
*   **Customizable Settings:** Configure the bot's prefix, welcome messages, and other settings to your liking.
*   **Powerful Tools:** A variety of tools to help you manage your server, such as `sticky` messages, `embed` builders, and `hash` crackers.

### 🎉 Engagement & Fun

*   **Adventure Game (`adventure`):** Embark on an epic text-based adventure, fight monsters, and collect loot!
*   **Economy System (`economy`):** Earn virtual currency, rob your friends, and gamble your way to riches.
*   **Music (`music`):** Listen to your favorite tunes with a feature-rich music player.
*   **Pets (`pet`):** Adopt and raise your own virtual pet.
*   **NSFW (`nsfw`):** For the more... adventurous servers.
*   **And more!** Including `fun` games, `giveaways`, and `streaks`.

### 🚀 Server Management & Utility

*   **Ticket System (`ticket`):** A complete ticket system to help you manage user support requests.
*   **Suggestions (`suggestion`):** Allow users to submit suggestions and vote on their favorites.
*   **Clan System (`clan`):** Create and manage clans for your server members.
*   **Leveling System (`leveling`):** Reward your users for their activity with a customizable leveling system.
*   **And much more!** Including `invite` tracking, `server` templates, and `pterodactyl` integration.

### ✨ And Many More Addons!

Kythia comes with a huge collection of addons, including:

*   `ai`
*   `checklist`
*   `dashboard`
*   `minecraft`
*   `nuke`
*   `store`
*   `testimony`

...and the list is always growing!

---

## 🤔 Why Kythia?

There are many Discord bots out there, but Kythia stands out from the crowd. Here's why:

*   **🤖 Modular by Design:** Kythia is built on a powerful addon system, allowing you to enable only the features you need. This keeps the bot lightweight and efficient.
*   **✨ Feature-Rich:** With a massive collection of addons, Kythia offers a huge range of features, from advanced moderation to fun games and a full-fledged economy system.
*   **🔧 Fully Customizable:** Almost every aspect of Kythia can be configured to your liking. From custom welcome messages to fine-tuned automod settings, you're in control.
*   **🚀 Actively Developed:** Kythia is constantly being improved with new features, bug fixes, and performance enhancements.

---

## 🚀 Getting Started

Ready to bring Kythia to your server? Here's how to get her up and running.

### ⚙️ Prerequisites

Before running this bot, please ensure you have the following installed:

1. **Node.js** (Node 22 LTS recommended)
2. **npm** (Usually included with Node.js)
3. A Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications)
4. **Database** such as MySQL, PostgreSQL, MSSQL installed
5. Optional **PM2** for 24/7 hosting run `npm install pm2 -g`

### 📖 Installation Guide

#### 1. Prepare the Requirements

Ensure you have the following software installed:

1. **Node.js**

   - Download and install [Node.js](https://nodejs.org/).
   - Verify installation in your terminal:
     ```bash
     node -v
     npm -v
     ```
     If both versions are displayed, installation was successful.

2. **Discord Bot Token**
   - Visit the [Discord Developer Portal](https://discord.com/developers/applications).
   - Click **New Application**, name your bot, and create it.
   - Navigate to the **Bot** tab, click **Add Bot**, and copy your bot token.

#### 2. Install Dependencies

1. Ensure you are in the project root directory.
2. Install the required libraries:
   ```bash
   npm install
   ```
3. Wait until all dependencies are installed.

#### 3. Configure Environment Variables

1. Copy and rename `example.env` to `.env` file in the project root directory.
2. Copy and rename `example.kythia.config.js` to `kythia.config.js`
3. Configure Your Bot
   Open the `.env` and `kythia.config.js` files. Both files contain detailed comments to guide you in filling out all the required values.

#### 4. Start the Bot

1. Ensure all configurations are correct.
2. Choose how you want to run the bot:

   - **For a quick test (in foreground):**

     ```bash
     npm start
     ```

     _(Press `ctrl + c` to stop the bot)_

   - **For 24/7 Hosting (Recommended):**
     ```bash
     # Run this command ONLY ONCE for the very first time.
     # It will start the bot and save it to PM2's process list.
     npm run pm2:startup
     ```
     _(To manage the bot later, use commands like `npm run pm2:stop` or `npm run pm2:restart`)_

3. If the bot starts successfully, you will see a message such as:
   ```bash
   ✅ Logged in as Kythia#9135
   ```
4. Check the terminal for any errors.
5. If there are no errors, the bot is running and ready for use.
6. If errors occur, review the relevant files for troubleshooting.

#### 5. Invite the Bot to Your Server

1. Return to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select your application, then go to the **OAuth2** > **URL Generator** tab.
3. Select the `bot` scope and add the necessary permissions (e.g., `Manage Roles`, `Send Messages`) but `administrator` recommended.
4. Copy the generated URL and open it in your browser to invite the bot to your server.

#### 6. Test the Bot

1. Open your Discord server where the bot has been invited.
2. Type `/ping`, `/help` or `/about` to check the bot's response.
3. Enjoy using Kythia!

#### 🔌 Optional: Dashboard Setup

If you enabled the dashboard in `kythia.config.js`, you **MUST** configure the Redirect URI in the Discord Developer Portal, otherwise login will fail.

1.  Go to [Discord Developer Portal](https://discord.com/developers/applications) > Select your App.
2.  Go to the **OAuth2** tab (General, not URL Generator).
3.  Find the **"Redirects"** section.
4.  Click **Add Redirect** and enter your dashboard callback URL:
    * If on Localhost: `http://localhost:3000/auth/discord/callback`
    * If on VPS (IP): `http://YOUR_VPS_IP:3000/auth/discord/callback`
    * If using Domain: `https://yourdomain.com/auth/discord/callback`
5.  **Save Changes**.
6.  Make sure this URL matches exactly with `API_URL` in your `.env` file (minus the `/auth...` part).

---

## 🎮 Usage

Once Kythia is in your server, you can start using her commands. All commands are slash commands, so just type `/` to see a list of available commands.

Here are a few commands to get you started:

*   `/help`: Shows a list of all available commands.
*   `/ping`: Checks the bot's latency.
*   `/serverinfo`: Displays information about the server.
*   `/userinfo`: Displays information about a user.

For a full list of commands and their detailed usage, please see the [Command Documentation](https://kythia.me/commands).

---

## ⌘ CLI Tools & Commands

Kythia Core comes with a powerful CLI to streamline development, database management, and localization tasks.

Run `npx kythia --help` to see all available commands.

### Database Management

#### `migrate`
Run pending database migrations.
```bash
npx kythia migrate
```
**Options:**
*   `-f, --fresh`: **[DANGER]** Wipe the entire database (drop all tables) and re-run all migrations from scratch.
*   `-r, --rollback`: Rollback the last *batch* of migrations.

#### `make:migration`
Create a new timestamped migration file in an addon.
```bash
npx kythia make:migration --name create_users_table --addon core
```
**Options:**
*   `--name <string>`: Name of the migration (snake_case recommended).
*   `--addon <string>`: Target addon name (must exist in `addons/`).

#### `make:model`
Scaffold a new Sequelize model file in an addon.
```bash
npx kythia make:model --name User --addon core
```
**Options:**
*   `--name <string>`: Name of the model (PascalCase recommended).
*   `--addon <string>`: Target addon name.

#### `cache:clear`
Flush Redis cache. Supports multi-instance selection if `REDIS_URLS` is configured.
```bash
npx kythia cache:clear
```

### Localization (i18n)

#### `lang:check`
Lint translation key usage in your code against your language files.
```bash
npx kythia lang:check
```
*   **Static Analysis:** Uses AST parsing to find `t('key')` calls.
*   **Validation:** Reports missing keys in JSON files.
*   **Unused Keys:** Reports keys defined in `en.json` but never used in code.

#### `lang:translate`
Auto-translate your `en.json` to a target language using Google Gemini AI.
```bash
npx kythia lang:translate --target ja
```
**Options:**
*   `--target <lang>`: Target language code (default: `ja`).
*   **Requires:** `GEMINI_API_KEYS` in `.env`.

### Development Utilities

#### `dev:namespace`
Automatically add or update JSDoc `@namespace` headers in all project files.
```bash
npx kythia dev:namespace
```
Useful for maintaining consistent file documentation and ownership headers.

#### `gen:structure`
Generate a markdown tree representation of your project structure.
```bash
npx kythia gen:structure
```
Outputs to `temp/structure.md`. Great for documentation or sharing context with AI.

#### `version:up`
Synchronize JSDoc `@version` tags across the project with `package.json`.
```bash
npx kythia version:up
```
Run this after bumping your package version to keep file headers in sync.

-----

## 🙌 Contributing

Contributions to Kythia are managed by the internal development team. If you are a member of the team and would like to contribute, please follow the established development workflow.

*   **🐛 Reporting Bugs:** If you find a bug, please report it to the team through the designated channels. Be sure to include as much detail as possible, including steps to reproduce the bug.
*   **💡 Suggesting Features:** Have an idea for a new feature? We'd love to hear it! Please share your suggestion with the team.

---

## 📜 License

This project is licensed under the CC BY-NC 4.0 License. See the [LICENSE](LICENSE) file for details.
Copyright © 2025 Kythia Labs - All rights reserved.
For commercial use, please contact us at [kenndeclouv@gmail.com](mailto:kenndeclouv@gmail.com).

---

## 💬 Community & Support

Need help or want to connect with other Kythia users? Join our community!

*   **🌐 Website:** [kythia.me](https://kythia.me)
*   **💬 Discord Server:** [dsc.gg/kythia](https://dsc.gg/kythia)
*   **📧 Email:** [kenndeclouv@gmail.com](mailto:kenndeclouv@gmail.com)
