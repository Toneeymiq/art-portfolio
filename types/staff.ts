export interface StaffMember {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
    bio?: string;
    order: number; // For sorting in display
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
