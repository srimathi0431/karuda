import { useState } from 'react';
import PackageCard from '../components/PackageCard';
import { getAvailablePackages } from '../data/packages';

const PackagesPage = () => {
  const [packages] = useState(getAvailablePackages());

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center py-6 md:py-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-indigo-900/75 to-purple-900/80"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-xl md:text-6xl font-bold mb-1.5 md:mb-4 text-white leading-tight">
            Our Premium Packages
          </h1>
          <p className="text-xs md:text-2xl text-white/90 mb-2.5 md:mb-6">
            Choose the package that suits your style
          </p>
          
          {/* Single Package Price */}
          <div className="flex items-center justify-center mt-2.5 md:mt-8">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 md:px-8 md:py-4 rounded-full">
              <p className="text-xs md:text-sm text-white/80 mb-1">Package Price</p>
              <p className="text-2xl md:text-3xl font-bold text-white">₹6,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>

        {/* Empty State */}
        {packages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No packages available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
