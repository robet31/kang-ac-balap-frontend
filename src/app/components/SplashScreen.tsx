import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import logoImage from 'figma:asset/02aef87afa090fdbcaef1cdcae0089d551235b8e.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast, smooth loading animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Quick completion
          setTimeout(onComplete, 100);
          return 100;
        }
        // Fast increment - completes in ~1 second
        return prev + 10;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0d47a1] via-[#1976d2] to-[#42a5f5]">
      {/* Subtle Background Effect */}
      <motion.div
        className="absolute inset-0 bg-white/5"
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Logo - Smooth Entry */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Logo Circle */}
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
              <img src={logoImage} alt="YAMAHA Logo" className="w-full h-full object-contain opacity-95" />
            </div>
          </div>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-center mb-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
            YAMAHA
          </h1>
          <p className="text-white/90 text-base md:text-lg font-medium">
            Your Professional Motorcycle Workshop
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="w-64 max-w-full"
        >
          <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="absolute inset-y-0 left-0 bg-white rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          {/* Loading Text */}
          <p className="text-center text-white/80 text-sm mt-3 font-medium">
            Memuat aplikasi...
          </p>
        </motion.div>
      </div>
    </div>
  );
}