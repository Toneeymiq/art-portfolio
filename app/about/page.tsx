export default function About() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Hero Photo Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?random=profile"
            alt="Artist portrait"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">About Me</h1>
          <p className="text-xl md:text-2xl mb-8">
            Illustrator & Concept Artist based in Nairobi, Kenya
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 -mt-32 relative z-20">
          <div className="order-2 lg:order-1">
            <div className="card p-8">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Hi, I'm Miqk Niq</h2>
              <p className="text-[var(--text-secondary)] mb-4">
                I'm Miqk Niq, an illustrator and concept artist based in Nairobi, Kenya. My work focuses on character-driven illustrations, portraits, and visual storytelling, with an emphasis on expressive detail and strong composition.
              </p>
              <p className="text-[var(--text-secondary)] mb-4">
                I'm drawn to creating characters that feel intentional and alive, whether through subtle expression, lighting, or posture. My work often explores mood, personality, and narrative, aiming to communicate a clear visual story rather than just a finished image.
              </p>
              <p className="text-[var(--text-secondary)]">
                I work through a sketch-first digital process, developing ideas from rough concepts into refined final artwork. I prioritize clarity and structure early on, then focus on refinement, detail, and polish as the piece evolves.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            {/* This space is now occupied by the hero photo above */}
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--text-primary)]">Artistic Focus</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-[var(--accent-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Character-Driven</h3>
              <p className="text-[var(--text-secondary)]">
                Creating characters that feel intentional and alive through expression, lighting, and posture
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-[var(--accent-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Visual Storytelling</h3>
              <p className="text-[var(--text-secondary)]">
                Exploring mood, personality, and narrative to communicate clear visual stories
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-[var(--accent-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Expressive Detail</h3>
              <p className="text-[var(--text-secondary)]">
                Strong composition with emphasis on expressive detail and visual impact
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--text-primary)]">Tools & Software</h2>
          <div className="card p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { name: 'Adobe Photoshop', icon: '🖼️' },
                { name: 'Clip Studio Paint', icon: '🎨' },
                { name: 'Procreate', icon: '📱' },
                { name: 'Blender', icon: '🎲' },
                { name: 'After Effects', icon: '🎬' },
                { name: 'Figma', icon: '🎯' },
                { name: 'Procreate Dreams', icon: '✨' },
                { name: 'Wacom Tablets', icon: '🖊️' },
              ].map((tool, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">{tool.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="text-center">
          <div className="card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Let's Create Together</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Based in Nairobi, Kenya, available worldwide for commissions and collaborations.
              Currently accepting projects for Q1 2025.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center">
                <span className="mr-2">📧</span>
                <span className="text-[var(--text-secondary)]">miqkniq@gmail.com</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">📍</span>
                <span className="text-[var(--text-secondary)]">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">⚡</span>
                <span className="text-[var(--text-secondary)]">Responds within 24h</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}