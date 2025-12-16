export default function Process() {
  const processes = [
    {
      id: '1',
      title: 'Character Design Process',
      finalImage: 'https://picsum.photos/600/400?random=10',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
      breakdown: 'Started with rough sketches, refined anatomy, added colors and details.',
    },
    {
      id: '2',
      title: 'Landscape Illustration',
      finalImage: 'https://picsum.photos/600/400?random=11',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      breakdown: 'Initial composition, value studies, final rendering with atmospheric effects.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">My Process</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Behind-the-scenes look at how ideas transform into finished artwork
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {processes.map((process) => (
            <div key={process.id} className="card overflow-hidden">
              <img src={process.finalImage} alt={process.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">{process.title}</h2>
                <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                  <iframe
                    src={process.videoUrl}
                    title={process.title}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-[var(--text-secondary)]">{process.breakdown}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}