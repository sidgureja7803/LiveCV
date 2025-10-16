import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 shadow-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            LiveCV
          </span> is working!
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Tailwind CSS is correctly configured and the styles are being applied.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-blue-300">
            <h3 className="text-xl font-semibold mb-2">Card 1</h3>
            <p>This demonstrates Tailwind's utility classes working correctly.</p>
          </div>
          
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-purple-300">
            <h3 className="text-xl font-semibold mb-2">Card 2</h3>
            <p>If you see styled cards, Tailwind is properly configured.</p>
          </div>
          
          <div className="bg-pink-500/20 border border-pink-500/30 rounded-lg p-4 text-pink-300">
            <h3 className="text-xl font-semibold mb-2">Card 3</h3>
            <p>Your LiveCV project is now ready for development!</p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
            Primary Button
          </button>
          <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all">
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
