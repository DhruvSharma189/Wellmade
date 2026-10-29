# WELLMADE — Everyday Goods, Chosen Well
### Fully Responsive Product Listing, Interactive 3D Studio & Community Feedback Web Application

**WELLMADE** is a modern e-commerce catalog and community platform built with React, Vite, TypeScript strict mode, Chakra UI v2, Three.js 3D Engine, Redux Toolkit, React Router, React Hook Form, and Zod.

---

## ✨ Key Features & 3D Interactive Capabilities

### 1. 🌐 Interactive Three.js 3D Hero Studio (`Hero3DCanvas`)
- **Real-Time WebGL 3D Canvas**: Renders physical 3D objects directly in the hero section using Three.js.
- **Interactive Orbit & Drag**: Click and drag across the 3D canvas to rotate in full 360 degrees, with smooth inertia and mouse parallax.
- **3 Switchable 3D Showcase Models**:
  1. `01 Monolith`: Faceted architectural terracotta/graphite polyhedral sculpture with orbiting satellite rings.
  2. `02 Chrono Ring`: Precision gyroscopic timepiece with gold bezel, floating crystal core, and mechanical rings.
  3. `03 Design Vessel`: Contemporary ceramic and polished copper amphora vessel.
- **Studio Lighting & Viewport Controls**:
  - Auto-spin toggle (play/pause)
  - Holographic Wireframe mode toggle (inspect 3D geometry mesh)
  - 3 Studio Lighting presets (*Terracotta Sunset*, *Daylight Gallery*, *Obsidian Midnight*)
  - Camera reset button

### 2. 💎 3D Kinetic Brand Emblem (`Brand3DEmblem`)
- Micro-WebGL 3D canvas integrated directly into the brand mark in the navbar and footer.
- Interactive multi-material faceted cube that catches ambient light and accelerates smoothly upon hover.

### 3. 🔍 3D Product Turntable Inspector (`Product3DViewer`)
- Dedicated 3D inspection mode on the **Product Details Page** and in the **Quick View Modal**.
- Dynamically creates bespoke 3D geometric representations tailored to each product's category:
  - *Jewelry*: Refractive faceted gemstone and metallic ring band.
  - *Electronics*: Precision anodized gadget chassis with glass screen and lens ring.
  - *Clothing*: Tailored sculptural mannequin form with brass stand.
  - *Goods*: Artisanal embossed luxury gift monolith with copper band.
- Full 360-degree turntable rotation, zoom in/out (up to 200%), wireframe mode, and studio lighting.

### 4. 🎴 Gyroscopic 3D Card Tilt & Specular Glare (`ProductCard`)
- Product cards calculate cursor angle and apply real-time 3D perspective tilt (`rotateX`, `rotateY`).
- Dynamic specular light glare follows the cursor across the card surface.
- Layered Z-axis depth pop (`translateZ`) on product images.
- **3D Quick View** button to inspect the item in 3D without leaving the grid.
- **Add to Bag** and **Wishlist** toggles with live Redux synchronization.

### 5. 🛍️ Interactive Bag & Wishlist Drawer (`CartDrawer`)
- Slide-over drawer with real-time subtotal calculation and item count badges.
- Free Express Shipping progress tracker ($75 threshold).
- Quantity stepper (+/-) and removal controls.
- Simulated one-click checkout with toast confirmation.
- Wishlist counter and saved item status.

### 6. 📝 Community Feedback & Validation (`FeedbackPage` & `FeedbackForm`)
- Accessible feedback form built with **React Hook Form** and **Zod** schema validation.
- Real-time inline error messaging for name, email format, and message length.
- Instant submission into Redux state with browser `localStorage` persistence.
- Dedicated `/feedback` page with live counter, search filter, and chronological card listing.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🛠️ Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with HMR |
| `npm run build` | Runs strict TypeScript verification (`tsc -b`) and bundles for production (`vite build`) |
| `npm run test` | Runs the full Vitest suite (12 unit tests across API, selectors, feedback, cart) |
| `npm run preview` | Previews the production build locally |

---

## 🔌 API Integration Guide

The application connects to a configurable API endpoint defined in `.env`:

```env
VITE_PRODUCTS_API_URL=https://fakestoreapi.com/products
```

### Where to Add Your API URL:
1. Create or edit `.env` in this directory.
2. Set `VITE_PRODUCTS_API_URL=https://api.yourdomain.com/v1/products`.
3. Restart Vite (`npm run dev`).

### How to Map Your API Response:
All normalization logic lives in **`src/services/productsApi.ts`** under `normalizeProduct()`:

```typescript
export function normalizeProduct(value: unknown): Product | null {
  return {
    id: Number(value.id),
    title: String(value.title),
    price: Number(value.price) || 0,
    description: String(value.description || ''),
    category: String(value.category || 'Uncategorised'),
    image: String(value.image || ''),
    rating: value.rating ? { rate: Number(value.rating.rate), count: Number(value.rating.count) } : undefined
  };
}
```

---

## 💾 Feedback & Cart Persistence

- **Redux State**: Manages feedback and cart items in-memory for instant, reactive UI updates.
- **Browser Persistence**: Synchronized to `localStorage` under `wellmade-feedback-v1`, `wellmade-cart-v1`, and `wellmade-wishlist-v1`. Submissions persist across page reloads on the same browser.
- **Connecting a Backend Database**: To enable real multi-user shared feedback, replace `dispatch(addFeedback(...))` in `src/components/FeedbackForm.tsx` with an API call (e.g. `POST /api/feedback`) using `createAsyncThunk`.

---

## 🧪 Testing

Run all unit tests:
```bash
npm test
```
All 12 tests for API normalization, product selectors, filtering, feedback state, and cart state pass without errors.
