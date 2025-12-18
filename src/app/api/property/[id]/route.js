import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        // 1. UNWRAP THE PARAMS (The fix for your error)
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // 2. Fetch from your master API
        const res = await fetch(`${baseUrl}/api/hostaway`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Master API unreachable" }, { status: 500 });
        }

        const allReviews = await res.json();

        // 3. Filter with clean strings
        const filtered = allReviews.filter(r =>
            String(r.id).trim() === String(id).trim()
        );

        console.log(`Found ${filtered.length} approved reviews for property ID: ${id}`);

        return NextResponse.json(filtered);
    } catch (error) {
        console.error("Property API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}