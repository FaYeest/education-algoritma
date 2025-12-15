# 🎨 Brutalism Style Guide - AlgoViz

## Design Philosophy
Inspired by **Saweria** brutalism aesthetic - bold, unapologetic, and highly functional.

## Core Principles

### 1. **Typography**
- **Font Weight:** Always use `font-black` (700-900) for headings
- **Font Family:** Arial/Helvetica (sans-serif)
- **Text Transform:** `UPPERCASE` for titles and buttons
- **Letter Spacing:** `tracking-tight` to `tracking-widest`

### 2. **Borders**
- **Thickness:** Always 3px (`border-3`)
- **Color:** Pure black (`#000000`) or white (`#FFFEF2`)
- **Style:** Solid, no rounded corners (or minimal)

### 3. **Shadows**
- **Type:** Hard shadows, NO blur
- **Pattern:** `4px 4px 0px 0px #000000` (brutal shadow)
- **Sizes:**
  - `shadow-brutal-sm`: 2px 2px
  - `shadow-brutal`: 4px 4px (default)
  - `shadow-brutal-lg`: 8px 8px

### 4. **Colors**
```css
Primary:   #FF6B35 (Orange Red)
Secondary: #00D9FF (Cyan)
Success:   #00F5A0 (Mint Green)
Warning:   #FFC700 (Yellow)
Danger:    #FF006E (Hot Pink)
Purple:    #A855F7
Cyan:      #06B6D4

Background (Light): #FFFEF2 (Cream)
Background (Dark):  #0A0A0A (Near Black)
```

### 5. **Interactions**
- **Hover:** `translate(-2px, -2px)` + increase shadow
- **Active:** `translate(2px, 2px)` + decrease shadow
- **Transition:** `0.1s - 0.2s` (fast, snappy)

## Component Classes

### Buttons
```jsx
className="btn-brutal px-6 py-3 bg-brutal-primary text-white shadow-brutal"
```

### Cards
```jsx
className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6"
```

### Sliders
```jsx
className="slider-brutal cursor-pointer"
```

## Usage Examples

### Primary Button
```jsx
<button className="btn-brutal px-6 py-3 bg-brutal-primary text-white shadow-brutal">
  CLICK ME
</button>
```

### Card with Hover Effect
```jsx
<div className="card-brutal bg-brutal-bg p-6 group">
  <h3 className="font-black text-2xl group-hover:text-brutal-primary">
    TITLE
  </h3>
</div>
```

### Section Title
```jsx
<h1 className="text-5xl font-black uppercase tracking-tight border-b-4 border-black pb-4">
  ALGORITHM VISUALIZER
</h1>
```

## Do's and Don'ts

### ✅ DO
- Use uppercase for important text
- Use bold/black font weights
- Keep borders thick (3px)
- Use hard shadows
- Use high contrast colors
- Keep transitions snappy (< 0.2s)

### ❌ DON'T
- Use soft/rounded corners
- Use gradient backgrounds
- Use blur effects
- Use light font weights
- Use lowercase for titles
- Use smooth/slow transitions

## Animation Guidelines
```jsx
// Card hover - translate up and increase shadow
hover:translate(-2px, -2px)
hover:shadow-brutal-lg

// Button press - translate down and decrease shadow
active:translate(2px, 2px)
active:shadow-brutal-sm

// Icon scale on hover
group-hover:scale-110
transition-transform
```

## Future Additions (When Backend Ready)
- Loading states with bold geometric spinners
- Error messages with thick red borders
- Success notifications with hard green borders
- Progress bars with chunky segments
