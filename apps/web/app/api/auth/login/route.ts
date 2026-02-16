import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth/cookie';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${process.env.MS_USERS_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Set cookie with token
    await setAuthCookie(data.access_token);

    // Return only user data (not the token)
    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}
