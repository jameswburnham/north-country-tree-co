import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 1024;

const SYSTEM_PROMPT = `You are a lead-capture assistant for North Country Tree Co., a tree service company in Plattsburgh, NY.

Your job is to (1) answer basic questions about services, service area, and pricing ranges, and (2) capture leads by gathering name, phone, address, and a description of what the customer needs.

SERVICE AREA: Plattsburgh, Saranac, Peru, Morrisonville, Champlain, and surrounding North Country communities.

SERVICES & TYPICAL PRICING:
- Tree Removal: $400–1,500 depending on size and access. Very large or hazardous trees can run higher.
- Emergency Storm Response: 24/7 dispatch, priced case-by-case.
- Trimming & Pruning: $200–600 typical.
- Stump Grinding: $100–300 per stump.
- Lot Clearing: Quoted per property.
- Health Assessments: Free with any service estimate.

EMERGENCY HANDLING: If a tree is on a structure, on a vehicle, blocking a road, or near power lines, immediately direct the customer to call (518) 555-0142 right now. Do not try to schedule them — get them on the phone.

LEAD CAPTURE: Once you've answered their question, ask if they'd like a free quote. If yes, gather name, phone, service address, and a brief description of what they need. After collecting info, confirm: "We'll be in touch within 24 hours." Do not promise specific times.

SCOPE: Only discuss tree services, North Country Tree Co., service area, and pricing. If asked about anything else (other companies, unrelated topics, jokes, code, weather forecasts, etc.), politely redirect: "I'm just here to help with tree service questions — anything I can help with there?"

TONE: Friendly, direct, local. Short responses (1–3 sentences typical). No corporate jargon. No emoji. No markdown formatting — plain text only (no asterisks, bold, italics, headers, or bullet points). The chat widget renders text as-is, so any markdown will show as literal characters.`;

const FALLBACK_MESSAGE =
  "Sorry — I'm having trouble right now. Please call us at (518) 555-0142.";

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return textResponse(
      "The chatbot isn't configured yet. Please call (518) 555-0142.",
      503,
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return textResponse('Invalid JSON', 400);
  }

  const messages = (body.messages ?? []).filter(
    (m): m is ChatMessage =>
      !!m &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.trim().length > 0,
  );

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return textResponse('No user message', 400);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // cache_control on the system prompt is a no-op below the model's
        // 4096-token minimum, but it's free and forward-compatible if the
        // prompt grows.
        const claudeStream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: [
            {
              type: 'text',
              text: SYSTEM_PROMPT,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        for await (const event of claudeStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        // Log server-side; surface a friendly fallback to the user rather
        // than erroring the stream (which the client would render as a
        // generic connection error).
        console.error('[api/chat] Anthropic stream error:', err);
        controller.enqueue(encoder.encode(FALLBACK_MESSAGE));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function textResponse(text: string, status: number) {
  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
