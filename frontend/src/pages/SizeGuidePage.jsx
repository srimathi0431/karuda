import { Ruler } from 'lucide-react';

const SizeGuidePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Size Guide
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Find your perfect fit with our comprehensive size charts
            </p>
          </div>

          {/* Sarees */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-orange-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Ruler className="w-6 h-6 text-primary-600" />
              Sarees
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Saree Length</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Blouse Size</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">Standard</td>
                    <td className="px-4 py-3 text-sm text-gray-600">5.5 meters</td>
                    <td className="px-4 py-3 text-sm text-gray-600">S, M, L, XL</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Regular wear</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">Designer</td>
                    <td className="px-4 py-3 text-sm text-gray-600">6.0 meters</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Free size unstitched</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Special occasions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Women's Ethnic Wear */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-orange-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Women's Ethnic Wear</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Bust (inches)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Waist (inches)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Hip (inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">XS</td>
                    <td className="px-4 py-3 text-sm text-gray-600">30-32</td>
                    <td className="px-4 py-3 text-sm text-gray-600">24-26</td>
                    <td className="px-4 py-3 text-sm text-gray-600">34-36</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">S</td>
                    <td className="px-4 py-3 text-sm text-gray-600">32-34</td>
                    <td className="px-4 py-3 text-sm text-gray-600">26-28</td>
                    <td className="px-4 py-3 text-sm text-gray-600">36-38</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">M</td>
                    <td className="px-4 py-3 text-sm text-gray-600">34-36</td>
                    <td className="px-4 py-3 text-sm text-gray-600">28-30</td>
                    <td className="px-4 py-3 text-sm text-gray-600">38-40</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">L</td>
                    <td className="px-4 py-3 text-sm text-gray-600">36-38</td>
                    <td className="px-4 py-3 text-sm text-gray-600">30-32</td>
                    <td className="px-4 py-3 text-sm text-gray-600">40-42</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">XL</td>
                    <td className="px-4 py-3 text-sm text-gray-600">38-40</td>
                    <td className="px-4 py-3 text-sm text-gray-600">32-34</td>
                    <td className="px-4 py-3 text-sm text-gray-600">42-44</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">XXL</td>
                    <td className="px-4 py-3 text-sm text-gray-600">40-42</td>
                    <td className="px-4 py-3 text-sm text-gray-600">34-36</td>
                    <td className="px-4 py-3 text-sm text-gray-600">44-46</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Western Wear */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-orange-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Western Wear (Tops & Skirts)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">UK</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">US</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Bust (inches)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Waist (inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">XS</td>
                    <td className="px-4 py-3 text-sm text-gray-600">6</td>
                    <td className="px-4 py-3 text-sm text-gray-600">2</td>
                    <td className="px-4 py-3 text-sm text-gray-600">30-32</td>
                    <td className="px-4 py-3 text-sm text-gray-600">24-26</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">S</td>
                    <td className="px-4 py-3 text-sm text-gray-600">8</td>
                    <td className="px-4 py-3 text-sm text-gray-600">4</td>
                    <td className="px-4 py-3 text-sm text-gray-600">32-34</td>
                    <td className="px-4 py-3 text-sm text-gray-600">26-28</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">M</td>
                    <td className="px-4 py-3 text-sm text-gray-600">10</td>
                    <td className="px-4 py-3 text-sm text-gray-600">6</td>
                    <td className="px-4 py-3 text-sm text-gray-600">34-36</td>
                    <td className="px-4 py-3 text-sm text-gray-600">28-30</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">L</td>
                    <td className="px-4 py-3 text-sm text-gray-600">12</td>
                    <td className="px-4 py-3 text-sm text-gray-600">8</td>
                    <td className="px-4 py-3 text-sm text-gray-600">36-38</td>
                    <td className="px-4 py-3 text-sm text-gray-600">30-32</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">XL</td>
                    <td className="px-4 py-3 text-sm text-gray-600">14</td>
                    <td className="px-4 py-3 text-sm text-gray-600">10</td>
                    <td className="px-4 py-3 text-sm text-gray-600">38-40</td>
                    <td className="px-4 py-3 text-sm text-gray-600">32-34</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Measurement Guide */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">How to Measure</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Bust</h3>
                <p className="text-sm opacity-90">Measure around the fullest part of your bust, keeping the tape parallel to the floor</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Waist</h3>
                <p className="text-sm opacity-90">Measure around your natural waistline, keeping the tape comfortably loose</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Hip</h3>
                <p className="text-sm opacity-90">Measure around the fullest part of your hips, approximately 8 inches below your waist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
