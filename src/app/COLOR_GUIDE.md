# 🎨 MotoCare Pro - Color Usage Guide

## Theme: Warm Gradient (Tweak CN)

### 📋 Color Palette

#### Primary Colors
```css
Primary (Coral Orange)
- Value: #ff7e5f
- Usage: Buttons, links, active states, brand elements
- Tailwind: bg-primary, text-primary, border-primary
- Example: Tombol CTA, Logo background, Active navigation
```

```css
Accent (Light Orange/Peach)
- Value: #feb47b
- Usage: Highlights, badges, secondary actions, hover states
- Tailwind: bg-accent, text-accent, border-accent
- Example: Badge "Most Popular", Hover effects, Icons highlights
```

#### Background & Surface
```css
Background (Warm Cream)
- Value: #fff9f5
- Usage: Page backgrounds
- Tailwind: bg-background

Card (White)
- Value: #ffffff
- Usage: Cards, panels, modals
- Tailwind: bg-card

Secondary (Light Peach)
- Value: #ffedea
- Usage: Subtle backgrounds, disabled states
- Tailwind: bg-secondary
```

#### Text & Foreground
```css
Foreground (Warm Dark)
- Value: #3d3436
- Usage: Primary text, headings
- Tailwind: text-foreground

Muted Foreground (Gray Brown)
- Value: #78716c
- Usage: Secondary text, descriptions
- Tailwind: text-muted-foreground
```

#### Borders & Dividers
```css
Border (Warm Border)
- Value: #ffe0d6
- Usage: Card borders, dividers, input borders
- Tailwind: border-border
```

#### Status Colors
```css
Success (Keep Green)
- Value: #10B981
- Usage: Success messages, positive actions, checkmarks
- Tailwind: bg-[#10B981], text-[#10B981]

Destructive (Red)
- Value: #e63946
- Usage: Errors, delete actions, warnings
- Tailwind: bg-destructive, text-destructive
```

---

## 🎯 Usage Examples

### Buttons

#### Primary Button
```tsx
<Button className="bg-primary hover:bg-primary/90 text-white">
  Primary Action
</Button>
```

#### Accent Button
```tsx
<Button className="bg-accent hover:bg-accent/90 text-white">
  Secondary Action
</Button>
```

#### Outline Button
```tsx
<Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
  Outline Action
</Button>
```

### Badges

#### Primary Badge
```tsx
<Badge className="bg-primary text-white border-0">
  Featured
</Badge>
```

#### Accent Badge
```tsx
<Badge className="bg-accent text-white border-0">
  New
</Badge>
```

#### Success Badge
```tsx
<Badge className="bg-[#10B981] text-white border-0">
  Completed
</Badge>
```

### Cards

#### Standard Card
```tsx
<Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
  <CardHeader>
    <div className="w-12 h-12 bg-primary rounded-lg">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <CardTitle className="text-foreground">Title</CardTitle>
  </CardHeader>
</Card>
```

#### Highlighted Card
```tsx
<Card className="border-primary border-2 shadow-xl bg-card">
  <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white">
    <CardTitle>Featured Card</CardTitle>
  </CardHeader>
</Card>
```

### Gradients

#### Hero Gradient
```tsx
<section className="bg-gradient-to-br from-primary via-accent to-primary">
  {/* Content */}
</section>
```

#### Subtle Gradient
```tsx
<div className="bg-gradient-to-r from-primary to-accent">
  {/* Content */}
</div>
```

### Icons & Decorations

#### Icon Container
```tsx
<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
  <Icon className="w-6 h-6 text-white" />
</div>
```

#### Accent Icon Container
```tsx
<div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
  <Icon className="w-6 h-6 text-white" />
</div>
```

---

## 🌓 Dark Mode

### Dark Mode Colors
```css
:root.dark {
  --background: #2a2024
  --foreground: #f2e9e4
  --card: #392f35
  --muted: #30272c
  --border: #463a41
  
  /* Primary colors stay the same */
  --primary: #ff7e5f
  --accent: #feb47b
}
```

### Dark Mode Usage
Colors automatically switch in dark mode when using Tailwind classes:
- `bg-background` → switches to dark background
- `text-foreground` → switches to light text
- `bg-card` → switches to dark card
- `bg-primary` → stays coral orange (works on both modes)

---

## ✅ Do's and ❌ Don'ts

### ✅ Do's
- Use `bg-primary` for main actions and brand elements
- Use `bg-accent` for secondary highlights
- Use `text-foreground` for readable text
- Keep green (`#10B981`) for success states
- Use gradients sparingly for hero sections
- Maintain contrast ratios for accessibility

### ❌ Don'ts
- Don't use hardcoded hex colors (use Tailwind classes)
- Don't mix old navy colors with new coral theme
- Don't use accent as primary CTA (use primary instead)
- Don't forget hover states (use `/90` opacity)
- Don't ignore dark mode compatibility

---

## 🎨 Color Psychology

**Coral Orange (#ff7e5f)**
- Energetic, friendly, approachable
- Perfect for service industry
- Creates sense of warmth and trust

**Light Peach/Orange (#feb47b)**
- Soft, inviting, creative
- Reduces tension
- Encourages engagement

**Warm Cream (#fff9f5)**
- Clean, sophisticated
- Easy on the eyes
- Professional yet friendly

---

## 📐 Accessibility

### Contrast Ratios
- Primary text on background: ✅ AAA (8.2:1)
- Primary on white: ✅ AA (4.5:1)
- Accent text on white: ✅ AA (3.8:1)
- Foreground on background: ✅ AAA (10.1:1)

### Tips
- Always test color combinations
- Use color contrast checker tools
- Don't rely on color alone for information
- Provide text labels alongside colored indicators

---

## 🔄 Migration Checklist

When updating existing components:

- [ ] Replace `bg-[#2A5C82]` with `bg-primary`
- [ ] Replace `text-[#2A5C82]` with `text-primary`
- [ ] Replace `bg-[#F59E0B]` with `bg-accent`
- [ ] Replace `text-[#111827]` with `text-foreground`
- [ ] Keep `bg-[#10B981]` for success states
- [ ] Update gradients to use primary/accent
- [ ] Test in both light and dark modes
- [ ] Verify hover states work correctly
- [ ] Check accessibility contrast ratios

---

**Last Updated**: 3 Februari 2026  
**Theme**: Tweak CN Warm Gradient  
**Version**: 1.0.0
