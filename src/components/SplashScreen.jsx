import { useState, useEffect } from 'react';
import '../styles/SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [showEagle, setShowEagle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Prevent body scroll during splash
    document.body.style.overflow = 'hidden';

    // Show eagle after brief delay
    const eagleTimer = setTimeout(() => {
      setShowEagle(true);
    }, 200);

    // Auto fade out after 4 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      // Complete splash screen after fade
      setTimeout(() => {
        document.body.style.overflow = 'unset';
        onComplete();
      }, 800);
    }, 4000);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(eagleTimer);
      clearTimeout(fadeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* Animated background particles */}
      <div className="splash-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      {/* Golden glow backdrop */}
      <div className="splash-glow" />

      <div className="splash-content">
        {/* Eagle Image - ONLY ELEMENT */}
        <div className={`splash-eagle-container ${showEagle ? 'visible' : ''}`}>
          <div className="eagle-glow-circle" />
          <img 
            src="/images/splash.png" 
            alt="Karuda" 
            className="splash-eagle"
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
