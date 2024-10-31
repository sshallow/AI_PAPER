import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch("http://127.0.0.1:5000/hello1");
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
} 