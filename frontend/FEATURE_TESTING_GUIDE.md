# ML Pipeline Builder - Feature Testing Guide

## 🎯 Overview

This guide helps you test all features of the No-Code ML Pipeline Builder application.

## 🚀 Getting Started

### Prerequisites

- Dev server running: `npm run dev`
- Open browser at: `http://localhost:5173`

---

## 📋 Feature Testing Checklist

### 1. Landing Page ✨

**Location:** Home page (default view)

**Test Items:**

- [ ] Hero section displays with gradient background
- [ ] Statistics cards show correct numbers
- [ ] Feature cards (6 total) display with hover effects
- [ ] "How It Works" section shows 5 steps
- [ ] Benefits section displays with checkmarks
- [ ] CTA buttons are functional
- [ ] "Get Started" button navigates to pipeline builder
- [ ] Footer displays correctly

**Visual Tests:**

- [ ] Gradients render smoothly
- [ ] Hover effects on cards work
- [ ] Responsive layout on different screen sizes
- [ ] Smooth scrolling works

---

### 2. Header & Navigation 🧭

**Location:** Top of pipeline builder page

**Test Items:**

- [ ] Logo and title display correctly
- [ ] Gradient effects on logo background
- [ ] "Back to Home" button works
- [ ] Button returns to landing page
- [ ] Header is sticky on scroll
- [ ] Backdrop blur effect visible

**Visual Tests:**

- [ ] Header stays at top when scrolling
- [ ] Shadow appears below header
- [ ] Button hover effects work

---

### 3. File Upload Step 📤

**Location:** First step in pipeline

**Test Items:**

- [ ] Drag-and-drop area displays
- [ ] Gradient icon background shows
- [ ] Browse files button works
- [ ] Drag-and-drop functionality:
  - [ ] Drag file over area changes border color to blue
  - [ ] Drop file triggers upload
  - [ ] Invalid file types show error
  - [ ] Files > 100MB show error
- [ ] Upload progress bar displays
- [ ] Progress bar has gradient animation
- [ ] Success alert appears after upload
- [ ] Data preview table shows

**Supported File Types:**

- CSV (.csv)
- Excel (.xlsx, .xls)
- JSON (.json)

**Visual Tests:**

- [ ] Hover effect on drop area
- [ ] Scale animation on drag-over
- [ ] Progress bar shimmer effect
- [ ] Success alert with green theme
- [ ] File upload card has shadow and hover effect

---

### 4. Data Preview Table 📊

**Location:** After file upload

**Test Items:**

- [ ] Table displays uploaded data
- [ ] Column headers show
- [ ] Row data displays correctly
- [ ] Column statistics show (if available)
- [ ] Table is scrollable horizontally/vertically
- [ ] Data types are visible

**Visual Tests:**

- [ ] Table has proper borders
- [ ] Zebra striping on rows
- [ ] Header row is distinct
- [ ] Scrollbar styling matches theme

---

### 5. Preprocessing Options ⚙️

**Location:** Second step in pipeline

**Test Items:**

- [ ] Preprocessing form displays
- [ ] Missing value handling options:
  - [ ] Remove rows
  - [ ] Fill with mean/median/mode
  - [ ] Fill with constant value
- [ ] Scaling options:
  - [ ] Standard Scaler
  - [ ] Min-Max Scaler
  - [ ] Robust Scaler
  - [ ] No scaling
- [ ] Encoding options:
  - [ ] One-hot encoding
  - [ ] Label encoding
  - [ ] Target encoding
- [ ] Column selection dropdowns work
- [ ] "Apply Preprocessing" button works
- [ ] Loading state shows during processing
- [ ] Success message appears
- [ ] Transformation summary displays

**Visual Tests:**

- [ ] Form inputs have focus states
- [ ] Dropdowns styled correctly
- [ ] Button gradient and hover effects
- [ ] Card header with gradient background

---

### 6. Train-Test Split 📈

**Location:** Third step in pipeline

**Test Items:**

- [ ] Split ratio selector displays
- [ ] Slider/input for split percentage
- [ ] Default value (e.g., 80/20 split)
- [ ] Visual representation of split
- [ ] Stratification option (for classification)
- [ ] Random seed input
- [ ] Shuffle data checkbox
- [ ] "Apply Split" button works
- [ ] Success message shows split details

