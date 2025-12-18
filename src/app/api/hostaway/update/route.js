import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
    const { id, isApproved } = await req.json();
    const filePath = path.join(process.cwd(), 'data', 'reviews.json');

    let data = [];
    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const index = data.findIndex(i => i.id === id);
    if (index > -1) {
        data[index].isApproved = isApproved;
    } else {
        data.push({ id, isApproved });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
}