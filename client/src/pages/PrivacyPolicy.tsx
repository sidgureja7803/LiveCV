import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, AlertCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    document.title = 'Privacy Policy | LiveCV';
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Privacy Policy
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
                <Eye className="w-8 h-8 text-green-600" />
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Your Privacy Matters
                </h2>
              </div>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                At LiveCV, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our resume building platform.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {/* Information We Collect */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <Database className="w-6 h-6 mr-3 text-blue-600" />
                  1. Information We Collect
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Personal Information
                  </h4>
                  <ul className={`list-disc list-inside space-y-2 mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Name, email address, and contact information</li>
                    <li>Professional information (work experience, education, skills)</li>
                    <li>Account credentials and authentication data</li>
                    <li>Profile information and preferences</li>
                  </ul>
                  
                  <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Usage Information
                  </h4>
                  <ul className={`list-disc list-inside space-y-2 mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>How you interact with our platform</li>
                    <li>Features you use and time spent on our service</li>
                    <li>Device information and browser details</li>
                    <li>IP address and general location data</li>
                  </ul>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <Users className="w-6 h-6 mr-3 text-purple-600" />
                  2. How We Use Your Information
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                    We use your information to provide and improve our services:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Create and manage your resume documents</li>
                    <li>Provide personalized templates and suggestions</li>
                    <li>Enable ATS optimization features</li>
                    <li>Communicate with you about your account and our services</li>
                    <li>Improve our platform based on usage patterns</li>
                    <li>Ensure security and prevent fraud</li>
                  </ul>
                </div>
              </section>

              {/* Appwrite Integration */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <Lock className="w-6 h-6 mr-3 text-red-600" />
                  3. Data Storage with Appwrite
                </h3>
                <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} rounded-xl p-6 mb-6 border ${isDark ? 'border-gray-600' : 'border-blue-200'}`}>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-white fill-current"
                      >
                        <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.02 14.004H6.984v3.996h3.996v-3.996zm0-8.004H6.984v3.996h3.996V6zm5.016 0h-3.996v3.996h3.996V6zm0 8.004h-3.996v3.996h3.996v-3.996z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Powered by Appwrite
                      </h4>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        LiveCV uses Appwrite, a secure open-source backend-as-a-service platform, to store and manage your data. 
                        Appwrite provides enterprise-grade security with end-to-end encryption, ensuring your resume data is protected 
                        with industry-standard security measures.
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Security Features
                  </h4>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Data encryption in transit and at rest</li>
                    <li>Secure authentication and authorization</li>
                    <li>Regular security audits and updates</li>
                    <li>GDPR and privacy regulation compliance</li>
                    <li>Isolated data storage with access controls</li>
                  </ul>
                </div>
              </section>

              {/* Data Sharing */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  4. Data Sharing and Disclosure
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and prevent fraud</li>
                    <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
                  </ul>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  5. Your Privacy Rights
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                    You have the following rights regarding your personal information:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Access & Portability</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Request a copy of your personal data and export your resume information
                      </p>
                    </div>
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Correction</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Update or correct any inaccurate personal information
                      </p>
                    </div>
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Deletion</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Request deletion of your account and associated data
                      </p>
                    </div>
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Opt-out</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Unsubscribe from marketing communications at any time
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cookies and Tracking */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  6. Cookies and Tracking
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                    We use cookies and similar technologies to enhance your experience:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li><strong>Essential cookies:</strong> Required for basic functionality</li>
                    <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Analytics cookies:</strong> Help us understand how you use our service</li>
                  </ul>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mt-4`}>
                    You can control cookie settings through your browser preferences.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  7. Data Retention
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    We retain your personal information only as long as necessary to provide our services and comply with legal obligations. 
                    When you delete your account, we will permanently remove your personal data within 30 days, except where we are 
                    required to retain certain information for legal or regulatory purposes.
                  </p>
                </div>
              </section>

              {/* International Transfers */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  8. International Data Transfers
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    Your data may be processed and stored in countries other than your own. We ensure that any international 
                    transfers comply with applicable data protection laws and that your data receives adequate protection 
                    through appropriate safeguards.
                  </p>
                </div>
              </section>

              {/* Updates to Policy */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  9. Updates to This Policy
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                    We will notify you of significant changes by email or through our platform. The updated policy will be 
                    effective when posted.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  10. Contact Us
                </h3>
                <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                    If you have questions about this Privacy Policy or want to exercise your privacy rights, please contact us:
                  </p>
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      <strong>Privacy Officer:</strong> privacy@livecv.com
                    </p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      <strong>General Inquiries:</strong> support@livecv.com
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
              <div className={`flex items-start space-x-3 p-4 rounded-lg ${isDark ? 'bg-green-900/20' : 'bg-green-50'} border ${isDark ? 'border-green-800' : 'border-green-200'}`}>
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'} font-medium mb-1`}>
                    Your Trust is Important
                  </p>
                  <p className={`text-sm ${isDark ? 'text-green-200' : 'text-green-700'}`}>
                    We are committed to transparency and protecting your privacy. If you have any concerns or questions, 
                    please don't hesitate to reach out to us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-6">
          <Link 
            to="/terms-of-service" 
            className={`text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors`}
          >
            Terms of Service
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

export default PrivacyPolicy;