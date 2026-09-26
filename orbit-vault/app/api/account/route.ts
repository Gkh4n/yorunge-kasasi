import { env } from 'cloudflare:workers';
import { accountProfile, deleteAccount } from '@/lib/league';

export async function GET(request: Request) {
  return accountProfile(request, env.DB);
}

export async function DELETE(request: Request) {
  return deleteAccount(request, env.DB);
}

export async function POST(request: Request) {
  return deleteAccount(request, env.DB);
}
