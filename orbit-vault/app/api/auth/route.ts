import { env } from 'cloudflare:workers';
import { passwordAuth } from '@/lib/league';

export async function POST(request: Request) {
  return passwordAuth(request, env.DB);
}
