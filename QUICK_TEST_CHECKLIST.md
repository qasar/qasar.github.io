# Quick Test Checklist - Verify Changes Work

## ✅ Files to Verify

1. **Service Worker** (`sw.js`) - Should be accessible at `/sw.js`
2. **Cache Headers** (`_headers`) - For CDN (won't work on localhost, but file exists)
3. **Service Worker Registration** - In `_layouts/default.html`

## 🧪 Testing Steps

### 1. Open Browser DevTools
- Go to: http://localhost:4000
- Open DevTools (F12 or Cmd+Option+I)
- Go to **Application** tab → **Service Workers**

### 2. Check Service Worker Registration
- Should see service worker registered
- Status should be "activated and running"
- Version: `qyco-v1.0.0`

### 3. Check Console for Errors
- Go to **Console** tab
- Should see: "ServiceWorker registration successful"
- No red errors

### 4. Test Service Worker File
- Go to: http://localhost:4000/sw.js
- Should see JavaScript code (not 404)
- Should see `CACHE_NAME = 'qyco-v1.0.0'`

### 5. Test Caching
- **First visit**: Check Network tab - all requests normal
- **Second visit**: Refresh page (F5)
- Check Network tab - should see "(from ServiceWorker)" or "(from disk cache)"
- Load time should be much faster

### 6. Test Offline Mode
- DevTools → Network tab → Check "Offline"
- Reload page
- Should still work! (service worker serves cached content)

### 7. Verify Pages Load
- Homepage: http://localhost:4000
- Photos: http://localhost:4000/photos/
- Books: http://localhost:4000/books/
- Writings: http://localhost:4000/writings/
- All should load without errors

## 🚨 Common Issues

### Service Worker Not Registering
- Check console for errors
- Make sure you're on `localhost` (not `127.0.0.1` - service workers need localhost)
- Try hard refresh (Cmd+Shift+R)

### 404 on sw.js
- Make sure `sw.js` is in root directory
- Check Jekyll is serving it (might need to be in `_site/` folder)
- Try: http://localhost:4000/sw.js directly

### Cache Not Working
- First visit always downloads everything (normal)
- Second visit should use cache
- Check Network tab for "(from ServiceWorker)"

## ✅ Success Criteria

- [ ] Service worker registers successfully
- [ ] No console errors
- [ ] All pages load correctly
- [ ] Second visit loads faster (from cache)
- [ ] Offline mode works

## 🔧 If Something's Broken

1. **Check Console**: Look for JavaScript errors
2. **Check Network Tab**: See what's failing to load
3. **Unregister Service Worker**: 
   - DevTools → Application → Service Workers → Unregister
   - Hard refresh (Cmd+Shift+R)
4. **Check Jekyll Output**: Look at terminal for errors

## 📝 Quick Commands

```bash
# Check if Jekyll is running
ps aux | grep jekyll

# Restart Jekyll (if needed)
# Stop current: Ctrl+C
# Start: bundle exec jekyll serve --config _config.yml,_config_local.yml

# Check service worker file exists
ls -la sw.js
```

---

**Your site should be running at: http://localhost:4000**

Open it and check the DevTools to verify everything works! 🚀

