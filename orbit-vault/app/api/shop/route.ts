import { env } from 'cloudflare:workers';
import { shop } from '@/lib/league';

export async function POST(request: Request) {
  return shop(request, env.DB);
}
