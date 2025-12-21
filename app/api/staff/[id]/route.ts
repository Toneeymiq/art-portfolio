import { NextRequest, NextResponse } from 'next/server';
import { getStaffMemberById, updateStaffMember, deleteStaffMember } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const member = await getStaffMemberById(id);

        if (!member) {
            return NextResponse.json(
                { error: 'Staff member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error fetching staff member:', error);
        return NextResponse.json(
            { error: 'Failed to fetch staff member' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const existing = await getStaffMemberById(id);
        if (!existing) {
            return NextResponse.json(
                { error: 'Staff member not found' },
                { status: 404 }
            );
        }

        await updateStaffMember(id, body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating staff member:', error);
        return NextResponse.json(
            { error: 'Failed to update staff member' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const existing = await getStaffMemberById(id);
        if (!existing) {
            return NextResponse.json(
                { error: 'Staff member not found' },
                { status: 404 }
            );
        }

        await deleteStaffMember(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting staff member:', error);
        return NextResponse.json(
            { error: 'Failed to delete staff member' },
            { status: 500 }
        );
    }
}
