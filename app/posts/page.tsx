export default function Posts() {
  const posts = [
    {
      id: '1',
      title: 'Breaking Down My Latest Character Design',
      excerpt: 'A detailed look at the process behind my recent fantasy character illustration...',
      date: '2025-01-15',
      readTime: '5 min read',
    },
    {
      id: '2',
      title: 'Commission Success Story: From Sketch to Client Joy',
      excerpt: 'How a simple commission request turned into a beloved piece for a client...',
      date: '2025-01-10',
      readTime: '4 min read',
    },
    {
      id: '3',
      title: 'Tools and Techniques for Digital Artists',
      excerpt: 'My current workflow and favorite tools for creating digital art...',
      date: '2025-01-05',
      readTime: '6 min read',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">Posts & Blog</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Insights, breakdowns, and stories from my creative journey
          </p>
        </div>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] cursor-pointer transition-colors">
                  {post.title}
                </h2>
                <span className="text-sm text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-full">
                  {post.readTime}
                </span>
              </div>
              <p className="text-[var(--text-secondary)] mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-tertiary)]">{post.date}</span>
                <button className="text-[var(--accent-primary)] hover:underline font-medium">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}