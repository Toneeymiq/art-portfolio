import { NextRequest, NextResponse } from 'next/server';
import { getCommissionInfo, updateCommissionInfo } from '@/lib/db';

export async function GET() {
    try {
        const info = await getCommissionInfo();

        if (!info) {
            // Return default empty structure if not set
            return NextResponse.json({
                id: 'commission_info',
                servicesOffered: [],
                workflowDescription: '',
                pricingNotes: '',
                turnaroundTime: '',
                paymentMethods: '',
                status: 'inactive',
                updatedAt: new Date(),
            });
        }

        return NextResponse.json(info);
    } catch (error) {
        console.error('Error fetching commission info:', error);
        return NextResponse.json(
            { error: 'Failed to fetch commission info' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        await updateCommissionInfo({
            servicesOffered: body.servicesOffered || [],
            workflowDescription: body.workflowDescription || '',
            pricingNotes: body.pricingNotes || '',
            turnaroundTime: body.turnaroundTime || '',
            paymentMethods: body.paymentMethods || '',
            status: body.status || 'inactive',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating commission info:', error);
        return NextResponse.json(
            { error: 'Failed to update commission info' },
            { status: 500 }
        );
    }
}
