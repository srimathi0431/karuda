import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-gray-800 mt-20 border-t border-orange-100">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand with Logo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/images/splash.png" 
                alt="Karuda Logo" 
                className="h-10 w-auto"
              />
              <img 
                src="/images/word.png" 
                alt="Karuda" 
                className="h-7 w-auto"
              />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-3">
              SRI KARUDA NETWORK MARKETING
            </p>
            <p className="text-gray-600 mb-4 text-sm">
              Your destination for curated fashion packages and lifestyle essentials.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  N.K.N Complex 2nd Floor - Easwaran Kovil Backside Karur
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <a href="tel:9629266357" className="text-gray-600 hover:text-primary-600 transition-colors">
                  9629266357
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <a href="mailto:Srikurudanetworkmarketting@gmail.com" className="text-gray-600 hover:text-primary-600 transition-colors break-all">
                  Srikurudanetworkmarketting@gmail.com
                </a>
              </li>
            </ul>
            
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/919629266357?text=Hello%20Sri%20Karuda%20Network%20Marketing%2C%20I%20would%20like%20to%20know%20more%20about%20your%20packages."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" onClick={scrollToTop} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">Home</Link></li>
              <li><Link to="/packages" onClick={scrollToTop} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">Packages</Link></li>
              <li><Link to="/shop" onClick={scrollToTop} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">Products</Link></li>
              <li><Link to="/tracking" onClick={scrollToTop} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">Track Order</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-orange-200 pt-8">
          <p className="text-gray-600 text-sm text-center">
            © 2024 SRI KARUDA NETWORK MARKETING. All rights reserved.
          </p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919629266357?text=Hello%20Sri%20Karuda%20Network%20Marketing%2C%20I%20would%20like%20to%20know%20more%20about%20your%20packages."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group"
        aria-label="Chat on WhatsApp"
      >
        <div className="relative">
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          
          {/* WhatsApp Button */}
          <div className="relative w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          
          {/* Tooltip on hover - Desktop only */}
          <div className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
              Chat with us
            </div>
          </div>
        </div>
      </a>
    </footer>
  );
};

export default Footer;
