import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Github, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  const { isDark } = useTheme();
  
  const footerLinks = [
    {
      title: 'PRODUCT',
      links: [
        { name: 'FEATURES', href: '#features' },
        { name: 'TEMPLATES', href: '/templates' },
        { name: 'PRICING', href: '#pricing' },
        { name: 'FAQ', href: '#faq' },
        { name: 'TESTIMONIALS', href: '#testimonials' }
      ]
    },
    {
      title: 'COMPANY',
      links: [
        { name: 'ABOUT', href: '/about' },
        { name: 'CAREERS', href: '/careers' },
        { name: 'BLOG', href: '/blog' },
        { name: 'PRESS', href: '/press' },
        { name: 'CONTACT', href: '/contact' }
      ]
    },
    {
      title: 'RESOURCES',
      links: [
        { name: 'DOCUMENTATION', href: '/docs' },
        { name: 'RESUME TIPS', href: '/tips' },
        { name: 'CAREER ADVICE', href: '/advice' },
        { name: 'API', href: '/api' },
        { name: 'PRIVACY', href: '/privacy' }
      ]
    },
    {
      title: 'LEGAL',
      links: [
        { name: 'TERMS', href: '/terms' },
        { name: 'PRIVACY', href: '/privacy' },
        { name: 'COOKIES', href: '/cookies' },
        { name: 'LICENSES', href: '/licenses' }
      ]
    }
  ];
  
  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com' },
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com' },
    { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com' },
    { icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com' }
  ];
  
  return (
    <footer className="py-16 px-6 border-t border-zinc-900 bg-black">
      <div className="container mx-auto">
        {/* Top Footer */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Logo and Description */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 p-2">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                LIVECV
              </span>
            </div>
            <p className="mb-6 text-sm text-zinc-500 font-medium tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              CREATE PROFESSIONAL, ATS-OPTIMIZED RESUMES IN MINUTES WITH OUR INTUITIVE BUILDER. LAND YOUR DREAM JOB WITH LIVECV.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-black text-sm mb-5 text-white uppercase tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-xs text-zinc-500 hover:text-white transition-colors font-semibold tracking-wide"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-zinc-900 pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-zinc-600 uppercase tracking-wide font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            &copy; {new Date().getFullYear()} LIVECV. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-600 uppercase tracking-wide font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              POWERED BY
            </span>
            <span className="font-black text-pink-500 uppercase tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>APPWRITE</span>
            <span className="text-xs text-zinc-600 uppercase tracking-wide font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              &
            </span>
            <span className="font-black text-blue-500 uppercase tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>RENDERCV</span>
          </div>
          
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-zinc-500" />
            <a 
              href="mailto:contact@livecv.com"
              className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wide font-semibold"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              CONTACT@LIVECV.COM
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
