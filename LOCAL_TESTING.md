# Local Jekyll Testing Instructions

## Overview

Your site is a Jekyll-based GitHub Pages site. To test changes locally, you need to run Jekyll's built-in development server on your machine.

## Prerequisites Check

First, verify you have Ruby and Bundler installed:

```bash
ruby --version
bundle --version
```

If either command fails, you'll need to install them first (see Installation section below).

## Step-by-Step Instructions

### 1. Navigate to your project directory

```bash
cd /Users/qasaryounis/Desktop/qycowebsite/qasar.github.io
```

### 2. Install dependencies

Install all required gems (Jekyll and plugins) specified in your `Gemfile`:

```bash
bundle install
```

This will install:

- Jekyll (the static site generator)
- jekyll-seo-tag (SEO plugin)
- jekyll-sitemap (sitemap plugin)

### 3. Start the local Jekyll server

**Important:** Use the local config file so images load from your local assets folder:

```bash
bundle exec jekyll serve --config _config.yml,_config_local.yml
```

Or the shorter version:

```bash
bundle exec jekyll s --config _config.yml,_config_local.yml
```

**Note:** The `_config_local.yml` file sets the URL to empty for local development, so images will use relative paths (`/assets/...`) instead of the production URL (`https://qy.co/assets/...`). This file is in `.gitignore` so it won't affect your production site.

### 4. View your site

Once the server starts, you'll see output like:

```
Server address: http://127.0.0.1:4000/
```

Open your browser and navigate to: **http://localhost:4000** or **http://127.0.0.1:4000**

### 5. Make changes and test

- Edit any files (like `books.md`, `style.scss`, etc.)
- The site will automatically regenerate (you'll see messages in the terminal)
- Refresh your browser to see the changes
- No need to restart the server for most changes

### 6. Stop the server

Press `Ctrl + C` in the terminal to stop the Jekyll server when you're done testing.

## Optional: Live Reload

To enable automatic browser refresh on changes, add the `--livereload` flag:

```bash
bundle exec jekyll serve --livereload
```

## If Ruby/Bundler Not Installed

### macOS Installation (using Homebrew):

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Ruby
brew install ruby

# Install Bundler
gem install bundler
```

### Alternative: Use rbenv or rvm

If you prefer version managers, you can use `rbenv` or `rvm` to manage Ruby versions.

## Troubleshooting

**Issue: "Could not locate Gemfile"**

- Make sure you're in the project root directory (`qasar.github.io`)

**Issue: "Permission denied" errors**

- Try: `bundle install --user-install` or use `sudo` (not recommended)

**Issue: Port 4000 already in use**

- Use a different port: `bundle exec jekyll serve --port 4001`

**Issue: Changes not showing**

- Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows/Linux)
- Check the terminal for any error messages

**Issue: "mkmf.rb can't find header files for ruby" or "Failed to build gem native extension"**

- This means you need Xcode Command Line Tools installed
- Run: `xcode-select --install` and follow the GUI prompts to complete installation
- After installation completes, try `bundle install` again

**Issue: Ruby version too old (requires Ruby >= 3.0)**

- Your system has Ruby 2.6.10, but some gems require Ruby 3.0+
- Options:
  1. Update Ruby using Homebrew: `brew install ruby` (then restart terminal)
  2. Use rbenv to install Ruby 3.0+: `rbenv install 3.0.0 && rbenv global 3.0.0`
  3. Use the `github-pages` gem which matches GitHub Pages environment exactly

## Notes

- The local server runs in development mode, which may differ slightly from GitHub Pages production
- GitHub Pages uses a specific Jekyll version - if you see differences, you may need to match versions
- Your `_config.yml` is already configured correctly for Jekyll

