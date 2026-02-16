import { NextResponse } from 'next/server';
import { deleteAuthCookie } from '@/lib/auth/cookie';

export async function POST() {
  try {
    await deleteAuthCookie();
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}
