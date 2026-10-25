# Portfolio assistant — staged integration

**Status:** source and interface prepared; live AI activation is pending. The main portfolio does not load these files. `preview.html` is an explicitly labelled design preview with disabled live requests. Its optional example-answer layout is authored sample content.

## Two places in the portfolio

1. **Ask about Nagoor:** a grounded assistant for projects, experience, research and next steps. Source links point to the portfolio, public project source or IEEE paper.
2. **Role fit:** a separate recruiter section accepting a job description and returning relevant evidence plus missing or unverified requirements. No numerical hiring score or automatic hiring recommendation.

The existing contact form remains the explicit message-delivery path. The assistant can link visitors to it, but cannot claim messages were delivered, book meetings, negotiate salary or make commitments on Nagoor's behalf.

## Server activation

GitHub Pages serves the portfolio's static UI. The model key must live on a separate server.

- Enable OpenAI Developers in ChatGPT and follow its API-key approval flow. Do not paste API keys into chat or commit them.
- Prepare a Sites Vinext backend using its standard workflow. Copy `route.ts`, `server.mjs`, and `knowledge.mjs` into `app/api/portfolio-agent/`.
- Add the `agent_quota` table through a tracked D1 schema migration derived from `schema.sql`; bind the database as `DB`.
- Set `OPENAI_API_KEY` as a server secret. Optional runtime settings are `OPENAI_MODEL` (default `gpt-4.1-mini`) and `ALLOWED_ORIGIN` (default `https://nagoor06.github.io`).
- Publish the backend with visitor access suitable for the public portfolio, test real model responses, and set the exact HTTPS endpoint in `data-endpoint`.
- Integrate the assistant dialog and role-fit section into the main portfolio; remove `data-preview`, the preview warning, and example-layout button. Load `assistant.css` and `assistant.js` only when the endpoint is ready.
- Validate real grounded answers for every knowledge topic, role-fit gaps, adversarial instructions, service errors, and rate limits before enabling public entry points.

## Safeguards

- Only the approved facts in `knowledge.mjs` are sent as reference material. No private conversations, personal-memory records, credentials, inbox contents or job-search history are included.
- API input and conversation size limits; 25-second upstream timeout; no automatic retries.
- The model response uses a strict schema. Source IDs are allowlisted and turned into URLs by server code; model-provided URLs are ignored.
- The browser renders answer text with `textContent`, not HTML. AI replies do not execute code or cause side effects.
- CORS restricts browser use to the portfolio; it is not an authentication boundary. Atomic D1 counters enforce six requests per visitor/minute and 100 model calls globally/day. Keep these conservative limits until usage is reviewed. Provider spend limits are a separate account setting.
- IP addresses are not stored in plaintext. The visitor key is hashed with the server secret and day. Chat bodies are not stored by this application; requests use `store:false` at the model provider. Provider retention policies still apply.
- Quota rows include an expiry timestamp. Before long-running production use, configure a bounded scheduled deletion of expired counters.
- The UI tells visitors that requests are processed by OpenAI. Message delivery through FormSubmit remains separately disclosed.

## Checks

```sh
node --test agent/tests/agent.test.mjs
node --check agent/assistant.js
```

Transport tests mock the model and quota dependencies. They do not establish model grounding quality or real provider connectivity. The D1 rate-limit SQL requires an integration check on the deployed runtime.
