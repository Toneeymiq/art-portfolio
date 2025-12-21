import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/db';
import { defaultSiteSettings } from '@/types/settings';

export const revalidate = 60; // Revalidate every minute

export default async function About() {
  const dbSettings = await getSiteSettings();
  const settings = { ...defaultSiteSettings, ...(dbSettings || {}) };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Hero Photo Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {settings.aboutHeroImage && (
            <Image
              src={settings.aboutHeroImage}
              alt="Artist portrait"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[var(--bg-primary)]"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg font-dancing">{settings.aboutHeroTitle}</h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
            {settings.aboutHeroSubtitle}
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Bio Card - Overlapping Hero */}
        <div className="relative z-20 -mt-24 mb-16">
          <div className="card p-8 md:p-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3">
                <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-[var(--accent-primary)] shadow-xl bg-[var(--bg-tertiary)]">
                  {settings.aboutProfileImage ? (
                    <Image
                      src={settings.aboutProfileImage}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      👤
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-primary)] font-dancing">
                  {settings.aboutBioTitle}
                </h2>
                <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {settings.aboutBioText}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artistic Focus */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--text-primary)] font-dancing">
            Artistic Focus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.aboutArtisticFocus?.map((item: any, index: number) => (
              <div
                key={index}
                className="card p-6 text-center group hover:bg-[var(--accent-primary)]/5 transition-colors duration-300 animate-fade-in-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-[var(--text-secondary)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tools & Software */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--text-primary)] font-dancing">
            Tools & Software
          </h2>
          <div className="card p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {settings.aboutTools?.map((tool: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors duration-300 cursor-default group"
                >
                  <div className="w-14 h-14 bg-[var(--bg-tertiary)] group-hover:bg-[var(--accent-primary)]/10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl">{tool.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)] text-center">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="card p-8 md:p-12 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-primary)] font-dancing">
              {settings.commissionCTATitle}
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              {settings.commissionCTADescription}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-8">
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[var(--bg-primary)]/50">
                <span>📧</span>
                <span className="text-[var(--text-secondary)]">{settings.contactEmail}</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[var(--bg-primary)]/50">
                <span>📍</span>
                <span className="text-[var(--text-secondary)]">{settings.location}</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[var(--bg-primary)]/50">
                <span>⚡</span>
                <span className="text-[var(--text-secondary)]">Responds within 24h</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Get in Touch
              </Link>
              <Link
                href="/commissions"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                View Commissions
              </Link>
            </div>

           
          </div>
        </section>
      </div>
    </div>
  );
}