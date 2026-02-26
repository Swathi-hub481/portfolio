# Developer Portfolio

A personal portfolio website for **Swathi Mamidi** to showcase projects, skills, certificates, resume, and contact details.

## Highlights

- Responsive, modern multi-section portfolio UI
- Dedicated pages for projects, resume, and certificates
- Theme toggle and interactive front-end behavior
- Simple Node.js static server for local development

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Node.js (`http` module)

## Project Structure

- `index.html` – main landing page
- `projects.html` – projects page
- `resume.html` – resume page
- `certificates.html` – certificates page
- `404.html` – custom 404 page
- `style.css` – global styles
- `script.js`, `projects-script.js`, `resume-script.js`, `404-script.js` – page scripts
- `server.js` – local static server
- `assets/` – images and resume files

## Run Locally

### Prerequisite

- Node.js installed

### Steps

1. Open terminal in the project folder.
2. Start the server:

```bash
node server.js
```

3. Open in browser:

```text
http://localhost:3000
```

## Deploy on GitHub Pages

### Option 1: Simple (No build step)

1. Push your latest code to the `main` branch.
2. Open your repository on GitHub.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose:
	- **Source**: `Deploy from a branch`
	- **Branch**: `main`
	- **Folder**: `/ (root)`
5. Click **Save**.

After deployment, your site will be available at:

```text
https://swathi-hub481.github.io/portfolio/
```

### Important note for this project

If your internal links start with `/` (absolute paths), they may break on GitHub Pages project URLs.
Prefer relative links like `index.html`, `projects.html`, and `assets/...` for best compatibility.

## Author

- **Swathi Mamidi**
- GitHub: https://github.com/Swathi-hub481
- LinkedIn: https://www.linkedin.com/in/swathi-mamidi-7751a12b3
