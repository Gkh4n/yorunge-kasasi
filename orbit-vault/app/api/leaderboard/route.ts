import { env } from 'cloudflare:workers';
import { leaderboard } from '@/lib/league';

export async function GET(request: Request) {
  return leaderboard(request, env.DB);
}
