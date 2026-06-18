---
version: 1.0
name: AI47-design
Description: "AI-powered document editor with Figma-inspired clean aesthetic. Black-and-white core UI with vibrant pastel color blocks for different functional areas. Editor-focused with professional tools aesthetic."

colors:
  # Core monochrome
  primary: "#000000"
  on-primary: "#ffffff"
  canvas: "#ffffff"
  ink: "#000000"
  surface-soft: "#f7f7f5"
  hairline: "#e6e6e6"
  hairline-soft: "#f1f1f1"
  
  # Color blocks for different areas
  block-editor: "#f7f7f5"      # Editor area - warm white
  block-ai: "#c5b0f4"         # AI panel - lilac
  block-ocr: "#c8e6cd"        # OCR panel - mint
  block-tools: "#dceeb1"      # Tools panel - lime
  block-settings: "#f4ecd6"     # Settings - cream
  
  # Accents
  accent-ai: "#7c3aed"        # AI actions - purple
  accent-ocr: "#16a34a"       # OCR actions - green
  accent-export: "#dc2626"     # Export - red
  accent-success: "#1ea64a"
  accent-error: "#dc2626"
  
  # Semantic
  text-primary: "#000000"
  text-secondary: "#6b7280"
  text-inverse: "#ffffff"

typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  
  subhead:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.4
  
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  
  caption:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.05em"
    textTransform: "uppercase"
  
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1

rounded:
  xs: "2px"
  sm: "6px"
  md: "8px"
  lg: "16px"
  xl: "24px"
  pill: "50px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"

shadows:
  sm: "0 1px 2px rgba(0,0,0,0.05)"
  md: "0 4px 6px rgba(0,0,0,0.07)"
  lg: "0 10px 15px rgba(0,0,0,0.1)"
  
  # Editor specific
  canvas: "0 2px 8px rgba(0,0,0,0.08)"
  panel: "-4px 0 20px rgba(0,0,0,0.05)"

components:
  # Header
  header:
    background: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    height: "56px"
    padding: "0 {spacing.lg}"
  
  # Editor canvas
  editor-canvas:
    background: "{colors.block-editor}"
    shadow: "{shadows.canvas}"
    rounded: "{rounded.lg}"
  
  # Side panels
  panel-ai:
    background: "{colors.block-ai}"
    text: "{colors.text-primary}"
    rounded: "{rounded.lg} 0 0 {rounded.lg}"
    padding: "{spacing.lg}"
  
  panel-ocr:
    background: "{colors.block-ocr}"
    text: "{colors.text-primary}"
    rounded: "{rounded.lg} 0 0 {rounded.lg}"
    padding: "{spacing.lg}"
  
  # Buttons
  button-primary:
    background: "{colors.primary}"
    text: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    font: "{typography.button}"
  
  button-secondary:
    background: "{colors.canvas}"
    text: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    font: "{typography.button}"
  
  button-ai:
    background: "{colors.accent-ai}"
    text: "{colors.text-inverse}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    font: "{typography.button}"
  
  button-ocr:
    background: "{colors.accent-ocr}"
    text: "{colors.text-inverse}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    font: "{typography.button}"
  
  # Cards
  card:
    background: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    shadow: "{shadows.sm}"
  
  # Form elements
  input:
    background: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    font: "{typography.body}"
  
  select:
    background: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    font: "{typography.body}"
  
  # Canvas controls
  tool-button:
    background: "transparent"
    text: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    size: "36px"
    
    hover:
      background: "{colors.surface-soft}"
    
    active:
      background: "{colors.primary}"
      text: "{colors.text-inverse}"
  
  # Status badges
  badge-processing:
    background: "{colors.block-ai}"
    text: "{colors.accent-ai}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    font: "{typography.caption}"
  
  badge-success:
    background: "{colors.block-ocr}"
    text: "{colors.accent-ocr}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    font: "{typography.caption}"

---

# AI47 Design System

## Overview

AI47 uses a **Figma-inspired** clean aesthetic with:
- **Monochrome core**: Black text on white canvas
- **Pastel color blocks**: Lilac (AI), Mint (OCR), Lime (Tools), Cream (Settings)
- **Pill buttons**: All CTAs are rounded pills
- **Professional density**: Editor-focused spacing

## Colors

### Core
- **Canvas**: Pure white (#ffffff) — main background
- **Primary**: Pure black (#000000) — primary actions, text
- **Surface Soft**: Warm off-white (#f7f7f5) — subtle backgrounds

### Color Blocks (by function)
- **Block AI**: Lilac (#c5b0f4) — AI panel background
- **Block OCR**: Mint (#c8e6cd) — OCR panel background  
- **Block Tools**: Lime (#dceeb1) — Tools panel background
- **Block Settings**: Cream (#f4ecd6) — Settings panel background

### Accents
- **AI Actions**: Purple (#7c3aed)
- **OCR Actions**: Green (#16a34a)
- **Export**: Red (#dc2626)
- **Success**: Green (#1ea64a)
- **Error**: Red (#dc2626)

## Typography

### Font Stack
- **Primary**: Inter (or system-ui fallback)
- **Mono**: JetBrains Mono for captions, labels

### Scale
- **Display**: 48px / 600 weight — hero headlines
- **Headline**: 24px / 600 weight — section titles
- **Subhead**: 18px / 500 weight — panel headers
- **Body**: 14px / 400 weight — default text
- **Caption**: 11px / 500 weight / uppercase — labels

## Components

### Header
- Height: 56px
- White background with subtle bottom border
- Logo + file name + action buttons (AI 🤖, OCR 📄)

### Editor Canvas
- Warm off-white background (#f7f7f5)
- Subtle shadow for depth
- Rounded corners (16px)
- Centered content

### Side Panels
- Slide in from right
- Color-coded by function:
  - AI: Lilac background
  - OCR: Mint background
- Rounded left corners (16px)
- 24px padding

### Buttons
- **Primary**: Black pill with white text
- **Secondary**: White pill with black text, subtle border
- **AI**: Purple pill
- **OCR**: Green pill
- All have 10px 20px padding, fully rounded

### Tool Buttons
- 36px square, rounded (8px)
- Transparent background
- Gray icon
- Hover: Light gray background
- Active: Black background, white icon

## Layout

### Spacing
- Base unit: 8px
- Compact: 4px (toolbars)
- Standard: 16px (cards, sections)
- Generous: 24px (panels)

### Shadows
- **Canvas**: 0 2px 8px rgba(0,0,0,0.08)
- **Panels**: -4px 0 20px rgba(0,0,0,0.05)
- **Cards**: 0 1px 2px rgba(0,0,0,0.05)

## Interactions

### Hover States
- Buttons: Slight opacity change (0.9)
- Tool buttons: Background fill
- Cards: Subtle shadow increase

### Active States
- Tool buttons: Inverted (black bg, white icon)
- Panel buttons: Color-matched to panel

## Do's and Don'ts

### Do
- Use color blocks for functional panels
- Keep the editor canvas clean and neutral
- Use pill buttons for all CTAs
- Reserve accent colors for their designated functions

### Don't
- Add shadows to color blocks
- Use more than one accent color per section
- Use square buttons
- Clutter the canvas with UI chrome
