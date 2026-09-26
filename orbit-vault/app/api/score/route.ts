import { env } from 'cloudflare:workers';
import { submitScore } from '@/lib/league';

export async function POST(request: Request) {
  return submitScore(request, env.DB);
}
