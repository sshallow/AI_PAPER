import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Forward the request to Flask backend
        const response = await fetch("http://127.0.0.1:5000/api/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        // Set up SSE headers
        const headers = new Headers({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        // Forward the streaming response
        return new Response(response.body, {
            headers: headers,
        });
    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: "Failed to fetch data from chat service" },
            { status: 500 }
        );
    }
} 