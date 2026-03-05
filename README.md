# Canto DAM Dashboard

A lightweight, responsive web dashboard for visualizing Canto Digital Asset Management export data.

## Features

- **Upload Trends**: Track daily upload activity over the last 30 days
- **Download Statistics**: Monitor download patterns and activity
- **Login Activity**: View user login trends and unique user count
- **Top Files**: Display most downloaded assets
- **Top Tags**: Visualize most used tags in a doughnut chart
- **Top Searches**: Show most frequent search terms
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Zero Dependencies**: Uses Chart.js via CDN only

## Quick Start

### Option 1: Local Development Server

```bash
cd /home/az/.openclaw/workspace/canto-review/gui
python3 -m http.server 8000
```

Then open: http://localhost:8000

### Option 2: Direct File Open

Simply open `index.html` in any modern browser.

## Deployment

### Cloudflare Pages (Recommended)

**Prerequisites:**
- Cloudflare account
- Wrangler CLI installed: `npm install -g wrangler`
- Cloudflare API token with Pages permissions

**One-Time Setup:**

1. Create Cloudflare Pages project:
   ```bash
   wrangler pages project create canto-dashboard
   ```

2. Set up Cloudflare API token as GitHub secret:
   - Go to https://github.com/mizoz/canto-dashboard/settings/secrets/actions/new
   - Add secret: `CLOUDFLARE_API_TOKEN`
   - Value: Your Cloudflare API token (Pages:Edit permission)

**Deploy Options:**

**Option A: Manual Deploy**
```bash
cd /home/az/.openclaw/workspace/canto-review/gui
npm run deploy
# or
npx wrangler pages deploy . --project-name=canto-dashboard
```

**Option B: CI/CD (Automatic)**
- Push to `main` branch → GitHub Actions deploys automatically
- Workflow: `.github/workflows/deploy.yml`

**Option C: Local Preview**
```bash
npm run dev
# or
npx wrangler pages dev .
```

### Netlify

1. Drag and drop the `gui` folder to https://app.netlify.com/drop

### GitHub Pages

1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select branch (main/master) and root folder

### Static Hosting (Any Provider)

Upload these files to any static hosting:
- `index.html`
- `app.js`
- `data/` folder (all CSV files)

## File Structure

```
gui/
├── index.html          # Main dashboard page
├── app.js              # Dashboard logic and charts
├── README.md           # This file
└── data/               # CSV data files
    ├── UploadHistory.csv
    ├── DownloadHistory.csv
    ├── LoginHistory.csv
    ├── TopTags.csv
    ├── TopSearch.csv
    └── TopDownload.csv
```

## Data Source

Dashboard reads from Canto DAM export CSV files in the `data/` folder:

| File | Purpose |
|------|---------|
| UploadHistory.csv | Upload trends and statistics |
| DownloadHistory.csv | Download activity tracking |
| LoginHistory.csv | User login analytics |
| TopTags.csv | Most used tags |
| TopSearch.csv | Top search terms |
| TopDownload.csv | Most downloaded files |

## Updating Data

To refresh dashboard data:

1. Export new CSV files from Canto DAM
2. Replace files in `data/` folder
3. Refresh browser (Ctrl+R / Cmd+R)

## Customization

### Colors

Edit CSS variables in `index.html`:
```css
/* Header gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Chart colors */
borderColor: '#667eea'
```

### Time Range

In `app.js`, change the `getLastNDays` parameter:
```javascript
const uploadTrend = getLastNDays(uploadStats.byDate, 30); // Change 30 to desired days
```

### Chart Types

Modify chart type in `app.js`:
```javascript
type: 'line'  // Options: 'line', 'bar', 'doughnut', 'pie', 'radar'
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- **Load Time**: < 2 seconds (typical)
- **Bundle Size**: ~17KB (HTML + JS)
- **Chart Library**: Chart.js 4.x (CDN)
- **No Build Step**: Pure HTML/CSS/JS

## Troubleshooting

**Charts not loading?**
- Ensure CSV files exist in `data/` folder
- Check browser console for errors
- Verify CSV column headers match expected format

**Data not displaying?**
- CSV files must have headers in first row
- Date format: YYYY-MM-DD HH:MM
- Numeric fields must be parseable

**CORS errors when opening file directly?**
- Use a local server: `python3 -m http.server 8000`
- Or deploy to any static hosting

## License

MIT License - Free to use and modify.

## Support

For issues or feature requests, contact the dashboard maintainer.

---

**Last Updated**: 2026-03-05  
**Dashboard Version**: 1.0.0
