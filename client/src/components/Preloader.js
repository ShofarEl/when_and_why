const Preloader = ({ isLoading, message = "Loading..." }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        {/* Rolling/Spinning Logo */}
        <div className="relative mb-6">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-xl border-2 border-slate-100 flex items-center justify-center animate-spin">
            <img 
              src="/logo.png" 
              alt="iNSIGHT AI" 
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>
          {/* Outer ring animation */}
          <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 border-4 border-slate-100 border-t-slate-600 rounded-full animate-spin"></div>
          {/* Inner pulse ring */}
          <div className="absolute inset-2 w-16 h-16 md:w-20 md:h-20 border-2 border-slate-200 border-b-slate-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-3">
          <p className="text-slate-700 font-semibold text-base md:text-lg">{message}</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;