# Testing Instructions

## Quick Start

To test your Jekyll site locally, run the `jrun` script:

```bash
./jrun
```

This will start the Jekyll development server with Docker.

## If `jrun` Doesn't Work

If the script doesn't work, you can run the Docker command directly:

```bash
docker run --rm \
  -v "$PWD":/srv/jekyll \
  -p 4000:4000 \
  jekyll/jekyll:pages \
  sh -c "apk add --no-cache build-base && bundle install && bundle exec jekyll serve --watch --drafts --force_polling --host 0.0.0.0"
```

## What This Does

- **`--rm`**: Automatically removes the container when it stops
- **`-v "$PWD":/srv/jekyll`**: Mounts your current directory into the container
- **`-p 4000:4000`**: Maps port 4000 from container to your host
- **`jekyll/jekyll:pages`**: Uses the GitHub Pages-compatible Jekyll image
- **`--watch`**: Automatically regenerates the site when files change
- **`--drafts`**: Includes draft posts in the build
- **`--force_polling`**: Forces file watching (useful in Docker)
- **`--host 0.0.0.0`**: Makes the server accessible from outside the container

## Viewing Your Site

Once the server starts, open your browser and navigate to:

**http://localhost:4000**

## Making Changes

- Edit any files in your project
- The site will automatically regenerate (watch the terminal output)
- Refresh your browser to see the changes
- No need to restart the server

## Stopping the Server

Press `Ctrl + C` in the terminal to stop the Jekyll server.

## Troubleshooting

**Issue: "docker: command not found"**
- Install Docker Desktop for your operating system
- Make sure Docker is running

**Issue: Port 4000 already in use**
- Stop any other Jekyll servers running on port 4000
- Or modify the port mapping: `-p 4001:4000` (then use http://localhost:4001)

**Issue: Changes not showing**
- Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows/Linux)
- Check the terminal for any error messages
- Make sure the `--watch` flag is working (you should see regeneration messages)

