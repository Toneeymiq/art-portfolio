import { NextRequest, NextResponse } from 'next/server';
import { updateContactMessageStatus, deleteContactMessage, getContactMessageById } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const message = await getContactMessageById(id);
        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        if (!body.status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        await updateContactMessageStatus(id, body.status);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating message status:', error);
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteContactMessage(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
