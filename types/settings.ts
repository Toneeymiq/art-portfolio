// Site-wide editable settings stored in Firestore

export interface ServiceItem {
    icon: string; // Emoji or icon name
    title: string;
    description: string;
}

export interface PricingTier {
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular: boolean;
}

export interface ProcessStep {
    icon: string; // Icon name: 'MessageCircle' | 'Palette' | 'FileImage' etc
    title: string;
    description: string;
}

export interface AboutFocusItem {
    icon: string; // Emoji
    title: string;
    description: string;
}

export interface AboutToolItem {
    name: string;
    icon: string; // Emoji
}

export interface SiteSettings {
    id: string; // Always 'site_settings'

    // Commission Page Settings
    commissionServices: ServiceItem[];
    commissionPricing: PricingTier[];
    commissionProcess: ProcessStep[];
    commissionCTATitle: string;
    commissionCTADescription: string;

    // Process Page Settings
    processPageTitle: string;
    processPageSubtitle: string;
    processOverviewSteps: { icon: string; label: string; desc: string }[];

    // Portfolio Page Settings
    portfolioPageTitle: string;
    portfolioPageSubtitle: string;

    // Posts Page Settings
    postsPageTitle: string;
    postsPageSubtitle: string;

    // About Page Settings
    aboutHeroImage: string;
    aboutHeroTitle: string;
    aboutHeroSubtitle: string;
    aboutProfileImage: string;
    aboutBioTitle: string;
    aboutBioText: string;
    aboutArtisticFocus: AboutFocusItem[];
    aboutTools: AboutToolItem[];

    // General
    siteTitle: string;
    siteDescription: string;
    contactEmail: string;
    socialLinks: { platform: string; url: string }[];

    // Personal Info (editable in CMS)
    artistName: string;
    artistBio: string;
    phoneNumber: string;
    location: string;
    timezone: string;

    updatedAt: Date;
}

// Default settings for seeding
export const defaultSiteSettings: Omit<SiteSettings, 'id' | 'updatedAt'> = {
    commissionServices: [
        { icon: '🎨', title: 'Custom Illustrations', description: 'Unique artwork for personal or commercial use' },
        { icon: '👤', title: 'Character Designs', description: 'Detailed character concepts and portraits' },
        { icon: '🎮', title: 'Concept Art', description: 'Visual development for games and stories' },
        { icon: '📚', title: 'Book Covers', description: 'Eye-catching designs for your publications' },
        { icon: '📣', title: 'Promotional Art', description: 'Marketing materials and brand visuals' },
        { icon: '🖌️', title: 'Digital Paintings', description: 'High-quality digital artwork in various styles' },
    ],
    commissionPricing: [
        {
            name: 'Simple',
            price: '$50',
            description: 'Basic illustrations, simple concepts',
            features: ['1 character/scene', 'Simple background', '2-3 revisions', '1 week delivery'],
            isPopular: false,
        },
        {
            name: 'Detailed',
            price: '$150',
            description: 'Complex artwork, detailed scenes',
            features: ['Multiple elements', 'Detailed backgrounds', '3-5 revisions', '2 weeks delivery'],
            isPopular: true,
        },
        {
            name: 'Premium',
            price: '$300+',
            description: 'High-detail, commercial quality',
            features: ['Commercial license', 'Multiple formats', 'Unlimited revisions', 'Priority support'],
            isPopular: false,
        },
    ],
    commissionProcess: [
        { icon: 'MessageCircle', title: 'Consultation', description: 'Discuss your vision and requirements' },
        { icon: 'Palette', title: 'Creation', description: 'Artwork creation with regular updates' },
        { icon: 'FileImage', title: 'Delivery', description: 'Final files in multiple formats' },
    ],
    commissionCTATitle: 'Ready to Start Your Project?',
    commissionCTADescription: 'Every commission is unique. Let\'s discuss your specific needs and create something amazing together.',

    processPageTitle: 'My Process',
    processPageSubtitle: 'Behind-the-scenes look at how ideas transform into finished artwork',
    processOverviewSteps: [
        { icon: 'Palette', label: 'Concept', desc: 'Initial ideas' },
        { icon: 'Layers', label: 'Sketch', desc: 'Rough drafts' },
        { icon: 'Sparkles', label: 'Refine', desc: 'Detail work' },
        { icon: 'Play', label: 'Final', desc: 'Polished art' },
    ],

    portfolioPageTitle: 'My Portfolio',
    portfolioPageSubtitle: 'A showcase of my artistic journey through various mediums and styles.',

    postsPageTitle: 'Blog & Updates',
    postsPageSubtitle: 'Thoughts, processes, and news from the studio.',

    // About Page Defaults
    aboutHeroImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1920&fit=crop',
    aboutHeroTitle: 'About Me',
    aboutHeroSubtitle: 'Illustrator & Concept Artist based in Nairobi, Kenya',
    aboutProfileImage: '', // User needs to add this
    aboutBioTitle: "Hi, I'm Miqk Niq",
    aboutBioText: "I'm Miqk Niq, an illustrator and concept artist based in Nairobi, Kenya. My work focuses on character-driven illustrations, portraits, and visual storytelling, with an emphasis on expressive detail and strong composition.\n\nI'm drawn to creating characters that feel intentional and alive, whether through subtle expression, lighting, or posture. My work often explores mood, personality, and narrative, aiming to communicate a clear visual story rather than just a finished image.\n\nI work through a sketch-first digital process, developing ideas from rough concepts into refined final artwork. I prioritize clarity and structure early on, then focus on refinement, detail, and polish as the piece evolves.",
    aboutArtisticFocus: [
        {
            icon: '🎭',
            title: 'Character-Driven',
            description: 'Creating characters that feel intentional and alive through expression, lighting, and posture'
        },
        {
            icon: '📖',
            title: 'Visual Storytelling',
            description: 'Exploring mood, personality, and narrative to communicate clear visual stories'
        },
        {
            icon: '🎨',
            title: 'Expressive Detail',
            description: 'Strong composition with emphasis on expressive detail and visual impact'
        },
    ],
    aboutTools: [
        { name: 'Adobe Photoshop', icon: '🖼️' },
        { name: 'Clip Studio Paint', icon: '🎨' },
        { name: 'Procreate', icon: '📱' },
        { name: 'Blender', icon: '🎲' },
        { name: 'After Effects', icon: '🎬' },
        { name: 'Figma', icon: '🎯' },
        { name: 'Procreate Dreams', icon: '✨' },
        { name: 'Wacom Tablets', icon: '🖊️' },
    ],

    siteTitle: 'Miqk Niq - Art Portfolio',
    siteDescription: 'Digital artist specializing in concept art, illustrations, and commissioned work.',
    contactEmail: 'miqkniq@gmail.com',
    socialLinks: [
        { platform: 'Instagram', url: 'https://www.instagram.com/miqkniq_toney/' },
        { platform: 'Twitter', url: '#' },
        { platform: 'ArtStation', url: '#' },
    ],

    // Personal Info defaults
    artistName: 'Miqk Niq',
    artistBio: 'Digital artist and illustrator passionate about bringing creative visions to life through concept art, character design, and commissioned artwork.',
    phoneNumber: '+254110139659',
    location: 'Kenya',
    timezone: 'EAT (UTC+3)',
};
