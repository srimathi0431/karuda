// KARUDA PREMIUM FASHION PACKAGES
// Price: ₹6,000
// Package includes both fashion items (dresses/sarees/ethnic wear) and electronics
// Edit this file to update package information

export const packages = [
  {
    id: 1,
    name: "₹6,000 Package",
    price: 6000,
    originalPrice: null,
    images: [
      "/images/package.png",
      "/images/saree.png",
      "/images/induction.png"
    ],
    description: "Perfect package combining fashion essentials with electronics. Get started with style and technology.",
    products: [],
    itemCount: 5,
    discount: null,
    badge: "Popular",
    available: true,
    includes: "Fashion Items + Electronics"
  }
];

// Helper function to get package by ID
export const getPackageById = (id) => {
  return packages.find(pkg => pkg.id === parseInt(id));
};

// Helper function to get available packages
export const getAvailablePackages = () => {
  return packages.filter(pkg => pkg.available);
};
