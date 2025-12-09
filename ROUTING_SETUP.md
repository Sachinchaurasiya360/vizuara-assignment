# React Router Setup for Vercel Deployment

## Overview
The frontend now uses **React Router** for proper client-side routing, which works seamlessly with Vercel deployment.

## Changes Made

### 1. Installed React Router
```bash
npm install react-router-dom
```

### 2. Updated `main.tsx`
Wrapped the app with `BrowserRouter`:
```tsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### 3. Updated `App.tsx`
Simplified to use `Routes` and `Route` with `Navigate` for fallback:
```tsx
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<PipelineBuilder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
```

### 4. Created `PipelineBuilder.tsx`
Extracted the pipeline builder UI into its own component with `useNavigate`:
- Uses `navigate("/")` to go back to home
- Resets pipeline state on navigation
- All the previous pipeline building functionality

### 5. Updated `LandingPage.tsx`
Now uses `useNavigate()` instead of callback props:
```tsx
const navigate = useNavigate();
const { resetPipeline } = usePipelineStore();

const handleGetStarted = () => {
  resetPipeline();
  navigate("/builder");
};
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `LandingPage` | Home page with features, benefits, CTA |
| `/builder` | `PipelineBuilder` | ML pipeline builder interface |
| `*` | `Navigate to="/"` | Fallback - redirects unknown routes to home |

## How It Works with Vercel

### `vercel.json` Configuration
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**Why this works:**
1. **Rewrites**: All requests (`/`, `/builder`, any route) are rewritten to `/index.html`
2. **React Router**: Once the SPA loads, React Router reads the URL and renders the correct component
3. **Navigate**: The `<Navigate to="/" replace />` catches any undefined routes and redirects to home
4. **Build Output**: Vercel knows to serve files from `dist/` folder

## Navigation Flow

### From Landing Page → Builder
```
User clicks "Get Started" button
  ↓
handleGetStarted() called
  ↓
resetPipeline() - clears any previous state
  ↓
navigate("/builder") - React Router changes URL and renders PipelineBuilder
  ↓
URL changes to /builder (without page reload)
```

### From Builder → Landing Page
```
User clicks "Back to Home" button
  ↓
handleBackToHome() called
  ↓
resetPipeline() - clears pipeline state
  ↓
navigate("/") - React Router changes URL and renders LandingPage
  ↓
URL changes to / (without page reload)
```

### Direct URL Access (e.g., user visits https://yourapp.com/builder)
```
Browser requests /builder
  ↓
Vercel rewrite rule catches it → serves index.html
  ↓
React app loads in browser
  ↓
BrowserRouter reads URL path (/builder)
  ↓
Routes component matches /builder route
  ↓
PipelineBuilder component renders
```

### Unknown URL (e.g., user visits https://yourapp.com/unknown)
```
Browser requests /unknown
  ↓
Vercel rewrite rule catches it → serves index.html
  ↓
React app loads in browser
  ↓
BrowserRouter reads URL path (/unknown)
  ↓
Routes component matches wildcard "*" route
  ↓
Navigate component redirects to "/"
  ↓
LandingPage component renders
```

## Testing

### Local Development
```bash
npm run dev
# Visit http://localhost:5174/
# Click "Get Started" → URL changes to /builder
# Click "Back to Home" → URL changes to /
# Try http://localhost:5174/builder directly → works!
# Try http://localhost:5174/random → redirects to /
```

### Production Build
```bash
npm run build
npm run preview
# Same testing as above
```

### Vercel Deployment
```bash
git add .
git commit -m "Add React Router for proper client-side routing"
git push
# Vercel auto-deploys
# Test all routes on live URL
```

## Key Benefits

✅ **Proper URL routing** - Each page has its own URL  
✅ **Browser back/forward** - Works as expected  
✅ **Deep linking** - Users can bookmark `/builder` directly  
✅ **No page reloads** - Fast, SPA-like navigation  
✅ **SEO friendly** - Proper URL structure  
✅ **Vercel compatible** - Works with rewrite rules  
✅ **State management** - Pipeline state resets on navigation  

## Troubleshooting

### 404 errors on Vercel
- ✅ Fixed by `vercel.json` rewrites
- ✅ Fixed by specifying `buildCommand` and `outputDirectory`

### Routes not working locally
- Make sure `BrowserRouter` wraps `<App />` in `main.tsx`
- Check that routes are defined in `App.tsx`

### State persists between pages
- Use `resetPipeline()` before navigation
- Example: `navigate("/")` after completing pipeline

## Next Steps

If you want to add more routes:
1. Create the component (e.g., `Documentation.tsx`)
2. Add route in `App.tsx`:
   ```tsx
   <Route path="/docs" element={<Documentation />} />
   ```
3. Navigate to it:
   ```tsx
   navigate("/docs")
   ```
4. No changes needed in `vercel.json` - rewrites handle all routes automatically!
