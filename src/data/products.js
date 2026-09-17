export const products = [
  {
    id: 1,
    name: "Saree",
    price: 2999,
    originalPrice: 4999,
    image: "/images/saree.png",
    category: "fashion",
    subcategory: "saree",
    rating: 4.9,
    reviews: 234,
    badge: "Popular"
  },
  {
    id: 2,
    name: "LIC",
    price: 5000,
    originalPrice: null,
    image: "/images/lic.png",
    category: "insurance",
    subcategory: "life",
    rating: 4.9,
    reviews: 445,
    badge: "Trusted"
  },
  {
    id: 3,
    name: "Santhana Kinnam",
    price: 499,
    originalPrice: 799,
    image: "/images/sanathnam.png",
    category: "ayurveda",
    subcategory: "powder",
    rating: 4.7,
    reviews: 156,
    badge: "Natural"
  },
  {
    id: 4,
    name: "Induction Stove",
    price: 1999,
    originalPrice: 2999,
    image: "/images/induction.png",
    category: "electronics",
    subcategory: "kitchen",
    rating: 4.8,
    reviews: 189,
    badge: "Bestseller"
  },
  {
    id: 5,
    name: "Maligai Porulgal",
    price: 1499,
    originalPrice: 1999,
    image: "/images/package.png",
    category: "grocery",
    subcategory: "essentials",
    rating: 4.8,
    reviews: 312,
    badge: "Fresh"
  }
];

export const categories = [
  { id: "fashion", name: "Fashion", slug: "fashion", icon: "👗" },
  { id: "electronics", name: "Electronics", slug: "electronics", icon: "📱" },
  { id: "ayurveda", name: "Ayurveda", slug: "ayurveda", icon: "🌿" },
  { id: "insurance", name: "Insurance", slug: "insurance", icon: "🛡️" },
  { id: "grocery", name: "Grocery", slug: "grocery", icon: "🛒" }
];

export const collections = {
  sarees: {
    title: "Saree Collection",
    description: "Traditional elegance • Included in packages",
    products: products.filter(p => p.category === "fashion")
  },
  electronics: {
    title: "Electronics Collection",
    description: "Modern technology • Included in packages",
    products: products.filter(p => p.category === "electronics")
  },
  ayurveda: {
    title: "Ayurveda Collection",
    description: "Natural products • Included in packages",
    products: products.filter(p => p.category === "ayurveda")
  },
  insurance: {
    title: "Insurance Services",
    description: "Life security • Included in packages",
    products: products.filter(p => p.category === "insurance")
  },
  grocery: {
    title: "Grocery Essentials",
    description: "Daily needs • Included in packages",
    products: products.filter(p => p.category === "grocery")
  }
};
