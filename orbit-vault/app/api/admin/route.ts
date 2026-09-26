import { env } from 'cloudflare:workers';
import { adminPanel } from '@/lib/league';

export async function POST(request: Request) {
  return adminPanel(request, env.DB);
}
