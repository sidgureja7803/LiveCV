import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Github, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  const { isDark } = useTheme();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Templates', href: '/templates' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Testimonials', href: '#testimonials' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press', href: '/press' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Resume Tips', href: '/tips' },
        { name: 'Career Advice', href: '/advice' },
        { name: 'API', href: '/api' },
        { name: 'Privacy', href: '/privacy' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms', href: '/terms' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Cookies', href: '/cookies' },
        { name: 'Licenses', href: '/licenses' }
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
    <footer className={`py-16 px-6 border-t ${
      isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="container mx-auto">
        {/* Top Footer */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Logo and Description */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                LiveCV
              </span>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create professional, ATS-optimized resumes in minutes with our intuitive builder. Land your dream job with LiveCV.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg transition-colors ${
                    isDark 
                      ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'bg-gray-100 text-gray-600 hover:text-indigo-600 hover:bg-gray-200'
                  }`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-bold text-lg mb-5">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className={`transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:text-white' 
                          : 'text-gray-600 hover:text-indigo-600'
                      }`}
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
        <div className="border-t pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            &copy; {new Date().getFullYear()} LiveCV. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Powered by
            </span>
            <span className="font-bold text-pink-500">Appwrite</span>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              &
            </span>
            <span className="font-bold text-indigo-500">RenderCV</span>
          </div>
          
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            <a 
              href="mailto:contact@livecv.com"
              className={`hover:underline ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              contact@livecv.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
