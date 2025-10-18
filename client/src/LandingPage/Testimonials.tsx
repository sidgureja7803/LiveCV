import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Star, ArrowLeft, ArrowRight, Quote } from 'lucide-react';

export const Testimonials = () => {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer, Google",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "LiveCV helped me land my dream job at Google. The ATS optimization feature ensured my resume got past the initial screening. I was getting interviews within days!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager, Microsoft",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "After struggling to get callbacks for months, I used LiveCV to rebuild my resume. The AI suggestions were spot on, and the templates are truly professional. Highly recommend!",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "UX Designer, Apple",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      content: "As a designer, I needed a resume that would showcase my aesthetic sense while remaining ATS-friendly. LiveCV's templates struck the perfect balance. I'm now at Apple!",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Data Scientist, Amazon",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      content: "The real-time PDF preview saved me so much time. I could see exactly how my changes affected the layout. The resume I created got me multiple offers, including my current role at Amazon.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
      />
    ));
  };

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Success Stories
            </span>
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            See what our users have to say
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className={`p-12 rounded-3xl ${
            isDark ? 'bg-gray-800/50' : 'bg-white'
          } border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-xl relative`}>
            {/* Quote Icon */}
            <div className="absolute -top-6 -left-6">
              <div className={`p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="mb-8">
              <p className={`text-xl italic mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                "{testimonials[activeIndex].content}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-indigo-500"
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-xl">{testimonials[activeIndex].name}</h4>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
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
                className={`p-3 rounded-full ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className={`p-3 rounded-full ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full mx-1 transition-all ${
                    activeIndex === index 
                      ? 'bg-indigo-600 w-8' 
                      : isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Logos Grid */}
          <div className="mt-20 text-center">
            <p className={`text-sm font-bold uppercase tracking-widest mb-8 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Our users work at leading companies
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-3xl mx-auto">
              {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'IBM'].map((company) => (
                <div 
                  key={company} 
                  className={`flex items-center justify-center font-bold text-xl ${
                    isDark ? 'text-gray-300' : 'text-gray-800'
                  }`}
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