**Visual Tests:**

- [ ] Visual split diagram
- [ ] Percentage labels
- [ ] Interactive slider if present
- [ ] Card styling consistent

---

### 7. Model Selection 🤖

**Location:** Fourth step in pipeline

**Test Items:**

**Classification Models:**

- [ ] Logistic Regression
- [ ] Decision Tree
- [ ] Random Forest
- [ ] Gradient Boosting
- [ ] Support Vector Machine (SVM)
- [ ] K-Nearest Neighbors (KNN)
- [ ] Naive Bayes
- [ ] Neural Network

**Regression Models:**

- [ ] Linear Regression
- [ ] Ridge Regression
- [ ] Lasso Regression
- [ ] ElasticNet
- [ ] Decision Tree
- [ ] Random Forest
- [ ] Gradient Boosting
- [ ] Neural Network

**Test Items:**

- [ ] Model cards display with descriptions
- [ ] Model selection radio/button works
- [ ] Hyperparameter configuration panel shows
- [ ] Hyperparameters update per model
- [ ] Input validation works
- [ ] "Train Model" button works
- [ ] Loading state during training
- [ ] Brain icon animation

**Visual Tests:**

- [ ] Model cards have hover effects
- [ ] Selected model is highlighted
- [ ] Hyperparameter inputs styled correctly
- [ ] Collapsible sections work smoothly

---

### 8. Results & Metrics 📊

**Location:** Fifth step (after training)

**Test Items:**

**For Classification:**

- [ ] Accuracy score displays
- [ ] Precision, Recall, F1-score
- [ ] Confusion matrix
- [ ] ROC curve (if available)
- [ ] Feature importance chart

**For Regression:**

- [ ] R² score
- [ ] Mean Absolute Error (MAE)
- [ ] Mean Squared Error (MSE)
- [ ] Root Mean Squared Error (RMSE)
- [ ] Residual plot
- [ ] Feature importance chart

**Visual Tests:**

- [ ] Metrics cards styled correctly
- [ ] Charts render properly (Recharts)
- [ ] Gradient backgrounds on metric cards
- [ ] Export/download buttons (if present)

---

### 9. Pipeline Visualization 🔄

**Location:** Top of pipeline builder (React Flow)

**Test Items:**

- [ ] Pipeline nodes display
- [ ] Nodes show current step
- [ ] Edges connect nodes
- [ ] Active step is highlighted
- [ ] Completed steps show checkmark
- [ ] Pending steps are dimmed
- [ ] Interactive dragging works
- [ ] Zoom controls work
- [ ] Mini-map (if enabled)

**Visual Tests:**

- [ ] Node styling matches theme
- [ ] Gradient backgrounds on nodes
- [ ] Smooth transitions between steps
- [ ] Canvas background pattern

---

### 10. Error Handling 🚨

**Location:** Throughout app

**Test Items:**

- [ ] Invalid file upload shows error
- [ ] Network errors display alert
- [ ] Form validation errors show
- [ ] Error alerts can be dismissed
- [ ] Error messages are clear
- [ ] Errors don't break the app

**Visual Tests:**

- [ ] Error alerts have red theme
- [ ] Alert icon displays (exclamation)
- [ ] Slide-in animation works
- [ ] Dismiss button styled correctly

---

### 11. Loading States ⏳

**Location:** Throughout app

**Test Items:**

- [ ] File upload shows progress
- [ ] Preprocessing shows loader
- [ ] Model training shows loader
- [ ] Loader animation is smooth
- [ ] Loading text is descriptive
- [ ] Buttons disabled during loading

**Visual Tests:**

- [ ] Spinner animation
- [ ] Progress bar gradient
- [ ] Pulse animations on icons
- [ ] Loading overlays

---

### 12. Responsive Design 📱

**Devices to Test:**

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768px width)
- [ ] Mobile (375px width)

**Test Items:**

- [ ] Layout adapts to screen size
- [ ] Navigation remains accessible
- [ ] Cards stack vertically on mobile
- [ ] Text remains readable
- [ ] Buttons are tappable (min 44px)
- [ ] Forms are usable on mobile

---

### 13. Accessibility ♿

**Test Items:**

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] Buttons have aria-labels
- [ ] Color contrast meets WCAG AA
- [ ] Alt text on images/icons
- [ ] Form labels are associated
- [ ] Error messages are announced

