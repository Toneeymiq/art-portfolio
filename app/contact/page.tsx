'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">Contact Me</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Let's discuss your project and bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="card p-8">
              <h2 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-[var(--text-primary)]">Email</h3>
                    <p className="text-[var(--text-secondary)]">artist@email.com</p>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">Usually responds within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💼</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-[var(--text-primary)]">Commission Inquiries</h3>
                    <p className="text-[var(--text-secondary)]">
                      For commission requests, please include project details, timeline, and budget expectations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-[var(--text-primary)]">Social Media</h3>
                    <div className="flex flex-wrap gap-3">
                      <a href="#" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">Instagram</a>
                      <a href="#" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">Twitter</a>
                      <a href="#" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">ArtStation</a>
                      <a href="#" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">DeviantArt</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Current Availability</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Commission Slots</span>
                  <span className="font-medium text-[var(--accent-primary)]">2/5 Available</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Response Time</span>
                  <span className="font-medium text-[var(--text-primary)]">Within 24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Time Zone</span>
                  <span className="font-medium text-[var(--text-primary)]">EST (UTC-5)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-colors resize-vertical"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--accent-primary)] text-[var(--bg-primary)] py-3 px-6 rounded-lg font-semibold hover:bg-[var(--accent-secondary)] transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}