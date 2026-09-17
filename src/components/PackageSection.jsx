import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PackageCard from './PackageCard';
import { getAvailablePackages } from '../data/packages';

const PackageSection = () => {
  const navigate = useNavigate();
  const packages = getAvailablePackages();

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-rose-600 tracking-widest uppercase mb-3">
            Premium Packages
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Curated Fashion Packages
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Explore our carefully curated KARUDA packages, designed for customers looking for a complete fashion selection at an attractive package price.
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Package Price</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                ₹6,000
              </p>
            </div>
          </div>
        </div>

        {/* Package Grid - Show all 6 packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>

        {/* View All Button - Only if more than 6 packages exist */}
        {packages.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => navigate('/packages')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              View All Packages
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PackageSection;
