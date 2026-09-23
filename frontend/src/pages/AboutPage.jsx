const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-cover bg-center py-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80)' }}>
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
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"
                alt="Fashion"
                className="rounded-lg shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                alt="Shopping"
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
              },
              {
                title: 'Customer Focused',
                desc: 'Your satisfaction is our priority. We\'re here to make your shopping experience perfect.',
              },
              {
                title: 'Sustainable Fashion',
                desc: 'We believe in responsible fashion that respects both people and the planet.',
              },
            ].map((value, index) => (
              <div key={index} className="card p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '5000+', label: 'Happy Customers' },
              { number: '200+', label: 'Dress Styles' },
              { number: '50+', label: 'Cities Served' },
              { number: '4.8★', label: 'Average Rating' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-5xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative bg-cover bg-center py-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80)' }}>
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
