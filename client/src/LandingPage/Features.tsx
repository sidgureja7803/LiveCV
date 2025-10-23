import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, Award, Shield, FileText } from 'lucide-react';

// Company Logo component to replace CDN images with inline SVGs
const CompanyLogo = ({ name, color }: { name: string; color: string }) => {
  switch (name) {
    case 'Google':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      );
    case 'Microsoft':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M0 0h11.377v11.377H0zm12.623 0H24v11.377H12.623zm0 12.623H24V24H12.623zm-12.623 0h11.377V24H0z"/>
        </svg>
      );
    case 'Apple':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.25 1.79 2.66 3.12 2.61s1.75-.82 3.28-.82 2 .82 3.3.79 2.22-1.24 3.06-2.47a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.1z"/>
        </svg>
      );
    case 'Amazon':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M.045 11.899c2.111-.003 3.955 1.963 3.955 4.075 0 2.111-1.851 3.807-3.962 3.807S0 18.085 0 15.974c0-2.112 1.934-4.072 4.045-4.075zm16.003-7.774c1.461-.012 2.616 1.32 2.616 2.787 0 1.466-1.262 2.34-2.723 2.352-1.461.012-2.615-1.096-2.615-2.563.001-1.466 1.261-2.563 2.722-2.576zm-7.988.717c2.42.012 4.635 2.787 4.635 5.224 0 2.437-2.275 4.336-4.696 4.323-2.42-.012-4.634-2.009-4.634-4.445 0-2.438 2.275-5.113 4.695-5.102zm7.95 7.774c2.42-.012 4.699 2.172 4.699 4.609 0 2.437-2.279 4.289-4.699 4.301-2.42.012-4.688-1.853-4.688-4.29 0-2.436 2.268-4.609 4.688-4.62zm-8.123.249c.12 0 .232.123.232.245v3.298c0 .122-.113.245-.232.245h-4.393c-.12 0-.232-.123-.232-.245v-3.298c0-.122.113-.245.232-.245h4.393z"/>
        </svg>
      );
    case 'Meta':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M12.562 8.45c2.0185-.06325 1.3656 1.0503 1.3812 3.053 1.6452 0 3.2904.0005 4.9361-.0003 0 1.4391.0001 2.8776-.0003 4.3167-1.6452 0-3.29.0002-4.9347.0003 0 4.1474.0007 8.2948-.0008 12.442-1.7046 0-3.4089.0002-5.1137-.0003-.0302-4.1473-.0002-8.2944-.0002-12.442-1.056-.001-2.1122.0004-3.1687-.0008 0-1.4391-.0005-2.878 0-4.3167 1.0565.0002 2.1127-.0003 3.1692.0003 0-1.5392-.0655-3.3085 1.2564-3.797.8902-.3334 1.8959-.2555 2.8332-.26225 1.7194 0 3.4387-.00175 5.158.00525 0 1.3863.0006 2.7726-.0001 4.159-1.6452.0007-3.2907-.0005-4.9359.0008Z"/>
        </svg>
      );
    case 'Netflix':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 24V1.058L10.22 13.21v10.83z"/>
        </svg>
      );
    case 'Tesla':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M12 5.362l2.475-3.026s4.245.09 8.471 2.054c-1.082 1.636-3.231 2.438-3.231 2.438-.146-1.439-1.154-1.79-4.354-1.79L12 24 8.619 5.034c-3.18 0-4.188.354-4.335 1.792 0 0-2.146-.795-3.229-2.43C5.28 2.431 9.525 2.34 9.525 2.34L12 5.362l-.004.002H12v-.002zm0-3.899c3.415-.03 7.326.528 11.328 2.28.535-.968.672-1.395.672-1.395C19.625.612 15.528.015 12 0 8.472.015 4.375.61 0 2.349c0 0 .195.525.672 1.396C4.674 1.993 8.585 1.435 12 1.48v-.017z"/>
        </svg>
      );
    case 'IBM':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M1.126 18.756V5.204H22.88v13.552H1.126zM6.312 17.2V14.1h-1.98v.258h1.695v.859H4.332v.23h1.695v.965H4.332v.79h1.98zm0-4.04V7.934h-1.98v1.008h1.695v.908H4.332v.25h1.695v1.02H4.332v.998h1.98v.04zm11.367 4.04v-3.04h-1.027v2.203h-.648V14.16h-1.023v2.203h-.649V14.16h-1.023v3.04h4.37zm-2.133-4V11h-1.024v.887h-.98V11h-1.024v2.168h1.024v-.808h.98v.808h1.024zm2.133-1.797V7.973h-4.37v.762h1.672v1.633h1.027V8.735h1.671zm-5.52 5.797v-.761h-3.226v-3.285h-.882v4.046h4.108zM7.323 14.16v3.04h.887v-3.04h-.887zm0-4.119v1.148h.887V10.04h-.887zm0-2.106v1.066h.887V7.934h-.887zm11.53 5.148c0-.105.035-.136.14-.136h.887c.105 0 .152.03.152.136v.527h.887v-.687c0-.421-.238-.668-.692-.668h-1.43c-.46 0-.7.246-.7.668v1.383c0 .422.24.664.7.664h1.43c.454 0 .692-.242.692-.664v-.683h-.887v.515c0 .102-.047.137-.152.137h-.887c-.105 0-.14-.035-.14-.137v-1.125zm0-3.605c0-.106.035-.137.14-.137h.887c.105 0 .152.031.152.137v.527h.887v-.688c0-.422-.238-.664-.692-.664h-1.43c-.46 0-.7.242-.7.664v1.387c0 .418.24.664.7.664h1.43c.454 0 .692-.246.692-.664v-.687h-.887v.519c0 .102-.047.133-.152.133h-.887c-.105 0-.14-.031-.14-.133V9.477z"/>
        </svg>
      );
    case 'Adobe':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM1.5 1.5v21h21v-21zm19.5 19.5h-18v-18h18z"/>
        </svg>
      );
    case 'Intel':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" fill={color}>
          <path d="M7.828 2.25H5.346v12.5h2.482zm11.268 0h-2.223l-3.06 12.5h2.423l.453-2.438h2.535l.494 2.438h2.426zm-2.657 8.217l.863-4.47.794 4.47zM3.893 14.75h-.908V2.25H.88L.878 16.5a1.758 1.758 0 0 0 1.753 1.748h3.045v-1.773H3.893zm15.764-2.336c1.199 0 2.09-.496 2.09-1.972V8.437c0-1.3-.774-1.773-2.346-1.773-.298 0-.893.043-1.203.086V4.368c.149-.023.399-.046.548-.046.893 0 1.19.399 1.19 1.276v.26h1.872V5.53c0-2.045-.997-3.28-3.361-3.28h-.25c-2.363 0-3.36 1.235-3.36 3.28v4.911c0 2.432 1.296 3.31 3.67 3.31h.103c.311 0 .623-.02.893-.063v1.083c-.149.023-.462.046-.61.046-.893 0-1.243-.399-1.243-1.276v-.345H16.14v.394c0 2.044 1.224 3.279 3.587 3.279h.25c2.363 0 3.152-1.235 3.152-3.28v-1.972c0-1.75-.997-2.602-2.473-2.602h-1zm-1.414-1.091v-2.65c.168-.03.893-.053 1.05-.053.505 0 .655.233.655.738v1.33c0 .48-.15.682-.655.682-.168 0-.863-.047-1.05-.047zM3.892 7.246H1.468v5.756H.878V2.25h3.013zm6.02 2.438h.345c1.26 0 1.748-.625 1.748-2.254v-.756c0-1.63-.488-2.255-1.748-2.255h-.344zm0 1.58v3.736H7.43V2.25h2.781c2.312 0 3.416 1.019 3.416 3.942v.85c0 2.922-1.104 4.222-3.416 4.222z"/>
        </svg>
      );
    default:
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <span className="font-bold">{name.charAt(0)}</span>
        </div>
      );
  }
};

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

  // Companies data
  const companies = [
    { name: 'Google' },
    { name: 'Microsoft' },
    { name: 'Apple' },
    { name: 'Amazon' },
    { name: 'Meta' },
    { name: 'Netflix' },
    { name: 'Tesla' },
    { name: 'IBM' },
    { name: 'Adobe' },
    { name: 'Intel' }
  ];
  
  // Logo colors based on theme
  const logoColor = isDark ? '#FFFFFF' : '#333333';

  return (
    <>
      {/* Company Logos Section - Infinite Scroll */}
      <section className={`py-16 overflow-hidden ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <p className={`text-center text-sm font-bold uppercase tracking-widest mb-12 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Trusted by professionals at
          </p>
          
          {/* Infinite Scrolling Container */}
          <div className="relative">
            {/* Gradient Overlays */}
            <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 ${
              isDark 
                ? 'bg-gradient-to-r from-gray-800/90 to-transparent' 
                : 'bg-gradient-to-r from-gray-50 to-transparent'
            }`}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 ${
              isDark 
                ? 'bg-gradient-to-l from-gray-800/90 to-transparent' 
                : 'bg-gradient-to-l from-gray-50 to-transparent'
            }`}></div>
            
            {/* Scrolling Track */}
            <div className="flex animate-scroll">
              {/* First set of logos */}
              {companies.map((company, index: number) => (
                <div
                  key={`first-${index}`}
                  className={`flex-shrink-0 mx-8 px-8 py-6 rounded-2xl ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  } shadow-lg hover:scale-110 transition-transform duration-300 group`}
                >
                  <div className="flex items-center space-x-4">
                    <CompanyLogo 
                      name={company.name} 
                      color={logoColor}
                    />
                    <span className={`text-xl font-bold ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {company.name}
                    </span>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {companies.map((company, index: number) => (
                <div
                  key={`second-${index}`}
                  className={`flex-shrink-0 mx-8 px-8 py-6 rounded-2xl ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  } shadow-lg hover:scale-110 transition-transform duration-300 group`}
                >
                  <div className="flex items-center space-x-4">
                    <CompanyLogo 
                      name={company.name} 
                      color={logoColor}
                    />
                    <span className={`text-xl font-bold ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {company.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
                className={`group p-8 rounded-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                  isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-2xl'
                } border-2 ${isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-blue-300'} relative overflow-hidden`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className={`mb-6 bg-gradient-to-r ${feature.color} p-4 rounded-2xl inline-block text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-blue-600 transition-colors duration-300`}>
                  {feature.title}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
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
