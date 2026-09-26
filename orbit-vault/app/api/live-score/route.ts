import { env } from 'cloudflare:workers';
import { liveScore } from '@/lib/league';

export async function POST(request: Request) {
  return liveScore(request, env.DB);
}
