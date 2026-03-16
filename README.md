# Rahul Ballal - Resume Website

A professional resume website showcasing engineering leadership experience and technical expertise.

## 🚀 Features

- **Responsive Design**: Optimized for desktop, iPad, and iPhone viewing
- **Accessible**: WCAG AA compliant color palette and semantic HTML
- **Modern CSS**: Clean, professional styling with CSS Grid and Flexbox
- **Print-Friendly**: Optimized styles for printing
- **Fast Loading**: Lightweight HTML/CSS with no external dependencies

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (with CSS Grid & Flexbox)
- **Build Tools**: Node.js for development server
- **Validation**: HTML validation and linting tools
- **Deployment**: GitHub Pages with automated CI/CD

## 🚀 Development & Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use the start command
npm start
```

### Building for Production
```bash
# Build the site for GitHub Pages
npm run build

# Preview the built site locally
npm run deploy-preview

# Build specifically for GitHub Pages deployment
npm run build:gh-pages
```

### Available Scripts
- `npm start` - Start development server on port 3000
- `npm run dev` - Start development server with cache disabled
- `npm run build` - Build the site for production
- `npm run build:gh-pages` - Build and prepare for GitHub Pages
- `npm run serve:dist` - Serve the built site locally
- `npm run lint:html` - Lint HTML for errors
- `npm run validate` - Validate HTML structure

### GitHub Pages Deployment
The site is automatically deployed to GitHub Pages when changes are pushed to the main/master branch using GitHub Actions. The workflow:

1. Installs Node.js dependencies
2. Builds the site using `npm run build`
3. Validates HTML structure
4. Deploys to GitHub Pages

## 📱 Responsive Breakpoints

- **Desktop**: Default layout (800px max-width)
- **Tablet**: 768px and below (iPad portrait)
- **Mobile**: 480px and below (iPhone 16 Pro portrait)

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563eb (accessible contrast)
- **Accent Green**: #059669 (for highlights)
- **Gray Scale**: Various shades for text hierarchy
- **Background**: Clean whites and light grays

### Typography
- **Font Stack**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', etc.)
- **Hierarchy**: Clear heading structure with proper contrast ratios

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm 8+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rahulballal/rahulballal.github.io.git
cd rahulballal.github.io
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

This will start a local server at `http://localhost:3000` with hot reloading disabled for faster development.

### Content Workflow

`raw/resume.md` is the source of truth for your resume content. To regenerate `index.html` from the markdown:

```bash
npm run generate:resume
```

The build pipeline also regenerates `index.html` automatically.

### Production

Serve the production version:
```bash
npm start
```

This opens the resume in your default browser at `http://localhost:3000`.

## 📋 Available Scripts

- `npm start` - Start production server and open in browser
- `npm run dev` - Start development server with cache disabled
- `npm run serve` - Start server on port 8080 (CI/CD friendly)
- `npm run lint:html` - Lint HTML files for best practices
- `npm run validate` - Validate HTML structure and accessibility
- `npm run build` - No build step required (static HTML)

## 🔍 Code Quality

### HTML Validation
```bash
npm run validate
```

### HTML Linting
```bash
npm run lint:html
```

## 📁 Project Structure

```
rahulballal.github.io/
├── index.html          # Main resume page
├── raw/
│   └── resume.md       # Source markdown resume
├── package.json        # Node.js project configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🌐 Deployment

This site is designed to be deployed to GitHub Pages:

1. Push to the `main` branch
2. GitHub Pages will automatically serve `index.html`
3. Available at: `https://rahulballal.github.io`

### Alternative Deployment Options

- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Import project for serverless deployment
- **AWS S3**: Upload files to S3 bucket with static website hosting
- **Any static hosting**: Upload `index.html` and assets

## 📧 Contact

**Rahul Ballal**
- LinkedIn: [linkedin.com/in/meet-rahul-ballal](https://linkedin.com/in/meet-rahul-ballal)
- Location: Melbourne, Australia

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

While this is a personal resume, suggestions for improvements to the code structure, accessibility, or responsive design are welcome via issues or pull requests.
