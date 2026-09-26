import { env } from 'cloudflare:workers';
import { progression } from '@/lib/league';

export async function POST(request: Request) {
  return progression(request, env.DB);
}
