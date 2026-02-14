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

    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    const userId = payload.sub;

    // Buscar dados completos do usuário no ms-users
    const response = await fetch(
      `${process.env.MS_USERS_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        user: {
          id: userId,
          email: payload.email ?? '',
          first_name: '',
          last_name: '',
        },
      });
    }

    const data = await response.json();
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Session error:', error);
    const token = await getAuthCookie();
    if (token) {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString()
        );
        return NextResponse.json({
          user: {
            id: payload.sub,
            email: payload.email ?? '',
            first_name: '',
            last_name: '',
          },
        });
      } catch {
        // fallthrough to 401
      }
    }
    return NextResponse.json(
      { message: 'Sessão inválida' },
      { status: 401 }
    );
  }
}
