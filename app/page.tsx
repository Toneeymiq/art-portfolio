import Link from 'next/link';
import Image from 'next/image';
import Gallery from '../components/Gallery';
import HeroSlider from '../components/HeroSlider';
import { Artwork } from '../types/artwork';

// Mock data for homepage sections
const featuredArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Sunset Landscape',
    description: 'A beautiful painting of a sunset over mountains',
    tags: ['paint', 'landscape'],
    imageUrl: 'https://picsum.photos/600/800?random=1',
    driveId: 'drive1',
    cdnUrl: 'https://picsum.photos/600/800?random=1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Abstract Digital Art',
    description: 'Modern digital abstract composition',
    tags: ['digital', 'abstract'],
    imageUrl: 'https://picsum.photos/400/600?random=2',
    driveId: 'drive2',
    cdnUrl: 'https://picsum.photos/400/600?random=2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Portrait Study',
    description: 'Detailed charcoal portrait',
    tags: ['draw', 'portrait'],
    imageUrl: 'https://picsum.photos/500/700?random=3',
    driveId: 'drive3',
    cdnUrl: 'https://picsum.photos/500/700?random=3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Cityscape at Night',
    description: 'Urban scene with neon lights',
    tags: ['digital', 'city'],
    imageUrl: 'https://picsum.photos/700/500?random=4',
    driveId: 'drive4',
    cdnUrl: 'https://picsum.photos/700/500?random=4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: 'Floral Still Life',
    description: 'Oil painting of flowers in vase',
    tags: ['paint', 'still-life'],
    imageUrl: 'https://picsum.photos/450/650?random=5',
    driveId: 'drive5',
    cdnUrl: 'https://picsum.photos/450/650?random=5',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    title: 'Geometric Patterns',
    description: 'Vector art with geometric shapes',
    tags: ['digital', 'geometric'],
    imageUrl: 'https://picsum.photos/550/450?random=6',
    driveId: 'drive6',
    cdnUrl: 'https://picsum.photos/550/450?random=6',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    title: 'Fantasy Character',
    description: 'Digital illustration of a fantasy character',
    tags: ['digital', 'fantasy'],
    imageUrl: 'https://picsum.photos/480/720?random=7',
    driveId: 'drive7',
    cdnUrl: 'https://picsum.photos/480/720?random=7',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    title: 'Nature Study',
    description: 'Detailed botanical illustration',
    tags: ['draw', 'nature'],
    imageUrl: 'https://picsum.photos/520/680?random=8',
    driveId: 'drive8',
    cdnUrl: 'https://picsum.photos/520/680?random=8',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const latestPortfolio = featuredArtworks.slice(0, 3);
const topPosts = [
  { id: '1', title: 'My Creative Process', excerpt: 'A deep dive into how I approach new projects...', date: 'Dec 15, 2025' },
  { id: '2', title: 'Color Theory in Digital Art', excerpt: 'Understanding the fundamentals of color...', date: 'Dec 10, 2025' },
  { id: '3', title: 'Tools I Use Daily', excerpt: 'My essential digital art toolkit...', date: 'Dec 5, 2025' },
];
const latestCommissions = [
  { id: '1', title: 'Character Portrait', client: 'Anonymous', status: 'Completed' },
  { id: '2', title: 'Book Cover Design', client: 'Author X', status: 'In Progress' },
  { id: '3', title: 'Logo Design', client: 'Startup Y', status: 'Completed' },
];
const staff = [
  { id: '1', name: 'Artist Name', role: 'Lead Artist', image: 'https://picsum.photos/200/200?random=profile' },
  { id: '2', name: 'Assistant A', role: 'Color Specialist', image: 'https://picsum.photos/200/200?random=staff1' },
  { id: '3', name: 'Assistant B', role: 'Technical Support', image: 'https://picsum.photos/200/200?random=staff2' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Hero Slider - Full screen, blends with navigation */}
      <HeroSlider artworks={featuredArtworks} />

      {/* Content Sections */}
      <div className="relative z-10 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content Overlay */}
          <section className="text-center py-16">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-white/30 shadow-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
                Art Portfolio
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-8 drop-shadow-md">
                Digital artist specializing in concept art, illustrations, and commissioned work.
                Bringing ideas to life through creative vision and technical skill.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/portfolio"
                  className="bg-[var(--accent-primary)] text-[var(--bg-primary)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--accent-secondary)] transition-colors shadow-lg hover:shadow-xl"
                >
                  View Full Portfolio
                </Link>
                <Link
                  href="/commissions"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors shadow-lg hover:shadow-xl"
                >
                  Commission Me
                </Link>
              </div>
            </div>
          </section>

          {/* Featured Artworks Masonry */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-[var(--text-primary)]">Featured Works</h2>
            <Gallery artworks={featuredArtworks} />
          </section>
        </div>

        {/* Latest Portfolio Section */}
        <section className="py-16 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">Latest Portfolio</h2>
              <Link href="/portfolio" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPortfolio.map((artwork) => (
                <div key={artwork.id} className="card overflow-hidden">
                  <Image
                    src={artwork.cdnUrl || artwork.imageUrl}
                    alt={artwork.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2">{artwork.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{artwork.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Posts Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">Latest Posts</h2>
              <Link href="/posts" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topPosts.map((post) => (
                <div key={post.id} className="card p-6">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">{post.title}</h3>
                  <p className="text-[var(--text-secondary)] mb-4">{post.excerpt}</p>
                  <span className="text-sm text-[var(--text-tertiary)]">{post.date}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Commissions Section */}
        <section className="py-16 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">Recent Commissions</h2>
              <Link href="/commissions" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestCommissions.map((commission) => (
                <div key={commission.id} className="card p-6">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">{commission.title}</h3>
                  <p className="text-[var(--text-secondary)] mb-2">Client: {commission.client}</p>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    commission.status === 'Completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {commission.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Staff Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-[var(--text-primary)]">Our Team</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4">
              {staff.map((member) => (
                <div key={member.id} className="card p-6 min-w-[250px] text-center">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">{member.name}</h3>
                  <p className="text-[var(--text-secondary)]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--bg-secondary)] py-8 text-center">
        <p className="text-[var(--text-secondary)]">© 2025 Artist Name - Portfolio</p>
      </footer>
    </div>
  );
}
