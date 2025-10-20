# Morphology: Structure & Formation of Words
## Genshin Impact (Venti) Themed Educational Website

A beautifully designed, interactive educational website about morphology with a Genshin Impact theme, specifically inspired by Venti and the Anemo (wind) element.

## 🎨 Theme
- **Character Inspiration**: Venti from Genshin Impact
- **Color Scheme**: Green/Teal theme inspired by Anemo element
- **Visual Style**: Elegant, wind-themed with smooth animations

## 📁 Project Structure

```
Shiloh/
├── index.html                          # Home page
├── learning-objectives.html            # Learning objectives page
├── morpheme-types.html                 # Morpheme types comparison
├── examples.html                       # Language examples
├── activity.html                       # Interactive activity
├── conclusion.html                     # Conclusion page
├── README.md                           # This file
└── static/
    ├── css/
    │   ├── styles.css                  # Main stylesheet (Venti theme)
    │   └── loader.css                  # Loading animation styles
    ├── js/
    │   └── main.js                     # JavaScript functionality
    ├── audio/
    │   ├── README.md                   # Audio instructions
    │   └── background-music.mp3        # (Add your music here)
    ├── images/
    │   ├── README.md                   # Image instructions
    │   └── venti-icon.png              # (Optional: Add Venti icon)
    ├── loaders/
    │   └── genshin-load-screen.scss    # Original SCSS loader
    └── references/
```

## ✨ Features

### 🎵 Music System
- **Background Music Toggle**: Click the music icon in the navbar
- **Persistent State**: Music preference saved across pages
- **Keyboard Shortcut**: Press 'M' to toggle music
- Music loops automatically when playing

### 🌀 Loading Animation
- Genshin Impact-style loading bar
- Appears when navigating between pages
- Smooth fade-in/fade-out transitions
- Wind-themed visual effects

### 🎨 Visual Design
- **Venti-inspired green color palette**
- **Animated decorative elements**:
  - Floating wind particles
  - Rotating Anemo symbols
  - Pulsing wind elements
  - Cursor trail effects
- **Responsive design** for mobile and desktop
- **Smooth scroll animations** for content cards

### 🧭 Navigation
- **Top Navbar**: Sticky navigation with all pages
- **Active Page Highlighting**: Current page highlighted in gold
- **Keyboard Navigation**: 
  - Left Arrow: Previous page
  - Right Arrow: Next page
  - M: Toggle music
- **Navigation Buttons**: Previous/Next at bottom of each page

### ♿ Accessibility
- Skip to main content link
- Semantic HTML structure
- Keyboard navigation support
- ARIA-friendly markup

### 📱 Responsive Design
- Mobile-friendly navigation
- Adaptive layouts for all screen sizes
- Touch-friendly interactive elements

## 🚀 Getting Started

### 1. Add Background Music (Optional)
1. Navigate to `static/audio/`
2. Add your music file as `background-music.mp3`
3. Recommended: Use Venti's theme or Mondstadt background music from Genshin Impact

### 2. Add Venti Icon (Optional)
1. Navigate to `static/images/`
2. Add a Venti icon as `venti-icon.png` (40x40px or larger)
3. The website works without it (graceful fallback)

### 3. Open in Browser
Simply open `index.html` in your web browser!

**Recommended browsers**:
- Chrome
- Firefox
- Edge
- Safari

## 📄 Pages Overview

### 1. **Home (index.html)**
- Introduction to morphology
- Beautiful hero section with Anemo symbol
- Overview of what morphology is

### 2. **Learning Objectives**
- Three main learning objectives
- Numbered cards with wind element decorations

### 3. **Morpheme Types**
- Comparison of Free vs Bound morphemes
- Visual "VS" divider
- Clear examples for each type

### 4. **Examples**
- Plural formation (English & Filipino)
- Tense markers (English & Filipino)
- Cebuano vs Ilocano pronoun comparison

### 5. **Activity**
- Interactive morphology table challenge
- Step-by-step instructions
- Floating morpheme tags visualization

### 6. **Conclusion**
- Summary of key concepts
- Wind blessing message
- Return to home button

## 🎮 Interactive Features

### Music Control
- Click the music note icon in the navbar
- Icon changes to show play/pause state
- State persists across page navigation

### Loading Transitions
- Automatic loading screen when navigating
- Genshin Impact-style progress bar
- Smooth fade animations

### Scroll Animations
- Content cards fade in as you scroll
- Smooth reveal effects
- Performance-optimized intersection observer

### Wind Effects
- Ambient wind particles floating across screen
- Cursor trail effects (desktop only)
- Animated decorative elements

## 🎨 Color Palette

```css
Primary Green:   #4a9d7e
Secondary Green: #6bc49d
Dark Green:      #2d6b53
Light Green:     #a8d8c3
Accent Teal:     #5fb9a6
Gold:            #d4af37
Cream:           #f5f3ed
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **Vanilla JavaScript**: No frameworks, pure JS
- **LocalStorage**: For persistent music state
- **Intersection Observer API**: For scroll animations
- **CSS Grid & Flexbox**: Responsive layouts

## 📝 Content Credits

**Lesson Content**: Morphology lesson by Shiloh Bizon
**Design Inspiration**: Genshin Impact (Venti/Anemo theme)
**Loading Animation**: Based on Genshin Impact loading screen

## 🎯 Browser Compatibility

- ✅ Chrome (90+)
- ✅ Firefox (88+)
- ✅ Edge (90+)
- ✅ Safari (14+)
- ⚠️ IE11 (Limited support)

## 💡 Tips

1. **For best experience**: Add background music before opening
2. **Keyboard shortcuts**: Use arrow keys to navigate pages
3. **Music autoplay**: Some browsers block autoplay; click the music icon to start
4. **Mobile**: Landscape orientation recommended for loading animation

## 🐛 Troubleshooting

### Music won't play
- Check if `background-music.mp3` exists in `static/audio/`
- Try clicking the music toggle button (some browsers block autoplay)
- Check browser console for errors

### Loading animation not showing
- Verify `loader.css` is linked in HTML
- Check browser compatibility for filter effects
- Some mobile browsers may not display it in portrait mode

### Pages not loading correctly
- Ensure all files are in the correct directories
- Check that file names match exactly (case-sensitive)
- Verify all HTML files are in the root directory

## 🚀 Future Enhancements

- [ ] Add more interactive activities
- [ ] Quiz system with scoring
- [ ] More wind/Anemo animations
- [ ] Dark mode toggle
- [ ] Save progress feature
- [ ] Printable worksheets

## 📞 Support

If you encounter any issues or have questions, please check:
1. All files are in correct locations
2. File names match exactly
3. Browser is up to date
4. JavaScript is enabled

## 📜 License

This educational website is created for learning purposes. 
Genshin Impact and all related characters are property of miHoYo/HoYoverse.

---

**Enjoy your journey through the world of morphology! May the winds guide you! 🍃**
