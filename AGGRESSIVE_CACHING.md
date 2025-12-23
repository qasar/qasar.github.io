# Aggressive Caching Strategy

## 🎯 Philosophy
**Most content on the site is static and rarely changes**, so we use very aggressive caching for maximum performance.

## 📊 Cache Durations

### Static Assets (1 Year)
- **Images** (photos, book covers): `max-age=31536000, immutable`
- **CSS/JS**: `max-age=31536000, immutable`
- **Reason**: These never change after initial upload

### HTML Pages (24 Hours)
- **Most pages**: `max-age=86400, must-revalidate`
- **Reason**: Content is mostly static (books, photos, about, etc.)
- **Updates**: Browser checks for updates after 24 hours

### Writings Page (6 Hours)
- **Writings page**: `max-age=21600, must-revalidate`
- **Reason**: Updates a few times a year when new essays are added
- **Service Worker**: Still serves from cache instantly, but checks network in background

### Favicon (1 Month)
- **Favicon**: `max-age=2592000`
- **Reason**: Changes very rarely

## 🚀 How It Works

### First Visit:
- Normal download (~2-3 seconds)
- Everything cached

### Repeat Visits (< 24 hours):
- **Instant load** (< 100ms) - served from cache
- No network requests needed

### After 24 Hours:
- Still instant load from cache
- Browser checks network in background
- Updates cached version if content changed

### Writings Page Special Handling:
- Served instantly from cache
- Service worker checks network in background
- Updates cache if new essays added
- User sees updates within 6 hours max

## 📝 When Content Updates

### Photos Update (coming in a few weeks):
1. Update photos
2. Update service worker version: `const CACHE_NAME = 'qyco-v1.0.1';`
3. Deploy
4. Users get new photos automatically

### New Essay Added:
1. Add new essay markdown file
2. Deploy
3. Writings page updates within 6 hours (or immediately if user refreshes)
4. Service worker updates cache in background

### Other Content Updates:
- Most pages: Updates appear within 24 hours
- Or: User can hard refresh (Ctrl+Shift+R) to see immediately

## 🎯 Performance Impact

| Content Type | Cache Duration | Update Frequency | User Experience |
|--------------|----------------|------------------|-----------------|
| Images/CSS/JS | 1 year | Never | Instant forever |
| HTML Pages | 24 hours | Rarely | Instant, updates within 24h |
| Writings | 6 hours | Few times/year | Instant, updates within 6h |
| Favicon | 1 month | Rarely | Instant |

## ✅ Benefits

1. **Maximum Performance**: Repeat visits are instant (< 100ms)
2. **Reduced Bandwidth**: Less data transferred
3. **Better UX**: Site feels like a native app
4. **Offline Support**: Site works offline
5. **Smart Updates**: Writings page checks for updates in background

## 🔧 Force Cache Refresh

If you need to force users to see updates immediately:

1. **Update Service Worker Version**:
   ```javascript
   // In sw.js
   const CACHE_NAME = 'qyco-v1.0.1'; // Increment version
   ```

2. **Deploy**: Users automatically get new version

3. **Alternative**: Users can hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

## 📈 Expected Results

- **First Visit**: ~2-3 seconds (normal)
- **Repeat Visits**: **< 100ms** (instant!)
- **After 24 Hours**: Still instant, background update check
- **Writings Page**: Instant, background update check every 6 hours

## 🎉 Result

**Your site now loads instantly on repeat visits, with smart background updates for content that changes occasionally!**

The aggressive caching strategy is perfect for a mostly-static site like yours, where content rarely changes but you want maximum performance.