---

### 14. Performance ⚡

**Test Items:**

- [ ] Initial page load < 3s
- [ ] Smooth animations (60fps)
- [ ] No layout shifts (CLS)
- [ ] Large files upload efficiently
- [ ] Charts render smoothly
- [ ] No memory leaks
- [ ] Dev tools show no warnings

---

### 15. Visual Polish ✨

**Test Items:**

- [ ] Consistent color scheme
- [ ] Gradients render smoothly
- [ ] Shadows and depth effects
- [ ] Typography is readable
- [ ] Spacing is consistent
- [ ] Icons align properly
- [ ] Buttons have active states
- [ ] Hover effects are smooth
- [ ] Transitions are fluid
- [ ] Overall UI feels polished

---

## 🐛 Known Limitations

Since this is a **frontend-only** implementation without a backend:

1. **File Upload:** Will fail to actually upload (no backend API)
2. **Data Preprocessing:** Will fail to process (no backend)
3. **Model Training:** Will fail to train (no backend)
4. **Results:** Won't display real results (no backend)

### Testing Without Backend

You can still test:

- ✅ UI/UX and visual design
- ✅ Component rendering
- ✅ Form interactions
- ✅ Animations and transitions
- ✅ Responsive layout
- ✅ Navigation flow
- ✅ Error state displays
- ✅ Loading states

To see full functionality, you need to:

1. Implement the backend API (Node.js + TypeScript)
2. Connect to the API endpoints defined in `src/api/pipeline.api.ts`

---

## 🎨 UI Enhancements Checklist

### Completed ✅

- [x] Landing page with hero section
- [x] Gradient backgrounds throughout
- [x] Enhanced button styles with gradients
- [x] Improved card shadows and hover effects
- [x] Better alert styling with icons
- [x] Progress bar with shimmer animation
- [x] Enhanced input/select focus states
- [x] Custom scrollbar styling
- [x] Smooth scroll behavior
- [x] Animation keyframes
- [x] Rounded corners (xl)
- [x] Border thickness improvements
- [x] Color scheme consistency

### Additional Ideas 💡

- [ ] Dark mode toggle
- [ ] Skeleton loaders
- [ ] Toast notifications
- [ ] Confetti on success
- [ ] Advanced charts with interactions
- [ ] Export pipeline as JSON
- [ ] Save/load pipelines
- [ ] Pipeline templates
- [ ] Drag-and-drop file anywhere
- [ ] Keyboard shortcuts

---

## 🔧 Developer Tools

### Browser DevTools

- **React DevTools:** Check component state
- **Network Tab:** View API calls (will fail without backend)
- **Console:** Check for errors/warnings
- **Performance Tab:** Profile rendering

### Zustand DevTools

- State inspection
- Time-travel debugging
- Action tracking

---

## 📝 Testing Notes

### Create a Test Dataset

For manual testing, create a simple CSV file:

```csv
age,income,credit_score,approved
25,50000,650,1
35,75000,720,1
45,60000,680,1
22,35000,580,0
50,90000,750,1
28,45000,620,0
```

Save as `test_data.csv` and try uploading.

---

## ✅ Final Checklist

Before considering the feature complete:

- [ ] All UI components render correctly
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Smooth animations throughout
- [ ] Responsive on all screen sizes
- [ ] Accessible with keyboard
- [ ] Loading states work
- [ ] Error states work
- [ ] Success states work
- [ ] Landing page is polished
- [ ] Pipeline builder is functional (UI-wise)
- [ ] Ready for backend integration

---

## 🚀 Next Steps

1. **Backend Development:**

   - Implement Node.js + TypeScript backend
   - Create API endpoints matching `src/api/pipeline.api.ts`
   - Add ML processing with scikit-learn or similar

2. **Integration:**

   - Connect frontend to backend
   - Test end-to-end flow
   - Handle real data processing

3. **Deployment:**
   - Deploy frontend (Vercel, Netlify)
   - Deploy backend (Render, Railway, AWS)
   - Configure CORS and environment variables

---

## 📞 Support

For issues or questions:

- Check browser console for errors
- Review component props in React DevTools
- Inspect Zustand store state
- Review API client configuration

Happy Testing! 🎉
