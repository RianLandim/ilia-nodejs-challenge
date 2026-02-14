import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookie";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const queryString = type ? `?type=${type}` : "";

    const response = await fetch(`${process.env.MS_WALLET_URL}/transactions${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json({ message: "Erro ao buscar transações" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    // Get userId from token
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

    const body = await request.json();

    const response = await fetch(`${process.env.MS_WALLET_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...body,
        userId: payload.sub,
      }),
    });

    const text = await response.text();
    let data: unknown = { success: true };
    if (text.trim()) {
      try {
        data = JSON.parse(text);
      } catch {
        // mantém { success: true }
      }
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json({ message: "Erro ao criar transação" }, { status: 500 });
  }
}
