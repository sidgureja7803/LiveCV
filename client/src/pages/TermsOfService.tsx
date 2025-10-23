import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, FileText, Shield, Users, AlertCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    document.title = 'Terms of Service | LiveCV';
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10 backdrop-blur-sm`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Terms of Service
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
          <div className="p-8">
            {/* Introduction */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Welcome to LiveCV
                </h2>
              </div>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                These Terms of Service ("Terms") govern your use of LiveCV's resume building platform and services. 
                By accessing or using our service, you agree to be bound by these Terms.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {/* Acceptance of Terms */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  1. Acceptance of Terms
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    By creating an account or using LiveCV, you acknowledge that you have read, understood, 
                    and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, 
                    please do not use our service.
                  </p>
                </div>
              </section>

              {/* Service Description */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  2. Service Description
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                    LiveCV provides an online platform for creating, editing, and managing professional resumes. Our services include:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Resume templates and design tools</li>
                    <li>ATS (Applicant Tracking System) optimization features</li>
                    <li>PDF generation and export capabilities</li>
                    <li>Cloud storage for your resume data</li>
                    <li>AI-powered content suggestions (when available)</li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Contact Us
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                    If you have questions about these Terms, please contact us:
                  </p>
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      <strong>Email:</strong> legal@livecv.com
                    </p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Website:</strong> https://livecv.com/contact
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Notice */}
            <div className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`flex items-start space-x-3 p-4 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDark ? 'border-blue-800' : 'border-blue-200'}`}>
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'} font-medium mb-1`}>
                    Important Notice
                  </p>
                  <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                    These Terms constitute a legally binding agreement. Please read them carefully and contact us if you have any questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-6">
          <Link 
            to="/privacy-policy" 
            className={`text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors`}
          >
            Privacy Policy
          </Link>
          <Link 
            to="/" 
            className={`text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors`}
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;