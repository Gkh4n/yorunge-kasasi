import { env } from 'cloudflare:workers';
import { register } from '@/lib/league';

export async function POST(request: Request) {
  return register(request, env.DB);
}
