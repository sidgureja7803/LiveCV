import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { CheckCircle, Download, FileText, Activity, Sparkles, Star } from 'lucide-react';

export const Pricing = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  
  const plans = [
    {
      name: 'FREE',
      description: 'PERFECT FOR JOB SEEKERS WHO NEED A BASIC RESUME',
      price: {
        monthly: 0,
        annual: 0
      },
      features: [
        '3 RESUME TEMPLATES',
        'BASIC PDF EXPORT',
        'RESUME BUILDER',
        'ATS-FRIENDLY FORMATS',
        '1 RESUME DOWNLOAD PER MONTH'
      ],
      icon: <FileText className="w-8 h-8" />,
      color: 'from-gray-600 to-gray-500',
      popular: false,
      ctaText: 'GET STARTED'
    },
    {
      name: 'PRO',
      description: 'FOR SERIOUS JOB SEEKERS WHO NEED MORE FEATURES',
      price: {
        monthly: 9.99,
        annual: 7.99
      },
      features: [
        'ALL FREE FEATURES',
        '15+ PREMIUM TEMPLATES',
        'UNLIMITED DOWNLOADS',
        'ATS OPTIMIZATION',
        'MULTIPLE RESUME VERSIONS',
        'COVER LETTER BUILDER',
        'PRIORITY SUPPORT'
      ],
      icon: <Star className="w-8 h-8" />,
      color: 'from-indigo-600 to-purple-600',
      popular: true,
      ctaText: 'GET PRO'
    },
    {
      name: 'ENTERPRISE',
      description: 'FOR TEAMS AND CAREER CENTERS',
      price: {
        monthly: 29.99,
        annual: 24.99
      },
      features: [
        'ALL PRO FEATURES',
        'TEAM MANAGEMENT',
        'API ACCESS',
        'CUSTOM TEMPLATES',
        'ADVANCED ANALYTICS',
        'DEDICATED ACCOUNT MANAGER',
        'WHITE LABELING OPTIONS'
      ],
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      popular: false,
      ctaText: 'CONTACT SALES'
    }
  ];
  
  return (
    <section id="pricing" className="py-24 px-6 bg-black border-t border-zinc-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
            SIMPLE, <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">TRANSPARENT PRICING</span>
          </h2>
          <p className="text-lg mb-10 text-zinc-400 uppercase tracking-wide font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            CHOOSE THE PLAN THAT'S RIGHT FOR YOU
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 mb-12 border border-zinc-800 bg-zinc-900">
            <button
              className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                isAnnual 
                  ? 'bg-blue-600 text-white' 
                  : 'text-zinc-500'
              }`}
              onClick={() => setIsAnnual(true)}
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              ANNUAL
              <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 font-black">
                SAVE 20%
              </span>
            </button>
            <button
              className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                !isAnnual 
                  ? 'bg-blue-600 text-white' 
                  : 'text-zinc-500'
              }`}
              onClick={() => setIsAnnual(false)}
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              MONTHLY
            </button>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative transition-all ${
                plan.popular 
                  ? 'transform md:-translate-y-4' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <div className="bg-blue-600 text-white px-6 py-2 font-black text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <div className={`p-8 h-full flex flex-col border ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600'
                  : 'bg-zinc-900/50 border-zinc-800'
              }`}>
                {/* Header */}
                <div className="mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 ${
                    plan.popular
                      ? 'bg-white/20'
                      : `bg-gradient-to-r ${plan.color} text-white`
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{plan.name}</h3>
                  <p className={`text-xs uppercase tracking-wide font-medium ${plan.popular ? 'text-blue-200' : 'text-zinc-500'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {plan.description}
                  </p>
                </div>
                
                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-6xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className={`ml-2 text-sm uppercase tracking-wide font-bold ${
                      plan.popular ? 'text-blue-200' : 'text-zinc-500'
                    }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      /MONTH
                    </span>
                  </div>
                  {isAnnual && plan.price.annual > 0 && (
                    <p className={`text-xs mt-2 uppercase tracking-wide font-medium ${
                      plan.popular ? 'text-blue-200' : 'text-zinc-500'
                    }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      BILLED ANNUALLY (${(plan.price.annual * 12).toFixed(2)}/YEAR)
                    </p>
                  )}
                </div>
                
                {/* Features */}
                <div className="mb-8 flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className={`w-4 h-4 mr-3 mt-0.5 flex-shrink-0 ${
                          plan.popular ? 'text-white' : 'text-blue-500'
                        }`} />
                        <span className="text-xs font-semibold tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* CTA */}
                <div>
                  <button
                    onClick={() => {
                      if (plan.name === 'FREE') {
                        navigate('/register');
                      } else if (plan.name === 'PRO') {
                        navigate('/register?plan=pro');
                      } else {
                        window.open('mailto:sales@livecv.com', '_blank');
                      }
                    }}
                    className={`w-full py-4 font-black text-sm uppercase tracking-wider transition-all ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQ Preview */}
        <div className="mt-20 text-center">
          <p className="text-lg mb-8 text-zinc-400 uppercase tracking-wide font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            HAVE QUESTIONS ABOUT OUR PRICING?
          </p>
          <button
            onClick={() => {
              const faqSection = document.getElementById('faqs');
              faqSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800 font-black text-sm uppercase tracking-wider transition-all"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            SEE FREQUENTLY ASKED QUESTIONS
          </button>
        </div>
      </div>
    </section>
  );
};
