import { RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Returns & Exchange Policy
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Easy returns within 7 days
            </p>
          </div>

          {/* Return Process */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <RotateCcw className="w-6 h-6 text-primary-600" />
              How to Return
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Initiate Return</h3>
                  <p className="text-gray-600 text-sm">
                    Contact us within 7 days of delivery at Srikurudanetworkmarkitting@gmail.com or call 9629266357
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pack the Item</h3>
                  <p className="text-gray-600 text-sm">
                    Pack the product securely in its original packaging with all tags attached
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Schedule Pickup</h3>
                  <p className="text-gray-600 text-sm">
                    We'll arrange a free pickup from your address within 2-3 business days
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get Refund</h3>
                  <p className="text-gray-600 text-sm">
                    Refund will be processed within 5-7 business days after we receive the item
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligible & Non-Eligible */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Eligible for Return
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600 mt-1">✓</span>
                  Defective or damaged products
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600 mt-1">✓</span>
                  Wrong product delivered
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600 mt-1">✓</span>
                  Size/fit issues
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600 mt-1">✓</span>
                  Product not as described
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600 mt-1">✓</span>
                  Unused with original tags
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Not Eligible for Return
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-600 mt-1">✗</span>
                  Products without original tags
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-600 mt-1">✗</span>
                  Used or worn items
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-600 mt-1">✗</span>
                  Altered or damaged by customer
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-600 mt-1">✗</span>
                  Sale/clearance items
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-600 mt-1">✗</span>
                  After 7 days of delivery
                </li>
              </ul>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 text-sm">
                  <strong>Refund Method:</strong> Refunds will be credited to the original payment method
                </p>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 text-sm">
                  <strong>Exchange:</strong> Currently, we only offer refunds. You can place a new order for the desired item
                </p>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 text-sm">
                  <strong>Inspection:</strong> All returned items are inspected before refund approval
                </p>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 text-sm">
                  <strong>Return Shipping:</strong> Return shipping is free for defective/wrong items. ₹50 deducted for other returns
                </p>
              </div>
            </div>
          </div>

          {/* Contact for Returns */}
          <div className="mt-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Need Help with Returns?</h3>
            <p className="mb-6 opacity-90">Our customer service team is here to assist you</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:Srikurudanetworkmarkitting@gmail.com" className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:scale-105 transition-transform">
                Email Us
              </a>
              <a href="tel:9629266357" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-lg font-semibold hover:scale-105 transition-transform">
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
