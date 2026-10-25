# Nagoor Veeraboina — Portfolio

A responsive, accessible portfolio for Python, AI application engineering, and backend roles. Built with HTML, CSS, and JavaScript; no framework build or secret keys are needed.

## Features

- Interactive canvas AI workflow visual, with reduced-motion support
- Logic Lens code walkthrough and detailed project notes
- CommuteCircle map concept, clearly marked as in development
- IEEE publication, research and professional experience
- Downloadable resume, working social links and copy-email action
- Sticky navigation with an active-section indicator and keyboard-friendly mobile menu
- Keyboard-accessible dialogs, review tabs, and horizontally scrollable code sample
- Consistent body text, clear hover/focus states, and layouts for narrow screens
- Pausable artwork; rendering stops off screen, in hidden tabs, and for reduced motion
- Self-hosted fonts, social icons, and assets; no third-party asset requests

## Local preview

Serve this directory with any static HTTP server. For example, `python3 -m http.server 8000`, then open `http://localhost:8000`.

## GitHub Pages

This is intended for the public `Nagoor06/nagoor06.github.io` repository. In **Settings → Pages**, choose **Deploy from a branch**, **v1.1**, and **/(root)**. The `.nojekyll` file preserves the buildless static site.

## Editing

- `index.html`: copy, links, project notes, and metadata
- `styles.css`: design, layout, responsiveness, and motion
- `app.js`: interactions, accessibility, and canvas artwork
- `assets/`: fonts, social preview, favicon, and resume

CommuteCircle is presented as work in progress. Its map and phone are portfolio concept illustrations, not screenshots of a released product. Logic Lens's RAG feature is optional and depends on its deployment configuration. Performance numbers are the resume's user-supplied figures, not portfolio benchmarks.

Fonts: Manrope and Instrument Serif are redistributed under the SIL Open Font License; the license texts are included in `assets/`.

© Nagoor Veeraboina. Portfolio content and visual design.


## v1.1 maintenance

The stylesheet is organized as base component rules followed by four responsive breakpoints. Avoid appending competing typography overrides: edit the component or the relevant breakpoint directly. The mobile menu and email-link behavior share a 760px breakpoint.

GitHub Pages publishes the repository root of `v1.1`. No build command, Node dependencies, environment variables, or backend are required. Email links open a compose window; the portfolio does not send email itself.

The GitHub and LinkedIn icons are from Bootstrap Icons (MIT), and the LeetCode icon is from Simple Icons (CC0). See `assets/icons-LICENSE.txt`.
