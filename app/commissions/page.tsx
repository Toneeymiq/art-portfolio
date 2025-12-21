'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EmptyState from '@/components/EmptyState';
import { SiteSettings, defaultSiteSettings } from '@/types/settings';
import { Check, Star, Sparkles, MessageCircle, Palette, FileImage, ArrowRight } from 'lucide-react';
import { CommissionsPageSkeleton } from '@/components/SkeletonLoaders';

// Icon mapping for dynamic rendering
const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Palette,
  FileImage,
  Sparkles,
};

export default function Commissions() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  if (loading) {
    return <CommissionsPageSkeleton />;
  }

  // Use fetched settings or defaults
  const services = settings?.commissionServices || defaultSiteSettings.commissionServices;
  const pricingTiers = settings?.commissionPricing || defaultSiteSettings.commissionPricing;
  const processSteps = settings?.commissionProcess || defaultSiteSettings.commissionProcess;
  const ctaTitle = settings?.commissionCTATitle || defaultSiteSettings.commissionCTATitle;
  const ctaDescription = settings?.commissionCTADescription || defaultSiteSettings.commissionCTADescription;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 pb-16 gradient-mesh">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 rounded-full text-[var(--accent-primary)] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Open for Commissions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)] font-dancing">
            Custom <span className="text-gradient">Artwork</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Bring your vision to life with custom artwork tailored to your needs
          </p>
        </div>

        {/* Services Grid */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center text-[var(--text-primary)] font-dancing">What I Offer</h2>
          {services.length === 0 ? (
            <EmptyState type="general" title="Services Coming Soon" description="Commission services will be listed here." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="card p-6 text-center group hover:bg-[var(--accent-primary)]/5 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">{service.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{service.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pricing */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center text-[var(--text-primary)] font-dancing">Pricing</h2>
          {pricingTiers.length === 0 ? (
            <EmptyState type="general" title="Pricing Coming Soon" description="Commission pricing will be listed here." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`card p-6 text-center relative animate-fade-in-up ${tier.isPopular ? 'ring-2 ring-[var(--accent-primary)] scale-105' : ''}`}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white text-xs font-semibold rounded-full">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">{tier.name}</h3>
                  <p className="text-4xl font-bold text-gradient mb-2">{tier.price}</p>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-6 text-left">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${tier.isPopular
                      ? 'btn-primary'
                      : 'border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]'
                      }`}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Process Timeline */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center text-[var(--text-primary)] font-dancing">The Process</h2>
          <div className="card p-8">
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)]" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {processSteps.map((step, index) => {
                  const IconComponent = iconMap[step.icon] || MessageCircle;
                  return (
                    <div key={index} className="text-center relative animate-fade-in-up" style={{ animationDelay: `${400 + index * 100}ms` }}>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white shadow-lg relative z-10">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-[var(--text-primary)] mb-2">{index + 1}. {step.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <div className="card p-8 md:p-12 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-primary)] font-dancing">
              {ctaTitle}
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              {ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Start Your Commission
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}