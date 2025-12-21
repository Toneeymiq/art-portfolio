import { NextResponse } from 'next/server';
import { seedInitialData } from '@/lib/db';

export async function POST() {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: 'Seeding is not allowed in production' },
            { status: 403 }
        );
    }

    try {
        await seedInitialData();
        return NextResponse.json({ success: true, message: 'Data seeded successfully' });
    } catch (error) {
        console.error('Error seeding data:', error);
        return NextResponse.json(
            { error: 'Failed to seed data' },
            { status: 500 }
        );
    }
}
