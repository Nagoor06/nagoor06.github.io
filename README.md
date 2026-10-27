# Nagoor Veeraboina — Portfolio

A personal portfolio focused on Python, AI applications, and applied machine learning. Built with HTML, CSS, and vanilla JavaScript, and published on GitHub Pages.

**[Visit the portfolio](https://nagoor06.github.io/)** · **[Logic Lens live demo](https://logic-lens-five.vercel.app/)** · **[LinkedIn](https://www.linkedin.com/in/nagoor-veeraboina-4b5b82224/)**

## What’s inside

- **Projects:** Logic Lens with a guided code-review example, and CommuteCircle with development notes and concept illustrations.
- **Research:** Android malware detection, the IEEE AIIoT 2024 publication, and an expandable methodology and results section.
- **Experience and skills:** Professional background, education, and illustrated skill groups with swipe and arrow navigation on small screens.
- **Contact:** An inline inquiry form, direct email links, and a downloadable resume.
- **Interaction:** Keyboard-accessible project dialogs, shareable project links, pausable canvas artwork, and reduced-motion support.

The main site needs no build step, package installation, or API credentials. Fonts, icons, and artwork are served from this repository.

## Run locally

Clone the publishing branch and start a static server:

```sh
git clone --branch v1.1 https://github.com/Nagoor06/nagoor06.github.io.git
cd nagoor06.github.io
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). Any static HTTP server can be used instead.

## Repository guide

| File or directory | Purpose |
| --- | --- |
| `index.html` | Page content, project dialogs, links, and metadata |
| `styles.css` | Base design, layout, responsive rules, and motion |
| `app.js` | Core navigation, accessibility, and canvas artwork |
| `enhancements.css` / `enhancements.js` | Explore panel, project walkthrough, shareable dialogs, and pointer accent |
| `personal.css` / `personal.js` | Profile avatar and visual skills navigation |
| `contact.js` | Form submission, validation feedback, and error handling |
| `assets/` | Resume, illustrations, fonts, social images, icons, and license notices |
| `tests/` | Contact transport tests |
| `agent/` | Separate assistant prototype, server source, and tests |
| `robots.txt` / `sitemap.xml` | Search-engine discovery |

## Checks

Run the existing tests with a Node.js version that supports the built-in test runner:

```sh
node --test tests/contact.test.cjs agent/tests/agent.test.mjs
```

The tests mock email and model requests; they do not send messages or call a live AI service. There is no configured build or lint command.

For visual changes, check desktop and mobile layouts, keyboard navigation, reduced motion, project dialogs, and form status messages. Keep the hero’s demo, GitHub, and resume links visible without waiting for animation.

## Publishing and branches

GitHub Pages publishes **`v1.1` → repository root (`/`)**. The `.nojekyll` file keeps the site buildless. The default branch, `main`, is retained separately and is not the current publishing source.

1. Create a short-lived branch from `v1.1`.
2. Make and verify the change, then open a pull request targeting `v1.1`.
3. After merging, check the [Pages deployment](https://github.com/Nagoor06/nagoor06.github.io/actions).
4. Delete the merged work branch after confirming it has no unique commits.

## Contact form

The form forwards inquiries through FormSubmit to `veeraboinanagoor@gmail.com`. Inbox delivery has been confirmed. JavaScript submissions stay on the page, retain the draft on errors, and show an accessible status message; native form submission remains available without JavaScript.

If the recipient changes, update it in both `index.html` and `contact.js`, complete FormSubmit’s recipient confirmation, and verify inbox delivery. Local tests use mocked responses and cannot verify email receipt.

## Assistant prototype

The files in `agent/` are **not loaded by the main portfolio**. They contain an assistant and role-fit preview, public-profile knowledge, and a server implementation. Live AI requires a separately deployed backend and server-side credentials; GitHub Pages does not run that backend.

See [the assistant guide](agent/README.md) for activation and integration details. Keep real environment files and credentials out of Git; the example configuration is safe to track.

## Content and assets

- CommuteCircle’s matching feature remains in development; its map and phone are concept illustrations.
- Logic Lens’s optional RAG feature depends on the app’s deployment configuration. The portfolio walkthrough is an authored example, not a live model response.
- Research values follow the reported paper tables. The on-page study note explains conflicting prose and attributes notebook-specific details to the [research repository](https://github.com/Nagoor06/Android_Malware_Detection). The [IEEE paper](https://ieeexplore.ieee.org/document/10574689/) is linked, not redistributed; `reference/` stays ignored.
- Avatar generation briefs remain alongside the artwork for provenance.
- Manrope and Instrument Serif use the SIL Open Font License. Bootstrap and Simple Icons notices are included in [assets/icons-LICENSE.txt](assets/icons-LICENSE.txt).

© Nagoor Veeraboina. Portfolio content and visual design. Third-party assets retain their respective licenses.
