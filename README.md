# SemanticNav — Exact UI Recreation from Reference Images

A responsive, high-fidelity, interactive frontend for **SemanticNav** built strictly with **HTML5, CSS3, and Vanilla JavaScript**, pixel-faithfully reconstructed according to the reference designs.

---

## 🌟 Quick Start

1. Open `index.html` directly in any modern desktop or mobile web browser.
2. Alternatively, serve locally:
   ```bash
   python3 -m http.server 8080
   # Open http://localhost:8080 in your browser
   ```
3. **Interactive Screen Switcher**: Use the floating dock at the top of the screen to quickly switch and test between all required screens:
   - `[A: Homepage]` — Reference Image A (Main Landing Page)
   - `[B1: Login]` — Reference Image B, Screen 1 (Split Auth Layout)
   - `[B2: Sign Up]` — Reference Image B, Screen 2 (Registration Flow)
   - `[B3: Explore Intent]` — Reference Image B, Screen 3 (Intent Discovery Interface)
   - `[B4: Intent Results]` — Reference Image B, Screen 4 (Intent Results & Refinement)

---

## 🎨 Visual Design System Reconstructed

- **Color Palette**:
  - Deep Navy: `#06183D`
  - Dark Blue: `#0B2B67`
  - Royal Blue: `#124DC5`
  - Electric Blue: `#246CF5`
  - Cyan Highlights: `#66D8FF`
  - Ivory Background: `#F7F4EE`
  - Card White: `#FFFEFC`
  - Pale Blue Accent: `#E8EFFF`
  - Main Text: `#101A31`
  - Secondary Text: `#53627B`
  - Metallic Gold Accent: `#C7A96B`

- **Typography**:
  - Editorial Serifs: `Playfair Display` & `Cormorant Garamond` for headings and brand wordmark.
  - Sans-Serif: `DM Sans` for body copy, controls, form inputs, and labels.
  - Tracked uppercase eyebrows and taglines (`letter-spacing: 2.8px`).

- **Distinctive Celestial & Botanical Frame**:
  - Rounded browser-like container with gold/navy double borders.
  - Four SVG corner flourishes combining botanical leaf scrolls, celestial stars (✦, ✧, ⋆), and circuit traces.
  - Flowing rhythmic wave decoration along the bottom border.

---

## 🖥️ Screen Architecture

### 1. Main Landing Page (Reference Image A)
- **Top Navigation Bar**:
  - Compact AI processor microchip icon with connector pins and cyan center.
  - Editorial brand wordmark: *"Semantic"* in near-black and *"Nav"* in royal blue.
  - Navigation links: `Home`, `Explore`, `Features`, and `About` with vertical separators.
  - `Home` active pill with dark navy background (`#06183D`) and white text.
  - Search trigger icon and circular user profile avatar button.
- **Hero Section**:
  - Eyebrow: `WEB NAVIGATION MADE INTELLIGENT`.
  - Editorial serif headline: `SemanticNav`.
  - Supporting taglines: `INTENT • DISCOVER • NAVIGATE` and `FIND THE RIGHT WEBSITES, FASTER`.
  - Long horizontal search bar with placeholder `"Search by your intent ..."` and circular blue arrow button.
  - Interactive suggested query chips.
- **Hero Right AI Illustration**:
  - Central glowing blue AI brain with concentric orbital rings and synapse network.
  - 4 surrounding floating browser panels: `Websites`, `Code`, `Information`, and `Navigation`.
  - Futuristic pedestal base with glowing cyan illumination slits.
- **Four Feature Cards**:
  1. **Discover Functionality** — *"Find relevant websites for your intent"*
  2. **Adapts to Dynamic Interfaces** — *"Works across different website designs"*
  3. **Understands Your Intent** — *"AI-powered navigation based on meaning"*
  4. **Quick and Easy Access** — *"Reach the right websites in fewer steps"*
  - Includes circular blue gradient icon backgrounds, custom SVG icons, and circular blue arrow action buttons.

### 2. Login Screen (Reference Image B — Screen 1)
- **Split Layout**:
  - Left panel: Brand wordmark, uppercase taglines, and compact AI brain illustration.
  - Right panel: White rounded card with `"Welcome back"`, `"Sign in to continue to SemanticNav"`.
  - Email field with envelope icon, password field with lock icon and show/hide eye toggle.
  - *"Remember me"* checkbox and *"Forgot password?"* trigger (with demo reset modal).
  - Full-width blue *"Sign in"* button with arrow.
  - OR separator and *"Continue with Google"* button.
  - Switch link to Sign Up screen.

### 3. Sign Up Screen (Reference Image B — Screen 2)
- Same balanced split layout shell as Login.
- Full name field, email field, password field with show/hide toggle.
- Terms of Service & Privacy Policy acceptance checkbox.
- Field validation with live inline error messaging.
- Full-width blue *"Create account"* button with arrow.
- Switch link to Sign In screen.

### 4. Explore Intent Screen (Reference Image B — Screen 3)
- Shared top header with `Explore` highlighted as active dark navy pill.
- Centered headline: *"What are you trying to find?"*.
- Supporting text: *"Describe your need in your own words and let SemanticNav find the right websites for you."*
- Wide rounded search input with magnifier icon and circular blue arrow submit button.
- 5 Suggested query chips:
  - *Learn a new skill*
  - *Compare products*
  - *Find research papers*
  - *Plan a trip*
  - *Solve a coding problem*
- *"Search across"* category pills: `Web`, `Articles`, `Videos`, `Tools`.
- Expandable *"Advanced filters"* panel (Timeframe, Semantic Depth, Domain Scope).
- Bottom 3-benefit strip: *Use natural language*, *Get relevant results*, *Save time*.

### 5. Intent Results Screen (Reference Image B — Screen 4)
- Heading: *"Results matched to your intent"*.
- Active Intent chip: e.g. *"Intent detected: compare reliable budget laptops for university"* with interactive *"Edit intent"* button.
- Refinement input with submit arrow button to narrow down criteria.
- Quick filter pills: `Budget`, `Student use`, `Battery life`, `Free / Open`, plus `More` dropdown.
- Sorting dropdown: `Relevance` (default), `Highest Rated`, `Newest First`, `A – Z`.
- Vertically stacked white result cards matching Reference B:
  - **Best Budget Laptops for Students** (The Verge) — 97% relevant
  - **The Best College Laptops** (PCMag) — 94% relevant
  - **Student Laptops on Amazon** (Amazon) — 91% relevant
  - **Wirecutter: Best Laptops Under $700** (NYTimes) — 93% relevant
  - **Reddit /r/SuggestALaptop University Hub** (Reddit) — 89% relevant
- Working external links and interactive bookmark saving (persisted in `localStorage`).

---

## ⚙️ Interactive Features & Heuristic Engine

1. **Client-side Intent Engine**:
   - Parses natural language queries into semantic intent domains (Product comparison, Learning, Research, Travel, Coding).
   - Heuristically ranks candidate websites and displays confidence percentages.
   - Transparently structured to easily plug in backend AI/NLP embeddings APIs.
2. **Interactive Saved Discoveries Drawer**:
   - View and manage bookmarked websites saved across sessions.
3. **Demo User Authentication**:
   - Stores session state locally in `localStorage`. Does not store real passwords.
4. **Keyboard Accessibility**:
   - `Ctrl/Cmd + K` opens the search bar.
   - `Escape` closes all drawers and modals.
5. **Responsive**:
   - Tested and fluid across Desktop, Tablet, and Mobile.
