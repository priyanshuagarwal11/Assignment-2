# Photo Gallery Web App (React + Vite + Tailwind CSS)

A responsive, high-performance Photo Gallery web application built with **React**, **Vite**, and **Tailwind CSS**. It fetches 30 photos from the Picsum Photos API, renders them in a responsive grid, provides real-time author search filtering, and persists favorite photos using `useReducer` and `localStorage`.

Built as part of the Celebrare Frontend React Internship Pre-Screening Assignment.

---

## 🚀 Features & Scope

1. **Project Setup**:
   - Built from scratch with **React 18 + Vite**.
   - Styled exclusively with **Tailwind CSS** (zero external UI component libraries like MUI, AntD, or Bootstrap).

2. **API Data Fetching**:
   - Fetches 30 photos on load from `https://picsum.photos/v2/list?limit=30`.
   - Displays a modern loading spinner while fetching.
   - Graceful error boundary state with a retry option if the network request fails.

3. **Responsive Grid**:
   - **Desktop (≥ 1024px)**: 4 columns
   - **Tablet (≥ 768px)**: 2 columns
   - **Mobile (< 768px)**: 1 column
   - Each card displays the photo thumbnail, author name, and an interactive heart icon button.

4. **Real-time Search Filter**:
   - Filters photos dynamically by author name as you type.
   - Client-side filtering on already-fetched data without page reloads or redundant API requests.

5. **Favourites with `useReducer` + `localStorage`**:
   - Heart button toggles a photo's favorite state.
   - Managed via a dedicated `favouritesReducer` (not `useState`).
   - Automatically persisted to and hydrated from browser `localStorage` across page reloads.

6. **Custom Hook (`useFetchPhotos`)**:
   - Extracts all API fetch logic, loading, error, and cleanup into `src/hooks/useFetchPhotos.js`.
   - Returns `{ photos, loading, error }`.

7. **Performance Optimization (`useCallback` + `useMemo`)**:
   - `useCallback` wraps the search filter input change handler to maintain stable reference identity across re-renders.
   - `useMemo` computes the filtered photos list only when `photos` or `searchTerm` changes, avoiding unnecessary re-filtering when toggling favorites.

---

## 📁 Project Structure

```
ass1/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── hooks/
    │   └── useFetchPhotos.js        # Requirement 6: Custom hook
    ├── reducers/
    │   └── favouritesReducer.js     # Requirement 5: useReducer logic
    └── components/
        ├── Gallery.jsx              # Main gallery container (useCallback, useMemo, useReducer)
        ├── PhotoCard.jsx            # Card showing photo, author, heart button
        ├── SearchBar.jsx            # Memoized search input
        ├── LoadingSpinner.jsx       # Tailwind CSS loading spinner
        └── ErrorMessage.jsx         # Error state display
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Run

1. Clone or navigate to the directory:
   ```bash
   cd ass1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5180](http://localhost:5180) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🎥 5-Minute Screen Recording Guide & Script

Use this reference script when recording your 5-minute video answering the 5 required questions:

### 1. Show the App Working (1 – 1.5 minutes)
- Open browser at `http://localhost:5180`.
- Point out the initial loading spinner and the clean 4-column responsive grid layout on desktop.
- Type `"Alejandro"` in the search bar — demonstrate real-time filtering with no page reload.
- Click the heart icon on a couple of photo cards to mark them as favourites (show red filled heart and counter updating).
- Refresh the page (hit `Cmd+R` / `F5`) — show that the favourited photos and counter persist from `localStorage`.
- Optionally resize the browser to show 2 columns (tablet) and 1 column (mobile).

### 2. Open `useFetchPhotos` Hook (45 seconds)
- Open `src/hooks/useFetchPhotos.js`.
- **Explain**:
  > *"This custom hook encapsulates the asynchronous fetch logic. It manages three states: `photos`, `loading`, and `error`, and returns `{ photos, loading, error }`. Inside `useEffect`, we make a GET request to the Picsum Photos API with `limit=30`. We also use an `AbortController` for clean cancellation if the component unmounts. If the API fails (e.g., non-200 HTTP status or network failure), the error is caught, `error` state is populated with the message, `loading` is set to false, and the UI displays our `ErrorMessage` component."*

### 3. Open `useReducer` Code (45 seconds)
- Open `src/reducers/favouritesReducer.js` and show its usage in `src/components/Gallery.jsx`.
- **Explain**:
  > *"Our reducer handles the `TOGGLE_FAVOURITE` action. When dispatched with a photo ID, it checks if that ID exists in the state array: if present, it filters it out; if not, it appends it. We initialize the state using `getInitialFavourites()` reading from `localStorage`, and synchronize updates with a `useEffect` hook. We used `useReducer` instead of `useState` because toggling favorites involves conditional state transition logic and synchronization with external storage. `useReducer` decouples this state transition logic from UI rendering, making the state predictable, easily testable, and maintainable if additional actions like clearing all favorites are added later."*

### 4. Open `useCallback` and `useMemo` in `Gallery.jsx` (1 minute)
- Open `src/components/Gallery.jsx` (lines around `useCallback` and `useMemo`).
- **Explain**:
  > *"We used `useCallback` on `handleSearchChange`. It memoizes the input change handler function so its reference remains unchanged across re-renders of the Gallery. Since `SearchBar` is wrapped in `React.memo`, passing a stable callback reference prevents `SearchBar` from re-rendering unnecessarily when other state (like favourites) changes.*  
  > *We used `useMemo` on `filteredPhotos`. It caches the filtered array and only re-computes the array filtering when either `photos` or `searchTerm` changes. Without `useMemo`, clicking a heart button to toggle a favourite causes the Gallery component to re-render, which would needlessly re-run `.filter()` over all 30 photos on every single click. `useMemo` eliminates that redundant computation."*

### 5. Show One Difficult Part & How You Solved It (45 seconds)
- **Explain**:
  > *"One interesting challenge was handling `localStorage` synchronization alongside `useReducer` without causing unnecessary writes or hydration mismatches. Storing just the array of photo IDs rather than the entire photo objects kept the `localStorage` payload extremely lightweight, fast, and resilient to stale API data. Additionally, handling lazy state initialization in `useReducer(reducer, undefined, getInitialFavourites)` ensured `localStorage` is read only once on mount rather than on every render."*
