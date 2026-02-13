import { NextResponse } from 'next/server';
import { getAuthCookie } from '@/lib/auth/cookie';

export async function GET() {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json(
        { message: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Decode token to get user info (simple JWT decode without verification)
    // In production, you might want to verify the token or call ms-users to validate
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { message: 'Sessão inválida' },
      { status: 401 }
    );
  }
}
