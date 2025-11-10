import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQs = () => {
  const { isDark } = useTheme();
  const [openItem, setOpenItem] = useState<number | null>(0);
  
  const faqs = [
    {
      question: "WHAT IS LIVECV?",
      answer: "LIVECV IS AN AI-POWERED RESUME BUILDER THAT HELPS YOU CREATE PROFESSIONAL, ATS-OPTIMIZED RESUMES IN MINUTES. WITH LIVE PDF PREVIEW, MULTIPLE TEMPLATES, AND EXPERT GUIDANCE, WE MAKE IT EASY TO LAND YOUR DREAM JOB."
    },
    {
      question: "IS LIVECV REALLY FREE TO USE?",
      answer: "YES! LIVECV OFFERS A FREE TIER THAT INCLUDES BASIC RESUME BUILDING FEATURES. YOU CAN CREATE AND DOWNLOAD UP TO ONE RESUME PER MONTH WITH OUR FREE PLAN. FOR MORE ADVANCED FEATURES LIKE UNLIMITED DOWNLOADS, PREMIUM TEMPLATES, AND ATS OPTIMIZATION, CHECK OUT OUR PRO PLAN."
    },
    {
      question: "WHAT DOES ATS-OPTIMIZED MEAN?",
      answer: "ATS (APPLICANT TRACKING SYSTEM) IS SOFTWARE THAT EMPLOYERS USE TO SCAN, SORT, AND RANK RESUMES BEFORE A HUMAN EVER SEES THEM. OUR ATS OPTIMIZATION ENSURES YOUR RESUME CONTAINS THE RIGHT KEYWORDS, FORMAT, AND STRUCTURE TO PASS THROUGH THESE SYSTEMS AND GET YOUR RESUME IN FRONT OF RECRUITERS."
    },
    {
      question: "CAN I CANCEL MY SUBSCRIPTION ANYTIME?",
      answer: "ABSOLUTELY! YOU CAN CANCEL YOUR SUBSCRIPTION AT ANY TIME WITHOUT ANY PENALTY. IF YOU CANCEL, YOU'LL STILL HAVE ACCESS TO YOUR PRO FEATURES UNTIL THE END OF YOUR BILLING PERIOD."
    },
    {
      question: "HOW DO I GET MY RESUME AS A PDF?",
      answer: "AFTER CREATING YOUR RESUME, SIMPLY CLICK THE 'DOWNLOAD' BUTTON TO GET YOUR RESUME AS A PDF FILE. FREE USERS CAN DOWNLOAD ONE RESUME PER MONTH, WHILE PRO USERS HAVE UNLIMITED DOWNLOADS."
    },
    {
      question: "CAN I USE LIVECV ON MY MOBILE DEVICE?",
      answer: "YES, LIVECV IS FULLY RESPONSIVE AND WORKS ON DESKTOP, TABLET, AND MOBILE DEVICES. HOWEVER, WE RECOMMEND USING A DESKTOP FOR THE BEST EXPERIENCE WHEN CREATING YOUR RESUME."
    },
    {
      question: "WHAT MAKES LIVECV DIFFERENT FROM OTHER RESUME BUILDERS?",
      answer: "LIVECV STANDS OUT WITH ITS REAL-TIME PDF PREVIEW, AI-POWERED CONTENT SUGGESTIONS, AND ATS OPTIMIZATION TECHNOLOGY. WE ALSO OFFER A MODERN, INTUITIVE INTERFACE AND PROFESSIONAL TEMPLATES DESIGNED BY CAREER EXPERTS SPECIFICALLY FOR TODAY'S JOB MARKET."
    },
    {
      question: "DO YOU OFFER REFUNDS?",
      answer: "YES, WE OFFER A 14-DAY MONEY-BACK GUARANTEE FOR OUR PRO PLAN. IF YOU'RE NOT SATISFIED WITH OUR SERVICE WITHIN THE FIRST 14 DAYS OF YOUR SUBSCRIPTION, CONTACT OUR SUPPORT TEAM AND WE'LL PROCESS A FULL REFUND."
    }
  ];
  
  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };
  
  return (
    <section id="faqs" className="py-24 px-6 bg-black border-t border-zinc-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
            FREQUENTLY <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">ASKED QUESTIONS</span>
          </h2>
          <p className="text-lg text-zinc-400 uppercase tracking-wide font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            EVERYTHING YOU NEED TO KNOW ABOUT LIVECV
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 overflow-hidden bg-zinc-900/50 border border-zinc-800"
            >
              <button
                className={`w-full px-8 py-6 flex items-center justify-between text-left transition-all ${
                  openItem === index
                    ? 'bg-zinc-800/50'
                    : ''
                }`}
                onClick={() => toggleItem(index)}
              >
                <h3 className="font-black text-base text-white uppercase tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{faq.question}</h3>
                {openItem === index ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0 text-blue-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0 text-zinc-500" />
                )}
              </button>
              
              <div 
                className={`px-8 transition-all ${
                  openItem === index ? 'py-6 border-t border-zinc-800' : 'max-h-0 overflow-hidden py-0'
                }`}
              >
                <p className="text-xs text-zinc-400 font-medium tracking-wide leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Still have questions */}
        <div className="mt-16 p-8 text-center max-w-2xl mx-auto bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>STILL HAVE QUESTIONS?</h3>
          <p className="mb-6 text-sm text-zinc-400 uppercase tracking-wide font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            CAN'T FIND THE ANSWER YOU'RE LOOKING FOR? PLEASE CONTACT OUR FRIENDLY SUPPORT TEAM.
          </p>
          <a 
            href="mailto:support@livecv.com"
            className="inline-block px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 font-black text-sm uppercase tracking-wider transition-colors"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            CONTACT SUPPORT
          </a>
        </div>
      </div>
    </section>
  );
};
