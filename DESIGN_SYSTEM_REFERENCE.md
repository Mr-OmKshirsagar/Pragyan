# 🎨 Pragyan Dashboard Design System - Quick Reference

## Color Palette

### Primary Gradients
```css
/* Indigo to Purple */
from-indigo-500 to-purple-500

/* Cyan to Purple */
from-cyan-400 to-purple-400

/* Purple to Cyan */
from-purple-500 to-cyan-400

/* Blue to Green */
from-blue-500 to-green-500
```

### Background Colors
```css
/* Main background */
bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950

/* Card backgrounds */
from-white/10 to-white/5

/* Overlay */
bg-black/40

/* Borders */
border-white/10
hover:border-indigo-500/30
```

### Text Colors
```
Heading:     text-white
Body:        text-gray-300
Label:       text-gray-400
Subtle:      text-gray-500
Accent:      text-cyan-400, text-indigo-300, etc.
```

---

## Component Patterns

### Premium Card
```jsx
<motion.div
  whileHover={{ y: -5 }}
  className="group relative bg-gradient-to-br from-white/10 to-white/5 
             backdrop-blur-xl rounded-2xl p-6 border border-white/10 
             hover:border-indigo-500/30 transition-all overflow-hidden"
>
  {/* Animated background */}
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 
                  via-transparent to-transparent opacity-0 
                  group-hover:opacity-100 transition-opacity" />
  
  {/* Content */}
  <div className="relative z-10">
    {children}
  </div>
</motion.div>
```

### Progress Bar
```jsx
<div className="h-2 bg-gray-700/50 rounded-full overflow-hidden border border-white/5">
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${percentage}%` }}
    transition={{ duration: 0.8 }}
    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 
               to-cyan-400 rounded-full shadow-lg shadow-indigo-500/50"
  />
</div>
```

### Badge/Label
```jsx
<span className="px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 
                 text-sm border border-indigo-500/30 font-semibold">
  {text}
</span>
```

### Interactive Button
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="bg-gradient-to-r from-purple-600 to-indigo-600 
             hover:from-purple-500 hover:to-indigo-500 
             transition-all rounded-xl py-2.5 font-semibold text-sm"
>
  {text}
</motion.button>
```

---

## Animation Patterns

### Entrance Animation
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  {children}
</motion.div>
```

### Stagger Effect
```jsx
{items.map((item, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 + idx * 0.05 }}
  >
    {/* Item */}
  </motion.div>
))}
```

### Hover Lift
```jsx
<motion.div
  whileHover={{ y: -5 }}
  className="transition-all"
>
  {children}
</motion.div>
```

### SVG Circle Progress
```jsx
<svg viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="95" fill="none" 
          stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
  <motion.circle
    cx="100" cy="100" r="95"
    fill="none" stroke="url(#gradient)"
    strokeWidth="3" strokeLinecap="round"
    initial={{ strokeDasharray: "600 600", strokeDashoffset: 600 }}
    animate={{ strokeDashoffset: 600 - (600 * score) / 100 }}
    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
  />
</svg>
```

---

## Grid Layouts

### 4-Column Grid (Stats)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {/* Items */}
</div>
```

### 3-Column Grid (Skills, Jobs)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {/* Items */}
</div>
```

### 2-Column Grid (Mobile-first)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Items */}
</div>
```

---

## Typography Hierarchy

### Hero Heading
```jsx
<h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
  {title}
</h1>
```

### Section Title
```jsx
<h2 className="text-2xl md:text-3xl font-bold text-white">
  {title}
</h2>
```

### Card Title
```jsx
<h3 className="text-lg font-bold text-white group-hover:text-indigo-300 
               transition-colors">
  {title}
</h3>
```

### Body Text
```jsx
<p className="text-gray-300">
  {text}
</p>
```

### Label
```jsx
<p className="text-gray-400 text-sm font-medium">
  {label}
</p>
```

---

## CSS Animation Classes

### Blob Animation
```css
.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
```

### Other Animations
```css
.animate-glow          /* Text glow */
.animate-gradient-shift /* Gradient animation */
.animate-pulse-glow    /* Box glow pulse */
.animate-shimmer       /* Shimmer effect */
.animate-float         /* Floating effect */
.animate-progress      /* Progress bar fill */
```

---

## Spacing Scale

