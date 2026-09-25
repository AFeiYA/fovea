import { NextResponse } from "next/server";
import { INITIAL_SIGNALS } from "@/data/signals";

export async function GET() {
  return NextResponse.json({
    count: INITIAL_SIGNALS.length,
    signals: INITIAL_SIGNALS,
  });
}
