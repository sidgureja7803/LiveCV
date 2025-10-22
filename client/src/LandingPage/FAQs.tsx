import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQs = () => {
  const { isDark } = useTheme();
  const [openItem, setOpenItem] = useState<number | null>(0);
  
  const faqs = [
    {
      question: "What is LiveCV?",
      answer: "LiveCV is an AI-powered resume builder that helps you create professional, ATS-optimized resumes in minutes. With live PDF preview, multiple templates, and expert guidance, we make it easy to land your dream job."
    },
    {
      question: "Is LiveCV really free to use?",
      answer: "Yes! LiveCV offers a free tier that includes basic resume building features. You can create and download up to one resume per month with our free plan. For more advanced features like unlimited downloads, premium templates, and ATS optimization, check out our Pro plan."
    },
    {
      question: "What does ATS-optimized mean?",
      answer: "ATS (Applicant Tracking System) is software that employers use to scan, sort, and rank resumes before a human ever sees them. Our ATS optimization ensures your resume contains the right keywords, format, and structure to pass through these systems and get your resume in front of recruiters."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You can cancel your subscription at any time without any penalty. If you cancel, you'll still have access to your Pro features until the end of your billing period."
    },
    {
      question: "How do I get my resume as a PDF?",
      answer: "After creating your resume, simply click the 'Download' button to get your resume as a PDF file. Free users can download one resume per month, while Pro users have unlimited downloads."
    },
    {
      question: "Can I use LiveCV on my mobile device?",
      answer: "Yes, LiveCV is fully responsive and works on desktop, tablet, and mobile devices. However, we recommend using a desktop for the best experience when creating your resume."
    },
    {
      question: "What makes LiveCV different from other resume builders?",
      answer: "LiveCV stands out with its real-time PDF preview, AI-powered content suggestions, and ATS optimization technology. We also offer a modern, intuitive interface and professional templates designed by career experts specifically for today's job market."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 14-day money-back guarantee for our Pro plan. If you're not satisfied with our service within the first 14 days of your subscription, contact our support team and we'll process a full refund."
    }
  ];
  
  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };
  
  return (
    <section id="faqs" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Frequently Asked Questions
            </span>
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Everything you need to know about LiveCV
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`mb-6 rounded-2xl overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <button
                className={`w-full px-8 py-6 flex items-center justify-between text-left transition-all ${
                  openItem === index
                    ? isDark ? 'bg-gray-700' : 'bg-indigo-50'
                    : ''
                }`}
                onClick={() => toggleItem(index)}
              >
                <h3 className={`font-bold text-xl ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{faq.question}</h3>
                {openItem === index ? (
                  <ChevronUp className={`w-6 h-6 flex-shrink-0 ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                ) : (
                  <ChevronDown className={`w-6 h-6 flex-shrink-0 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                )}
              </button>
              
              <div 
                className={`px-8 transition-all ${
                  openItem === index ? 'py-6 border-t' : 'max-h-0 overflow-hidden py-0'
                } ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Still have questions */}
        <div className={`mt-16 p-8 rounded-2xl text-center max-w-2xl mx-auto ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-indigo-50 border border-indigo-100'
        }`}>
          <h3 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Still have questions?</h3>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Can't find the answer you're looking for? Please contact our friendly support team.
          </p>
          <a 
            href="mailto:support@livecv.com"
            className={`inline-block px-8 py-3 rounded-xl font-bold ${
              isDark 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};
