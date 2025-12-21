export interface CommissionInfo {
    id: string; // Likely a singleton ID like 'main'
    servicesOffered: string[];
    workflowDescription: string;
    pricingNotes: string;
    turnaroundTime: string;
    paymentMethods: string;
    status: 'active' | 'inactive';

    updatedAt: Date;
}
