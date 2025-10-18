import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, Award, Shield, FileText } from 'lucide-react';

export const Features = () => {
  const { isDark } = useTheme();

  const features = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Lightning Fast',
      description: 'Generate professional PDFs in seconds with RenderCV engine',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'ATS Optimized',
      description: 'Beat applicant tracking systems with AI-powered optimization',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely with Appwrite',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: 'Multiple Themes',
      description: 'Professional templates designed for maximum impact',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const companies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'IBM'];

  return (
    <>
      {/* Company Logos Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <p className={`text-center text-sm font-bold uppercase tracking-widest mb-12 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Trusted by professionals at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {companies.map((company) => (
              <div
                key={company}
                className={`px-8 py-4 rounded-xl font-bold text-2xl ${
                  isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
                } shadow-lg hover:scale-110 transition-transform`}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Why Choose LiveCV?
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to create the perfect resume
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-3xl transition-all hover:scale-105 ${
                  isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-2xl'
                } border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className={`mb-6 bg-gradient-to-r ${feature.color} p-4 rounded-2xl inline-block text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-24 px-6 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              How It Works
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create your perfect resume in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { step: '1', title: 'Sign Up Free', desc: 'Create your account in seconds with email or OAuth', icon: <FileText className="w-12 h-12" /> },
              { step: '2', title: 'Choose Template', desc: 'Select from professional templates after login', icon: <FileText className="w-12 h-12" /> },
              { step: '3', title: 'Download & Apply', desc: 'Export your ATS-optimized PDF and land your dream job', icon: <FileText className="w-12 h-12" /> }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-3xl font-black mb-6`}>
                  {item.step}
                </div>
                <div className={`mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
