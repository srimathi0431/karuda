import { Truck, Package, Clock, MapPin } from 'lucide-react';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Shipping Information
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Fast, reliable delivery across India
            </p>
          </div>

          {/* Shipping Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Free Shipping</h3>
              </div>
              <p className="text-gray-600 mb-2">On orders above ₹999</p>
              <p className="text-sm text-gray-500">Delivery in 5-7 business days</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Express Delivery</h3>
              </div>
              <p className="text-gray-600 mb-2">₹99 delivery charge</p>
              <p className="text-sm text-gray-500">Delivery in 2-3 business days</p>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary-600" />
                Processing Time
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-accent-600" />
                Delivery Areas
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We deliver across India to the following regions:
              </p>
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  All major cities
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Tier 2 & Tier 3 cities
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Rural areas (may take longer)
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Remote locations via courier
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Charges</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Order Value</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Shipping Charge</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Below ₹999</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹50</td>
                      <td className="px-4 py-3 text-sm text-gray-600">5-7 days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">₹999 and above</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">FREE</td>
                      <td className="px-4 py-3 text-sm text-gray-600">5-7 days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Express (any value)</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹99</td>
                      <td className="px-4 py-3 text-sm text-gray-600">2-3 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Delivery times are estimates and may vary depending on location and external factors. You will receive tracking information once your order is dispatched.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
