# Design System & Resume Site Strategy

A comprehensive guide to the design approach, visual language, and architectural decisions for the Rahul Ballal resume website.

## Overview

This resume site uses an **ANTD (Ant Design)-inspired** aesthetic with a clean, professional component-based approach. The site is auto-generated from `raw/resume.md` using Node.js, ensuring the source of truth stays in markdown while HTML styling is controlled via CSS templates. The design emphasizes clarity, enterprise-grade polish, and elegant simplicity.

## Design Principles

- **Clean & Professional**: ANTD-inspired component styling with subtle shadows, refined borders, and professional polish
- **Card-Based Layout**: Content organized in semantic cards with consistent spacing and shadows
- **Icon Integration**: Section headers enhanced with Unicode emoji icons for visual clarity and quick scanning
- **Skill Badges**: Technical skills presented as clean, interactive tag components with hover states
- **Accessibility**: WCAG AA compliant, semantic HTML, readable typography with refined hierarchy
- **Responsive**: Works seamlessly on desktop (1200px+), tablet (768px), and mobile (480px)
- **Print-Friendly**: Optimized for printing; profile photo hidden in print view, colors removed
- **Lightweight**: No external dependencies, CSS-only styling, fast loading
- **Static**: No animations or interactive elements (supports print and accessibility)

## Layout Architecture

### Hero Section
- **Profile Photo**: Centered circular avatar (160px on desktop, responsive down to 100px on mobile)
- **Photo Styling**: Subtle rgba background with semi-transparent white border for refinement
- **Gradient Background**: Subtle blue gradient (ANTD primary color) for visual interest
- **Name & Title**: Clear h1/h2 hierarchy with refined font weights
- **Contact Info**: Flex-based meta information below title
- **Design**: Gradient background with soft shadows, maintains elegance on all screens

### Content Sections
Major sections (About, Skills, Employment History, Education, Certifications) use:
- **Card Components**: White background cards with subtle borders (#f0f0f0) and soft shadows
- **Section Icons**: Unicode emoji icons paired with h2 headings for visual scanning (👤, 🛠️, 💼, etc.)
- **Skill Badges**: Tag-style components with light gray background, borders, and hover state (color change on hover)
- **Employment Timeline**: Left border accent (3px solid primary blue) on employment items
- **List Bullets**: Custom diamond-shaped bullets (◆) in primary color
- **Typography Hierarchy**: Refined font sizes and weights following ANTD scale (14px base, 16px for subsections)
- **Spacing**: 8px grid system (8, 16, 24, 32px margins/padding)

### Color Palette (ANTD-Inspired)
- **Primary Blue**: #1890ff — main headings, links, icons, borders, section highlights
- **Primary Dark**: #096dd9 — gradient secondary color, hover states
- **Primary Hover**: #40a9ff — link hover color
- **Text Primary**: #000000d9 — body text, main content
- **Text Secondary**: #00000073 — secondary information, metadata
- **Borders**: #d9d9d9 — standard borders
- **Border Light**: #f0f0f0 — subtle card borders, section dividers
- **Background Primary**: #ffffff — card backgrounds, content sections
- **Background Secondary**: #fafafa — page background
- **Background Tertiary**: #f5f5f5 — skill tag backgrounds, highlights
- **Shadows**: Subtle multi-layer ANTD shadows for depth without heaviness

## Typography

- **Font Stack**: System fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`)
- **Hierarchy**:
  - H1 (Name): 2rem, bold, primary color
  - H2 (Section Title): 1.4rem, primary color, underline accent
  - H3 (Subsection): 1.1rem, bold
  - H4 (Category): 1rem, muted color
  - Body: 1rem, text-dark, 1.5 line-height
- **Benefits**: Clean readability, no external font requests

## Responsive Breakpoints

| Breakpoint | Device | Adjustments |
|------------|--------|-------------|
| 1200px+ | Desktop | Full-width sections, optimal spacing |
| 768px–1199px | Tablet | Reduced padding, adjusted font sizes |
| 480px–767px | Mobile | Single-column, condensed spacing, readable text |
| Print | Any | Profile photo hidden, background colors removed, optimized for paper |

## Build Pipeline

The site is built with **Astro** (static site generator). Resume content is parsed from `raw/resume.md` via a custom markdown parser, blog posts live in `src/content/blog/`, and Mermaid diagrams render as inline SVGs at build time (zero JS at runtime).

Run `pnpm run build` to build the site and validate HTML.


## Component Styles

### Skill Tags
- Background: Light gray (#f5f5f5)
- Border: 1px solid #d9d9d9
- Padding: 4px 12px
- Border-radius: 4px
- Font-size: 13px
- Hover: Border color changes to primary blue, text color to primary blue

### Employment Items
- Left border: 3px solid primary blue
- Padding-left: 16px
- No background color (transparent on card background)
- Maintains clear hierarchy with h3 job title, company name, and description

### Section Headers
- Display: Flex with icon + text
- Icon size: 20px
- Icon opacity: 0.8
- Gap: 8px between icon and text
- Color: Primary blue (#1890ff)
- Font-size: 18px
- Font-weight: 500

## Future Enhancements

- Add dark mode variant (CSS custom properties already structured)
- Implement additional semantic colors for skill categories (success green, warning orange, error red)
- Add subtle smooth transitions to skill tag hover states (currently instant)
- Optimize profile photo loading and JPEG compression
- Consider animated gradient backgrounds on hero (if animation becomes acceptable)
- Add breadcrumb or table of contents for long resume sections

## Design Implementation Details

### Icon Mapping
Section icons are mapped via JavaScript for accessibility and easy customization:
- Personal Information: 👤
- About: ℹ️
- Skills: 🛠️
- Leadership & Architecture: 🏗️
- Technical: ⚙️
- Languages: 🌐
- Employment History: 💼
- Education: 🎓
- Certifications: ✓

### Responsive Behavior
The design scales gracefully across breakpoints:
- **Desktop (1200px+)**: Hero padding 48px, cards at full width with 24px gap, photo 160px
- **Tablet (768px)**: Hero padding 32px, reduced card padding 16px, photo 120px
- **Mobile (480px)**: Hero padding 24px, minimal card padding 12px, photo 100px, font-size 13px

### Print Optimization
- Hero section becomes plain white with bottom border divider
- Profile photo hidden with `display: none`
- Card shadows removed (`box-shadow: none`)
- Grid gaps reduced to 12px
- All background colors converted to white (#ffffff)
- Page breaks optimized with `page-break-inside: avoid` on cards and employment items

## Maintenance & Updates

When updating the design:
1. Modify CSS custom properties in `src/styles/global.css` for color/spacing changes
2. Edit Astro layouts in `src/layouts/` for structural changes
3. Update icon mappings in `src/components/Icon.astro` if adding new section types
4. Test on multiple devices: `pnpm run dev` + browser dev tools
5. Test print preview (Cmd+P or Ctrl+P) before committing
6. Run `pnpm run build` to ensure no regressions
7. Update this file if design philosophy or major structure changes