### Padding
- `p-4` = 16px
- `p-5` = 20px
- `p-6` = 24px
- `p-8` = 32px
- `p-10` = 40px

### Gap (between items)
- `gap-3` = 12px
- `gap-4` = 16px
- `gap-5` = 20px
- `gap-6` = 24px
- `gap-8` = 32px

### Margins
- `mt-1` = 4px
- `mt-2` = 8px
- `mt-3` = 12px
- `mt-4` = 16px

### Section Spacing
```jsx
<div className="space-y-8">
  {/* 32px between children */}
</div>
```

---

## Border Radius

```css
rounded-lg    /* 8px - Small */
rounded-xl    /* 12px - Medium */
rounded-2xl   /* 16px - Large cards */
rounded-3xl   /* 24px - Hero sections */
rounded-full  /* 50% - Circles */
```

---

## Shadows & Glows

### Standard Shadow
```css
shadow-lg
```

### Glow Shadow
```css
shadow-lg shadow-indigo-500/50
shadow-lg shadow-purple-500/50
shadow-lg shadow-cyan-400/50
```

### Hover Glow
```jsx
group-hover:shadow-xl group-hover:shadow-indigo-500/50
```

---

## Responsive Prefixes

```css
/* Mobile first (no prefix) */
grid-cols-1

/* Small devices (640px+) */
sm:grid-cols-2

/* Tablets (768px+) */
md:text-5xl

/* Desktops (1024px+) */
lg:grid-cols-4

/* Large screens (1280px+) */
xl:...

/* Extra large (1536px+) */
2xl:...
```

---

## Hover & Interaction States

### Scale on Hover
```jsx
whileHover={{ scale: 1.05 }}    /* 5% larger */
whileHover={{ y: -5 }}          /* 5px up */
whileHover={{ scale: 1.2 }}     /* 20% larger */
```

### Tap/Click Feedback
```jsx
whileTap={{ scale: 0.95 }}      /* 5% smaller */
```

### Smooth Transitions
```jsx
transition={{ duration: 0.3 }}
transition={{ delay: 0.2 }}
transition={{ ease: "easeOut" }}
```

---

## Backdrop Blur Levels

```css
backdrop-blur-none   /* 0px - No blur */
backdrop-blur-sm     /* 4px */
backdrop-blur        /* 12px */
backdrop-blur-md     /* 12px */
backdrop-blur-lg     /* 16px */
backdrop-blur-xl     /* 24px */
```

Use:
- `backdrop-blur-sm` for subtle glass
- `backdrop-blur-xl` for strong glass effect

---

## Performance Tips

1. **Use `will-change` for animated elements**
   ```css
   will-change-transform
   ```

2. **GPU acceleration for transforms**
   ```css
   transform: translateZ(0);
   ```

3. **Avoid animating expensive properties**
   ❌ Don't animate: width, height, left, top, box-shadow
   ✅ Do animate: transform, opacity, color

4. **Use motion.div instead of div for animations**
   ```jsx
   import { motion } from "framer-motion";
   <motion.div>...</motion.div>
   ```

---

## Common Patterns

### Loading Skeleton
```jsx
<div className="animate-pulse space-y-4">
  <div className="h-8 w-56 bg-white/10 rounded" />
  <div className="h-4 w-full bg-white/10 rounded" />
</div>
```

### Empty State
```jsx
<div className="text-center py-12">
  <p className="text-gray-400">No data yet</p>
  <button onClick={action} className="mt-4">Get Started</button>
</div>
```

### Loading Spinner
```jsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity }}
  className="w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full"
/>
```

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers fully supported

---

## Resources

- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **Color Palette**: Indigo, Purple, Cyan primary theme
- **Font**: System fonts (SF Pro Display, Segoe UI, etc.)

---

## Tips for Extending

1. **Adding new cards**: Use the premium card component as template
2. **New animations**: Add to `animations.css` and import
3. **Color changes**: Update gradient colors in JSX
4. **Spacing adjustments**: Use Tailwind spacing scale
5. **Font sizes**: Stick to predefined typography sizes

---

## Quick Wins for Enhancement

- ✨ Add card shadows for depth
- 🎬 Increase stagger delays for slower reveal
- 🎨 Experiment with different gradient colors
- 📱 Test on various device sizes
- 🚀 Profile animations for performance
- 🔍 A/B test different hover effects

---

**Remember**: The design system is modular. Mix and match patterns to create stunning new components! 🎨
