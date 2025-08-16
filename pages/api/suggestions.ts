import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSuggestions } from '../../src/services/suggestions';
import { setTelemetryEnabled } from '../../src/lib/telemetry';

// Simple Next.js API route that surfaces suggestions for a given product text.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productText = '', preview = false, telemetryOptIn = false } = req.body || {};

    // The telemetry module is process-global; respect user's opt-in for this request.
    setTelemetryEnabled(!!telemetryOptIn);

    const suggestions = await generateSuggestions(String(productText), { preview, telemetryOptIn });

    // Do not leak internal telemetry state in responses.
    return res.status(200).json({ suggestions });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('suggestions API error', err);
    return res.status(500).json({ error: 'Failed to generate suggestions' });
  }
}
