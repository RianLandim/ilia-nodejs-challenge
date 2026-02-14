import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookie";
import type { Transaction } from "@/types";

export async function GET() {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    // Get all transactions
    const response = await fetch(`${process.env.MS_WALLET_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const transactions = (await response.json()) as Transaction[];

    const balance = transactions.reduce((acc: number, transaction: Transaction) => {
      if (transaction.type === "CREDIT") {
        return acc + transaction.amount;
      } else {
        return acc - transaction.amount;
      }
    }, 0);

    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Get balance error:", error);
    return NextResponse.json({ message: "Erro ao buscar saldo" }, { status: 500 });
  }
}
