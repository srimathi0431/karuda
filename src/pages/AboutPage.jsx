const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-cover bg-center py-20" style={{ backgroundImage: 'url(/images/image.png)' }}>
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="container-custom text-center relative z-10">
          <h1 className="text-5xl font-display font-bold mb-6 animate-fade-in text-gray-900">About Karuda</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto animate-slide-up">
            Your trusted destination for elegant and timeless fashion
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Karuda was born from a simple belief: every woman deserves to feel beautiful, confident, and empowered in what she wears.
              </p>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Founded in 2020, we started with a small collection of handpicked dresses and a big dream - to make high-quality, fashionable clothing accessible to everyone.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Today, we're proud to serve thousands of happy customers across India, offering a carefully curated selection of dresses for every occasion, style, and personality.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/package.png"
                alt="Packages"
                className="rounded-lg shadow-lg"
              />
              <img
                src="/images/saree.png"
                alt="Saree Collection"
                className="rounded-lg shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-display font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality First',
                desc: 'We never compromise on quality. Every dress is carefully inspected to meet our high standards.',
                image: '/images/saree.png'
              },
              {
                title: 'Customer Focused',
                desc: 'Your satisfaction is our priority. We\'re here to make your shopping experience perfect.',
                image: '/images/induction.png'
              },
              {
                title: 'Sustainable Fashion',
                desc: 'We believe in responsible fashion that respects both people and the planet.',
                image: '/images/lic.png'
              },
            ].map((value, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-xl transition-shadow">
                <div className="mb-6">
                  <img 
                    src={value.image} 
                    alt={value.title}
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-md"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase Gallery */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-display font-bold mb-12 text-center">Our Collections</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group">
              <img 
                src="/images/saree.png" 
                alt="Saree Collection"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <p className="text-white font-bold text-lg p-4">Saree Collection</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group">
              <img 
                src="/images/package.png" 
                alt="Premium Packages"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <p className="text-white font-bold text-lg p-4">Premium Packages</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group">
              <img 
                src="/images/lic.png" 
                alt="Insurance Services"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <p className="text-white font-bold text-lg p-4">Insurance Services</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group">
              <img 
                src="/images/sanathnam.png" 
                alt="Santhana Kinnam"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <p className="text-white font-bold text-lg p-4">Santhana Kinnam</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group">
              <img 
                src="/images/induction.png" 
                alt="Induction Stove"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <p className="text-white font-bold text-lg p-4">Induction Stove</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container-custom">
          {/* Logo/Brand Section */}
          <div className="flex justify-center mb-12">
            <img 
              src="/images/Symbole.png" 
              alt="Karuda Symbol" 
              className="h-24 w-auto"
            />
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '5000+', label: 'Happy Customers' },
              { number: '200+', label: 'Dress Styles' },
              { number: '50+', label: 'Cities Served' },
              { number: '4.8★', label: 'Average Rating' },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="text-5xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Brand Logo */}
          <div className="flex justify-center mt-12">
            <img 
              src="/images/word.png" 
              alt="Karuda" 
              className="h-16 w-auto"
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative bg-cover bg-center py-20" style={{ backgroundImage: 'url(/images/image1.png)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/85 to-purple-900/85"></div>
        <div className="container-custom text-center relative z-10">
          <h2 className="text-4xl font-display font-bold mb-6 text-white">Get in Touch</h2>
          <p className="text-xl mb-8 text-white">We'd love to hear from you!</p>
          <div className="flex flex-wrap justify-center gap-8 text-lg text-white">
            <div>
              <p className="font-semibold mb-1">Email</p>
              <p className="break-all text-sm">Srikurudanetworkmarkitting@gmail.com</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Phone</p>
              <p>9629266357</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Address</p>
              <p>123 Fashion Street, Mumbai, India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
