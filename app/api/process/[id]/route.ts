import { NextRequest, NextResponse } from 'next/server';
import { getProcessEntryById, updateProcessEntry, deleteProcessEntry } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const entry = await getProcessEntryById(id);

        if (!entry) {
            return NextResponse.json(
                { error: 'Process entry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(entry);
    } catch (error) {
        console.error('Error fetching process entry:', error);
        return NextResponse.json(
            { error: 'Failed to fetch process entry' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Check if entry exists
        const existing = await getProcessEntryById(id);
        if (!existing) {
            return NextResponse.json(
                { error: 'Process entry not found' },
                { status: 404 }
            );
        }

        await updateProcessEntry(id, body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating process entry:', error);
        return NextResponse.json(
            { error: 'Failed to update process entry' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Check if entry exists
        const existing = await getProcessEntryById(id);
        if (!existing) {
            return NextResponse.json(
                { error: 'Process entry not found' },
                { status: 404 }
            );
        }

        await deleteProcessEntry(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting process entry:', error);
        return NextResponse.json(
            { error: 'Failed to delete process entry' },
            { status: 500 }
        );
    }
}
