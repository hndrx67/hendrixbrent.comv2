# Hero Section Background Update

## Change Summary

Updated the home page hero section background to use an animated GIF from Mondstadt (Genshin Impact).

## Changes Made

### File: `static/css/styles.css`

**Previous Background:**
```css
background: linear-gradient(135deg, rgba(74, 157, 126, 0.1) 0%, rgba(168, 216, 195, 0.1) 100%);
```

**New Background:**
```css
background-image: url('../bg/mondstadt1.gif');
background-size: cover;
background-position: center;
background-repeat: no-repeat;
```

## Additional Improvements

### Added Overlay for Text Readability
To ensure the hero text remains readable over the GIF background, I added a semi-transparent overlay:

```css
.hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(74, 157, 126, 0.3) 0%, rgba(168, 216, 195, 0.3) 100%);
    z-index: 1;
}

.hero-section > * {
    position: relative;
    z-index: 2;
}
```

This ensures:
- ✅ Text is always readable
- ✅ GIF animation is visible
- ✅ Green tint maintains Venti theme
- ✅ Professional appearance

## File Structure

Make sure the GIF file exists at:
```
Shiloh/
└── static/
    └── bg/
        └── mondstadt1.gif
```

## Visual Result

- **Background:** Animated Mondstadt GIF from Genshin Impact
- **Overlay:** Semi-transparent green gradient (30% opacity)
- **Text:** Fully readable with proper z-index layering
- **Border:** Maintained light green border
- **Border Radius:** 30px rounded corners
- **Animation:** GIF plays continuously in background

## Properties Applied

| Property | Value | Purpose |
|----------|-------|---------|
| `background-image` | `url('../bg/mondstadt1.gif')` | GIF background |
| `background-size` | `cover` | Fill entire hero section |
| `background-position` | `center` | Center the image |
| `background-repeat` | `no-repeat` | Don't tile the image |
| `border-radius` | `30px` | Rounded corners |
| `overflow` | `hidden` | Clip overflow content |

## Browser Compatibility

✅ Chrome/Edge - Full support
✅ Firefox - Full support  
✅ Safari - Full support
✅ Opera - Full support

GIF backgrounds are universally supported across all modern browsers.

## Performance Notes

- GIF files can be large - ensure the file is optimized
- Animated GIFs may impact page load time
- Consider file size optimization if needed
- Recommended: Keep GIF under 5MB for optimal performance

## Testing Checklist

- [ ] Verify GIF file exists at `./static/bg/mondstadt1.gif`
- [ ] Check if GIF animation plays smoothly
- [ ] Confirm text is readable over the background
- [ ] Test on different screen sizes (responsive)
- [ ] Verify rounded corners display correctly
- [ ] Check border visibility
- [ ] Ensure overlay doesn't make GIF too dark

## Customization Options

If you want to adjust the overlay opacity:

**Lighter overlay (more GIF visible):**
```css
background: linear-gradient(135deg, rgba(74, 157, 126, 0.2) 0%, rgba(168, 216, 195, 0.2) 100%);
```

**Darker overlay (better text readability):**
```css
background: linear-gradient(135deg, rgba(74, 157, 126, 0.4) 0%, rgba(168, 216, 195, 0.4) 100%);
```

**No overlay (full GIF visibility):**
Remove the `.hero-section::before` block entirely.

---

**Background successfully updated to use Mondstadt GIF!** 🎨✨
