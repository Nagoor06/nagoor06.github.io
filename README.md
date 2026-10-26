# Nagoor Veeraboina — Portfolio

A responsive, accessible portfolio for Python, AI application engineering, and backend roles. Built with HTML, CSS, and JavaScript; no framework build or secret keys are needed.

## Features

- Interactive canvas AI workflow visual, with reduced-motion support
- Logic Lens code walkthrough and detailed project notes
- CommuteCircle map concept, clearly marked as in development
- IEEE publication, research and professional experience
- Prominent Download Resume button, working social links and copy-email action
- Inline contact form with validation, accessible status messages, a honeypot, and timeout handling
- Single illustrated developer avatar in the hero, plus decorative tech-avatar artwork
- Visual skill groups, visible together on desktop and manually browsable with swipe/arrow controls on narrow screens
- Unobtrusive header that scrolls away, with a visual Explore panel in the header and footer
- Keyboard-accessible dialogs, review tabs, and horizontally scrollable code sample
- Consistent body text, clear hover/focus states, and layouts for narrow screens
- Pausable artwork; rendering stops off screen, in hidden tabs, and for reduced motion
- Self-hosted fonts, social icons, and artwork; the email service is contacted only on submission

## Local preview

Serve this directory with any static HTTP server. For example, `python3 -m http.server 8000`, then open `http://localhost:8000`.

## GitHub Pages

This is intended for the public `Nagoor06/nagoor06.github.io` repository. In **Settings → Pages**, choose **Deploy from a branch**, **v1.1**, and **/(root)**. The `.nojekyll` file preserves the buildless static site.

## Editing

- `index.html`: copy, links, project notes, and metadata
- `styles.css`: design, layout, responsiveness, and motion
- `app.js`: navigation, accessibility, and canvas artwork
- `contact.js`: contact-form request and response handling
- `tests/contact.test.cjs`: message transport regression tests
- `assets/`: fonts, social preview, favicon, and resume

CommuteCircle is presented as work in progress. Its map and phone are portfolio concept illustrations, not screenshots of a released product. Logic Lens's RAG feature is optional and depends on its deployment configuration. Performance numbers are the resume's user-supplied figures, not portfolio benchmarks.

Fonts: Manrope and Instrument Serif are redistributed under the SIL Open Font License; the license texts are included in `assets/`.

© Nagoor Veeraboina. Portfolio content and visual design.


## v1.1 maintenance

The stylesheet is organized as base component rules followed by four responsive breakpoints. Avoid appending competing typography overrides: edit the component or the relevant breakpoint directly. The navigation and email-link behavior use a 760px breakpoint.

GitHub Pages publishes the repository root of `v1.1`. No build command, Node dependencies, environment variables, or backend are required. The contact form uses FormSubmit to forward inquiries; the direct-email links open a compose window.

The GitHub and LinkedIn icons are from Bootstrap Icons (MIT), and the LeetCode icon is from Simple Icons (CC0). See `assets/icons-LICENSE.txt`.

## Contact-form activation and verification

The recipient is `veeraboinanagoor@gmail.com`. FormSubmit requires recipient confirmation on first use. If this address/site has not already been activated, submit a test message from the published site, open FormSubmit's confirmation email (check Spam), and activate it. Submit another test after confirmation to check receipt. Nagoor confirmed successful inbox delivery on 26 October 2026. The form retains activation and error handling for future service changes.

The form stays on the portfolio when JavaScript is enabled. It treats activation responses separately from confirmed submission, preserves the draft after errors or activation requests, prevents duplicate clicks while sending, and times out after 20 seconds. No API key is embedded. A direct email link remains available. Without JavaScript, the native POST uses FormSubmit's confirmation page. Provider-side CAPTCHA behavior is left at its default.

Local transport tests use mocked responses and never send emails:

```sh
node --test tests/contact.test.cjs
```

## Avatar artwork

`assets/tech-avatar-trio.webp` is a 768 × 384 transparent illustration generated with the built-in ImageGen tool, then encoded for web delivery. It appears beside the AI workflow and in the contact section. The generation brief is in `assets/tech-avatar-trio.prompt.md`. The characters are decorative illustrations, not people or endorsements.

## Project exploration

- `enhancements.css` and `enhancements.js` contain the cursor accent, visual Explore panel, shareable project dialogs, and guided Logic Lens sample.
- Project URLs: `/#logic-lens`, `/#commutecircle`, and `/#logic-lens-demo`. Direct links, browser Back/Forward, keyboard navigation, Escape, and project-link copying are supported.
- The 24-second walkthrough is authored illustrative content, not a recording or a live LLM response. It makes no AI request. The standard, duplicate-value, and no-match examples run a local JavaScript equivalent of the displayed Python algorithm.
- Playback starts only on request, pauses when the tab is hidden or the dialog closes, and is disabled under reduced motion. Manual steps remain available.
- The live Logic Lens app requires authentication for actual reviews. Its optional RAG configuration remains accurately described as deployment-dependent.
- Navigation stays in the document flow, with no floating centre menu. Canvas artwork pauses behind dialogs.

## Assistant activation preview

The `agent/` directory contains a separately staged AI assistant and role-fit interface, grounded public-profile data, a server route, and mocked transport tests. It is **not active in the main portfolio**. `agent/preview.html` labels its disabled AI controls and authored example clearly. A secure API credential and a deployed backend are still required. See `agent/README.md` for activation and integration steps.

## Visual skills and avatar

The former automatic skills ribbon and duplicate text toolkit are replaced by one illustrated skills section. Desktop displays all three skill groups together. Narrow screens use native horizontal scroll snapping, swipe, previous/next buttons, and Left/Right/Home/End keyboard controls. There is no automatic playback or Pause control. Skill links retain the relevant project or research destination. `personal.css` and `personal.js` own these components.

`assets/developer-avatar.webp` is a 384 × 384 transparent cartoon developer avatar created with the built-in ImageGen tool. It appears only beside the name at the top of the page. A brief CSS greeting animation finishes after 2.4 seconds and is disabled for reduced-motion preferences. The exact generation brief is in `assets/developer-avatar.prompt.md`. The photographic portrait and its references have been removed from the current published source. Earlier Git history is not rewritten.

The form's implementation caption was removed at Nagoor's request. Submission behavior is unchanged. Successful inbox delivery was confirmed by Nagoor on 26 October 2026.

## Pointer accent

A small ring follows mouse movement on devices with a fine pointer and hover. It preserves the native cursor, subtly expands over links, and hides over editable fields, during dialogs, on keyboard input, and when idle. Animation frames stop when the ring settles. Touch, reduced-motion, and forced-color modes disable the accent.
