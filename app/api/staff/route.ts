import { NextRequest, NextResponse } from 'next/server';
import { getStaffMembers, createStaffMember } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('activeOnly') === 'true';

        const staff = await getStaffMembers({ activeOnly });

        return NextResponse.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json(
            { error: 'Failed to fetch staff members' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.role) {
            return NextResponse.json(
                { error: 'Missing required fields: name, role' },
                { status: 400 }
            );
        }

        const id = await createStaffMember({
            name: body.name,
            role: body.role,
            imageUrl: body.imageUrl || 'https://picsum.photos/200/200?random=staff',
            bio: body.bio || '',
            order: body.order || 999,
            isActive: body.isActive ?? true,
        });

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error('Error creating staff member:', error);
        return NextResponse.json(
            { error: 'Failed to create staff member' },
            { status: 500 }
        );
    }
}
