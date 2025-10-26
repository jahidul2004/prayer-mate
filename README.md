# Prayer Mate

Prayer Mate is a lightweight, client-side React app built with Vite that helps users track prayer times, qibla direction, notifications, and other helpful features for daily worship. This repository contains the source code, assets, and routes for the single-page app.

## Table of contents

-   Project overview
-   Key features
-   Screens & Mockups (stylish grid)
-   Quick start
-   Development
-   Build & Deploy
-   Contributing
-   License

## Project overview

This app is implemented with React + Vite and organized in a small, focused structure. The notable directories are:

-   `src/` — source files (components, pages, router, styles)
-   `public/` — static assets that are served as-is (recommended location for mockup images)
-   `src/pages/` — individual screen components (Home, Qibla, Salah Time, Notifications, Amal, etc.)

The UI aims to be minimal and mobile-friendly. The project is ready for local development and production builds.

## Key features

-   Display prayer times
-   Qibla direction screen
-   Notifications for prayer times
-   Simple routing and layouts
-   Easy to add mockup screenshots for documentation

## Screens & Mockups (stylish gallery)

You can showcase your app screens in a stylish responsive grid inside this README or in any documentation page. Place your mockup images in `public/mockups/` (or `docs/mockups/` if you prefer) and reference them with relative paths.

Example file structure for mockups:

```
public/
	mockups/
		home.png
		qibla.png
		salah-time.png
		notifications.png
```

HTML-based responsive grid (works on GitHub README and most markdown viewers):

<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px; align-items:start;">
	<div style="text-align:center;">
		<img src="https://i.ibb.co.com/RLydRWx/HomePage.png" alt="Home screen" style="width:100%; max-width:420px; border-radius:12px; box-shadow:0 8px 24px rgba(2,6,23,0.12);" />
		<div style="margin-top:8px; font-weight:600; color:#111">Home</div>
	</div>
	<div style="text-align:center;">
		<img src="https://i.ibb.co.com/CpDRjVGM/Qibla-Finder-Page.png" alt="Qibla screen" style="width:100%; max-width:420px; border-radius:12px; box-shadow:0 8px 24px rgba(2,6,23,0.12);" />
		<div style="margin-top:8px; font-weight:600; color:#111">Qibla</div>
	</div>
	<div style="text-align:center;">
		<img src="https://i.ibb.co.com/7djFFm6m/Salah-Time-Page.png" alt="Salah Time" style="width:100%; max-width:420px; border-radius:12px; box-shadow:0 8px 24px rgba(2,6,23,0.12);" />
		<div style="margin-top:8px; font-weight:600; color:#111">Salah Time</div>
	</div>
	<div style="text-align:center;">
		<img src="https://i.ibb.co.com/JRst2G23/Notification-Page.png" alt="Notifications" style="width:100%; max-width:420px; border-radius:12px; box-shadow:0 8px 24px rgba(2,6,23,0.12);" />
		<div style="margin-top:8px; font-weight:600; color:#111">Notifications</div>
	</div>
	<div style="text-align:center;">
		<img src="https://i.ibb.co.com/ShXxStF/Doa-Jikr-Page.png" alt="Notifications" style="width:100%; max-width:420px; border-radius:12px; box-shadow:0 8px 24px rgba(2,6,23,0.12);" />
		<div style="margin-top:8px; font-weight:600; color:#111">Notifications</div>
	</div>
</div>

Notes:

-   Use `./public/mockups/your-file.png` for README display within the repository. When the site is hosted, images in `public/` are typically served from the root (e.g. `/mockups/home.png`).
-   If you prefer pure Markdown, you can create a simple two-column table of screenshots, but the HTML grid above is more flexible and responsive.

Markdown table alternative (less flexible):

|                               Home | Qibla                                |
| ---------------------------------: | :----------------------------------- |
| ![Home](./public/mockups/home.png) | ![Qibla](./public/mockups/qibla.png) |

## Quick start

Requirements: Node.js (16+ recommended) and npm or pnpm.

Install dependencies and run locally:

```pwsh
# install
npm install

# start dev server
npm run dev
```

Open http://localhost:5173 (or the port Vite prints) to preview the app.

## Development

-   Source: `src/` — edit pages and components here.
-   Routing: `src/Router/router.jsx` — check the routes and add new pages as needed.

Useful scripts in `package.json`:

-   `npm run dev` — start the development server
-   `npm run build` — create a production build
-   `npm run preview` — locally preview the production build

## Build & Deploy

Create a production build and deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, Firebase Hosting, etc.):

```pwsh
npm run build
# then deploy contents of dist/
```

If you host using the Vite default settings and place mockups in `public/mockups/`, they will be served at `/mockups/<filename>` after deployment.

## How to add or update mockups (step-by-step)

1. Create the folder `public/mockups/` if it doesn't exist.
2. Add your screen images (PNG, JPG, or WebP). Prefer a consistent size/aspect ratio for a clean gallery.
3. Update this README (or any documentation page) to reference the images using the paths shown above.
4. Commit and push — the gallery will render on GitHub and in your hosted docs.

Tips:

-   Use 3–4 mockups per row for a balanced layout. The provided grid is responsive and will adjust for mobile.
-   Use subtle shadows, rounded corners, and consistent paddings for a modern look.

## Contributing

Contributions, issues and feature requests are welcome. For code changes:

1. Fork the repository
2. Create a feature branch
3. Run the app and add tests if relevant
4. Open a pull request with a clear description

## License

This project is open-source. Add your preferred license file (`LICENSE`) or update this section with the chosen license.

## Contact

If you'd like help working on the project or want feedback on UI/UX, open an issue or reach out in the repository.

---

If you want, I can also:

-   Add a `docs/mockups/` directory and create a lightweight HTML preview page for the gallery.
-   Generate a small script that scans `public/mockups/` and inserts a gallery snippet into `README.md` automatically.

Tell me which of the extras you'd like and I'll apply them.
