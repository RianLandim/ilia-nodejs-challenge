import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookie";

export async function GET() {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const response = await fetch(`${process.env.MS_WALLET_URL}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const data = (await response.json()) as { balance: number };
    return NextResponse.json(data);
  } catch (error) {
    console.error("Get balance error:", error);
    return NextResponse.json(
      { message: "Erro ao buscar saldo" },
      { status: 500 }
    );
  }
}
