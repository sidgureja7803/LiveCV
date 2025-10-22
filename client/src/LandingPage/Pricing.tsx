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
      name: 'Free',
      description: 'Perfect for job seekers who need a basic resume',
      price: {
        monthly: 0,
        annual: 0
      },
      features: [
        '3 Resume Templates',
        'Basic PDF Export',
        'Resume Builder',
        'ATS-Friendly Formats',
        '1 Resume Download Per Month'
      ],
      icon: <FileText className="w-8 h-8" />,
      color: 'from-gray-600 to-gray-500',
      popular: false,
      ctaText: 'Get Started'
    },
    {
      name: 'Pro',
      description: 'For serious job seekers who need more features',
      price: {
        monthly: 9.99,
        annual: 7.99
      },
      features: [
        'All Free Features',
        '15+ Premium Templates',
        'Unlimited Downloads',
        'ATS Optimization',
        'Multiple Resume Versions',
        'Cover Letter Builder',
        'Priority Support'
      ],
      icon: <Star className="w-8 h-8" />,
      color: 'from-indigo-600 to-purple-600',
      popular: true,
      ctaText: 'Get Pro'
    },
    {
      name: 'Enterprise',
      description: 'For teams and career centers',
      price: {
        monthly: 29.99,
        annual: 24.99
      },
      features: [
        'All Pro Features',
        'Team Management',
        'API Access',
        'Custom Templates',
        'Advanced Analytics',
        'Dedicated Account Manager',
        'White Labeling Options'
      ],
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      popular: false,
      ctaText: 'Contact Sales'
    }
  ];
  
  return (
    <section id="pricing" className={`py-24 px-6 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className={`text-xl mb-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose the plan that's right for you
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 mb-12 rounded-full border-2 border-indigo-100 dark:border-gray-700 bg-indigo-50 dark:bg-gray-800">
            <button
              className={`px-8 py-3 rounded-full text-lg font-bold transition-all ${
                isAnnual 
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-lg' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual
              <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
            <button
              className={`px-8 py-3 rounded-full text-lg font-bold transition-all ${
                !isAnnual 
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-lg' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative rounded-3xl transition-all ${
                plan.popular 
                  ? 'transform md:-translate-y-4 scale-105' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 inset-x-0 flex justify-center">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2 rounded-full font-bold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`p-8 rounded-3xl h-full flex flex-col ${
                plan.popular
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl border-none'
                  : isDark
                    ? 'bg-gray-800 border-2 border-gray-700'
                    : 'bg-white border-2 border-gray-200'
              }`}>
                {/* Header */}
                <div className="mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    plan.popular
                      ? 'bg-white/20'
                      : `bg-gradient-to-r ${plan.color} text-white`
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-3xl font-black mb-2">{plan.name}</h3>
                  <p className={plan.popular ? 'text-indigo-200' : isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {plan.description}
                  </p>
                </div>
                
                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-6xl font-black">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className={`ml-2 ${
                      plan.popular ? 'text-indigo-200' : isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      /month
                    </span>
                  </div>
                  {isAnnual && plan.price.annual > 0 && (
                    <p className={`text-sm mt-2 ${
                      plan.popular ? 'text-indigo-200' : isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Billed annually (${(plan.price.annual * 12).toFixed(2)}/year)
                    </p>
                  )}
                </div>
                
                {/* Features */}
                <div className="mb-8 flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className={`w-5 h-5 mr-3 ${
                          plan.popular ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* CTA */}
                <div>
                  <button
                    onClick={() => {
                      if (plan.name === 'Free') {
                        navigate('/register');
                      } else if (plan.name === 'Pro') {
                        navigate('/register?plan=pro');
                      } else {
                        window.open('mailto:sales@livecv.com', '_blank');
                      }
                    }}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      plan.popular
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    }`}
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
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Have questions about our pricing?
          </p>
          <button
            onClick={() => {
              const faqSection = document.getElementById('faqs');
              faqSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-8 py-3 rounded-xl font-bold ${
              isDark
                ? 'bg-gray-800 text-white border-2 border-gray-700 hover:bg-gray-700'
                : 'bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50'
            }`}
          >
            See Frequently Asked Questions
          </button>
        </div>
      </div>
    </section>
  );
};
