import Link from 'next/link';

export default function Commissions() {
  const examples = [
    { id: '1', title: 'Custom Portrait', image: 'https://picsum.photos/400/300?random=20' },
    { id: '2', title: 'Concept Art', image: 'https://picsum.photos/400/300?random=21' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">Commissions</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Bring your vision to life with custom artwork tailored to your needs
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--text-primary)]">What I Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Custom Illustrations', desc: 'Unique artwork for personal or commercial use' },
              { title: 'Character Designs', desc: 'Detailed character concepts and portraits' },
              { title: 'Concept Art', desc: 'Visual development for games and stories' },
              { title: 'Book Covers', desc: 'Eye-catching designs for your publications' },
              { title: 'Promotional Art', desc: 'Marketing materials and brand visuals' },
              { title: 'Digital Paintings', desc: 'High-quality digital artwork in various styles' },
            ].map((service, index) => (
              <div key={index} className="card p-6 text-center">
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">{service.title}</h3>
                <p className="text-[var(--text-secondary)]">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--text-primary)]">Recent Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examples.map((example) => (
              <div key={example.id} className="card overflow-hidden">
                <img src={example.image} alt={example.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--text-primary)]">{example.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--text-primary)]">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Simple</h3>
              <p className="text-3xl font-bold text-[var(--accent-primary)] mb-2">$50</p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Basic illustrations, simple concepts</p>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                <li>• 1 character/scene</li>
                <li>• Simple background</li>
                <li>• 2-3 revisions</li>
              </ul>
            </div>
            <div className="card p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Detailed</h3>
              <p className="text-3xl font-bold text-[var(--accent-primary)] mb-2">$150</p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Complex artwork, detailed scenes</p>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                <li>• Multiple elements</li>
                <li>• Detailed backgrounds</li>
                <li>• 3-5 revisions</li>
              </ul>
            </div>
            <div className="card p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Premium</h3>
              <p className="text-3xl font-bold text-[var(--accent-primary)] mb-2">$300+</p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">High-detail, commercial quality</p>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                <li>• Commercial license</li>
                <li>• Multiple formats</li>
                <li>• Unlimited revisions</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--text-primary)]">Process & Timeline</h2>
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">1. Consultation</h3>
                <p className="text-[var(--text-secondary)]">Discuss your vision and requirements</p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">2. Creation</h3>
                <p className="text-[var(--text-secondary)]">I'll create your artwork with regular updates</p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">3. Delivery</h3>
                <p className="text-[var(--text-secondary)]">Final files delivered in multiple formats</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Ready to Start Your Project?</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
            Every commission is unique. Let's discuss your specific needs and create something amazing together.
          </p>
          <Link
            href="/contact"
            className="bg-[var(--accent-primary)] text-[var(--bg-primary)] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors inline-block"
          >
            Start Your Commission
          </Link>
        </section>
      </div>
    </div>
  );
}