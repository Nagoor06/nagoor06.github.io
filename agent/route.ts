// Sites / Vinext route adapter. Place at app/api/portfolio-agent/route.ts
// Copy server.mjs and knowledge.mjs to app/api/portfolio-agent alongside it.
import { env } from 'cloudflare:workers';
import { handleAgent } from './server.mjs';
export const dynamic = 'force-dynamic';
export const POST = (request: Request) => handleAgent(request, env);
export const OPTIONS = (request: Request) => handleAgent(request, env);
