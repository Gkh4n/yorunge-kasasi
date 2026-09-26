import { env } from 'cloudflare:workers';
import { accountStatus } from '@/lib/league';

export async function POST(request: Request) {
  return accountStatus(request, env.DB);
}
