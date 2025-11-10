import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Star, ArrowLeft, ArrowRight, Quote } from 'lucide-react';

export const Testimonials = () => {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      name: "SARAH JOHNSON",
      role: "SOFTWARE ENGINEER, GOOGLE",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "LIVECV HELPED ME LAND MY DREAM JOB AT GOOGLE. THE ATS OPTIMIZATION FEATURE ENSURED MY RESUME GOT PAST THE INITIAL SCREENING. I WAS GETTING INTERVIEWS WITHIN DAYS!",
      rating: 5
    },
    {
      name: "MICHAEL CHEN",
      role: "PRODUCT MANAGER, MICROSOFT",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "AFTER STRUGGLING TO GET CALLBACKS FOR MONTHS, I USED LIVECV TO REBUILD MY RESUME. THE AI SUGGESTIONS WERE SPOT ON, AND THE TEMPLATES ARE TRULY PROFESSIONAL. HIGHLY RECOMMEND!",
      rating: 5
    },
    {
      name: "PRIYA SHARMA",
      role: "UX DESIGNER, APPLE",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      content: "AS A DESIGNER, I NEEDED A RESUME THAT WOULD SHOWCASE MY AESTHETIC SENSE WHILE REMAINING ATS-FRIENDLY. LIVECV'S TEMPLATES STRUCK THE PERFECT BALANCE. I'M NOW AT APPLE!",
      rating: 5
    },
    {
      name: "JAMES WILSON",
      role: "DATA SCIENTIST, AMAZON",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      content: "THE REAL-TIME PDF PREVIEW SAVED ME SO MUCH TIME. I COULD SEE EXACTLY HOW MY CHANGES AFFECTED THE LAYOUT. THE RESUME I CREATED GOT ME MULTIPLE OFFERS, INCLUDING MY CURRENT ROLE AT AMAZON.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`w-5 h-5 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} 
      />
    ));
  };

  return (
    <section className="py-24 px-6 bg-zinc-950 border-t border-zinc-900">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
            SUCCESS <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">STORIES</span>
          </h2>
          <p className="text-lg text-zinc-400 uppercase tracking-wide font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            SEE WHAT OUR USERS HAVE TO SAY
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="p-12 bg-zinc-900/50 border border-zinc-800 relative">
            {/* Quote Icon */}
            <div className="absolute -top-6 -left-6">
              <div className="p-4 bg-blue-600 text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="mb-8">
              <p className="text-base mb-8 text-zinc-300 font-medium tracking-wide leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                "{testimonials[activeIndex].content}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name}
                    className="w-16 h-16 object-cover border-4 border-blue-600"
                  />
                  <div className="ml-4">
                    <h4 className="font-black text-lg text-white uppercase tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{testimonials[activeIndex].name}</h4>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide font-bold mt-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {renderStars(testimonials[activeIndex].rating)}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center space-x-4">
              <button 
                onClick={prevTestimonial}
                className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 mx-1 transition-all ${
                    activeIndex === index 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Logos Grid */}
          <div className="mt-20 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-zinc-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              OUR USERS WORK AT LEADING COMPANIES
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-3xl mx-auto">
              {['GOOGLE', 'MICROSOFT', 'AMAZON', 'APPLE', 'META', 'NETFLIX', 'TESLA', 'IBM'].map((company) => (
                <div 
                  key={company} 
                  className="flex items-center justify-center font-black text-lg text-zinc-400 uppercase tracking-tight"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
