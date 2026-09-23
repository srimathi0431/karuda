// KARUDA PREMIUM FASHION PACKAGES
// Price Range: ₹6,000 - ₹12,000
// Each package includes both fashion items (dresses/sarees/ethnic wear) and electronics
// Edit this file to update package information

export const packages = [
  {
    id: 1,
    name: "₹6,000 Package",
    price: 6000,
    originalPrice: null,
    images: [
      "/images/package.png",
      "/images/image.png",
      "/images/image1.png"
    ],
    description: "Perfect package combining fashion essentials with electronics. Get started with style and technology.",
    products: [],
    itemCount: 5,
    discount: null,
    badge: "Popular",
    available: true,
    includes: "Fashion Items + Electronics"
  },
  {
    id: 2,
    name: "₹12,000 Package",
    price: 12000,
    originalPrice: null,
    images: [
      "/images/package.png",
      "/images/image1.png",
      "/images/image.png"
    ],
    description: "Premium package with curated fashion items and smart gadgets. Perfect blend of fashion and technology.",
    products: [],
    itemCount: 5,
    discount: null,
    badge: "Premium",
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
