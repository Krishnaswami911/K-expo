# Pulse Events – Responsive Event Management Website

A responsive website to explore upcoming events, view details and register. Built with **HTML5, CSS3 and vanilla JavaScript** (no frameworks).

**Live site:** _add your Netlify / Vercel / GitHub Pages link here_

## Features
- Hero section with a live countdown to the next event
- Event cards with name, date, venue, category and short description
- Search by keyword and filter by category
- Event detail pop-up with a Register button
- Registration form (name, email, phone, event) with JavaScript validation
- Confirmation message after successful registration
- Dark / light mode (remembers your choice)
- Registrations saved in Local Storage, viewable and cancellable under "My registrations"
- Responsive layout for mobile, tablet and desktop; keyboard accessible

## Validation rules
| Field | Rule |
|---|---|
| Name | Letters, spaces, `.` `'` `-`, at least 2 characters |
| Email | Standard `name@domain.tld` format |
| Phone | 10 digits starting with 6–9 |
| Event | Must be selected |
| Duplicate | Same email cannot register twice for the same event |

## How it works
- `index.html` – page structure and dialogs (`<dialog>` element)
- `style.css` – design tokens as CSS variables, grid layout, dark theme, media queries
- `script.js` – event data array, rendering, search/filter, validation, Local Storage, countdown

## Run locally
Open `index.html` in a browser, or use the VS Code "Live Server" extension.

## Deploy
1. Push to GitHub: `git init`, `git add .`, `git commit -m "Initial commit"`, `git remote add origin <repo-url>`, `git push -u origin main`
2. Netlify/Vercel: import the repo (no build command needed). GitHub Pages: Settings → Pages → deploy from `main` branch.

## Customising
Edit the `EVENTS` array at the top of `script.js` to add events or change dates.
