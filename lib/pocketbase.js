// lib/pocketbase.ts
import PocketBase from 'pocketbase';

export const pb = new PocketBase(
  process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090'
);
