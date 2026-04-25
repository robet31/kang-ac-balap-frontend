# 🚀 MotoCare Pro - Splash Screen Guide

## Overview

Splash screen yang keren dan modern dengan animasi smooth menggunakan Motion (Framer Motion). Tampil saat aplikasi pertama kali di-load.

## Features

### 🎨 Visual Elements
- **Gradient Background**: Coral orange to peach gradient dengan animated circles
- **Animated Logo**: 
  - Rotating outer rings
  - Counter-rotating middle ring
  - Animated wrench icon dengan slight rotation
  - Orbiting satellite icons (Bike, Zap)
- **Progress Bar**: Smooth animated progress dengan loading messages
- **Floating Particles**: 20 animated particles untuk efek depth

### ⚡ Animations

#### Logo Animation
```typescript
initial={{ scale: 0, rotate: -180 }}
animate={{ scale: 1, rotate: 0 }}
transition={{ type: "spring", stiffness: 200, damping: 20 }}
```

#### Background Circles
- Large animated blobs dengan scale + position animation
- Infinite loop animation
- Blur effect untuk depth

#### Progress Bar
- Auto-increments dari 0% ke 100%
- Duration: ~3 seconds
- Smooth transitions

#### Loading Messages
Progressive loading states:
1. 0-30%: "Memuat komponen..."
2. 30-60%: "Menghubungkan ke server..."
3. 60-90%: "Menyiapkan dashboard..."
4. 90-100%: "Hampir siap..."

## Usage

### Basic Implementation

```tsx
import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return <YourMainApp />;
}
```

### Props

```typescript
interface SplashScreenProps {
  onComplete: () => void; // Callback when splash is complete
}
```

## Customization

### Adjust Duration

Edit progress increment in `/components/SplashScreen.tsx`:

```typescript
// Current: 2% every 30ms = ~3 seconds total
setInterval(() => {
  setProgress((prev) => {
    if (prev >= 100) {
      clearInterval(interval);
      setTimeout(onComplete, 500);
      return 100;
    }
    return prev + 2; // Change this to adjust speed
  });
}, 30); // Change this to adjust interval
```

**Examples:**
- Faster: `prev + 5` with `20ms` interval = ~1.5 seconds
- Slower: `prev + 1` with `50ms` interval = ~5 seconds

### Change Colors

Edit gradient in `/components/SplashScreen.tsx`:

```tsx
// Current gradient
className="fixed inset-0 z-50 flex items-center justify-center 
  bg-gradient-to-br from-[#ff7e5f] via-[#feb47b] to-[#ffcaa7]"

// Custom gradient example
className="fixed inset-0 z-50 flex items-center justify-center 
  bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
```

### Customize Logo

Replace the Wrench icon:

```tsx
// Current
<Wrench className="w-12 h-12 text-[#ff7e5f]" strokeWidth={2.5} />

// Custom icon
<YourIcon className="w-12 h-12 text-primary" />
```

### Modify Loading Messages

Edit messages array:

```typescript
const messages = [
  { range: [0, 30], text: "Memuat komponen..." },
  { range: [30, 60], text: "Menghubungkan ke server..." },
  { range: [60, 90], text: "Menyiapkan dashboard..." },
  { range: [90, 100], text: "Hampir siap..." }
];
```

## Advanced Customization

### Add Skip Button

```tsx
<button 
  onClick={onComplete}
  className="absolute top-4 right-4 text-white/80 hover:text-white"
>
  Skip →
</button>
```

### Add Logo Image

Replace animated logo with image:

```tsx
<img 
  src="/logo.png" 
  alt="Logo" 
  className="w-32 h-32 animate-pulse"
/>
```

### Conditional Display

Show splash only on first visit:

```tsx
const [showSplash, setShowSplash] = useState(() => {
  const hasSeenSplash = localStorage.getItem('hasSeenSplash');
  return !hasSeenSplash;
});

const handleSplashComplete = () => {
  localStorage.setItem('hasSeenSplash', 'true');
  setShowSplash(false);
};
```

### Add Sound Effect

```tsx
useEffect(() => {
  const audio = new Audio('/sounds/startup.mp3');
  audio.play().catch(e => console.log('Audio blocked:', e));
}, []);
```

## Animation Details

### Outer Ring Rotation
```typescript
animate={{ rotate: 360 }}
transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
```

### Middle Ring Counter-Rotation
```typescript
animate={{ rotate: -360 }}
transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
```

### Wrench Wobble
```typescript
animate={{ rotate: [0, 10, -10, 0] }}
transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
```

### Orbiting Icons
```typescript
// Top icon (Bike)
animate={{ rotate: 360 }}
transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
style={{ transformOrigin: '50% 70px' }}

// Side icon (Zap)  
animate={{ rotate: 360 }}
transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
style={{ transformOrigin: '-70px 50%' }}
```

### Floating Particles
```typescript
animate={{
  y: [-20, -100],
  opacity: [0, 1, 0]
}}
transition={{
  duration: 2 + Math.random() * 2,
  repeat: Infinity,
  delay: Math.random() * 2
}}
```

## Performance Tips

### Reduce Particles
Change particle count for better performance:

```tsx
// Current: 20 particles
{[...Array(20)].map((_, i) => (...))}

// Reduced: 10 particles
{[...Array(10)].map((_, i) => (...))}
```

### Simplify Animations
Remove complex animations for low-end devices:

```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Conditional rendering
{!prefersReducedMotion && <AnimatedElements />}
```

### Optimize Images
If using logo image, optimize it:
- Use WebP format
- Compress to <50KB
- Provide @2x for retina displays

## Accessibility

### Screen Readers
Add ARIA labels:

```tsx
<div 
  role="status" 
  aria-live="polite"
  aria-label="Loading application"
>
```

### Keyboard Navigation
Add skip functionality:

```tsx
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      onComplete();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [onComplete]);
```

### Reduce Motion
Respect user preferences:

```tsx
@media (prefers-reduced-motion: reduce) {
  .animate-* {
    animation: none !important;
    transition: none !important;
  }
}
```

## Troubleshooting

### Splash Doesn't Disappear
- Check `onComplete` callback is called
- Verify `showSplash` state updates
- Check console for errors

### Animations Laggy
- Reduce particle count
- Simplify animations
- Use `will-change` CSS property
- Check device performance

### Progress Bar Stuck
- Verify interval is cleared
- Check progress increment logic
- Ensure `onComplete` is called at 100%

## Best Practices

1. **Keep it Short**: 2-4 seconds maximum
2. **Show Progress**: Always indicate loading progress
3. **Brand Consistency**: Use brand colors and logo
4. **Smooth Transition**: Fade out smoothly to main app
5. **Skip Option**: Allow users to skip if desired
6. **Accessibility**: Support keyboard and screen readers
7. **Performance**: Optimize for low-end devices
8. **Testing**: Test on various devices and connections

---

**Component File**: `/components/SplashScreen.tsx`  
**Dependencies**: `motion/react`, `lucide-react`  
**Last Updated**: 3 Februari 2026  
**Version**: 1.0.0
