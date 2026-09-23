import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mlmAPI } from '../../services/api';
import { FaChartLine, FaCalendar, FaDownload, FaSearch } from 'react-icons/fa';

const BonusReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [bonusType, setBonusType] = useState('direct'); // 'direct' or 'matching'
  const [directBonuses, setDirectBonuses] = useState([]);
  const [matchingHistory, setMatchingHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchBonusData();
  }, [bonusType]);

  const fetchBonusData = async () => {
    try {
      setLoading(true);
      if (bonusType === 'direct') {
        // Fetch all direct bonuses (no username filter for admin)
        const response = await mlmAPI.getDirectBonuses(null);
        if (response.success) {
          setDirectBonuses(response.bonuses || []);
        }
      } else {
        // Fetch all matching history (no username filter for admin)
        const response = await mlmAPI.getMatchingHistory(null);
        if (response.success) {
          setMatchingHistory(response.matches || []);
        }
      }
    } catch (error) {
      console.error('Error fetching bonus data:', error);
      alert('Failed to load bonus reports');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredData = () => {
    const data = bonusType === 'direct' ? directBonuses : matchingHistory;
    
    return data.filter(item => {
      // Search filter
      const searchMatch = !searchTerm || 
        item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.referrer_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date filter
      const itemDate = new Date(item.credited_at || item.matched_at);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;
      
      const dateMatch = (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);
      
      return searchMatch && dateMatch;
    });
  };

  const getTotalAmount = () => {
    return filteredData().reduce((sum, item) => sum + parseFloat(item.bonus_amount), 0);
  };

  const exportToCSV = () => {
    const data = filteredData();
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    let csvContent = '';
    
    if (bonusType === 'direct') {
      csvContent = 'Bonus ID,Referrer,Referred User,Package Amount,Bonus Amount,Date\n';
      data.forEach(item => {
        csvContent += `${item.bonus_id},"${item.referrer_name}","${item.referred_name}",${item.package_amount},${item.bonus_amount},"${formatDate(item.credited_at)}"\n`;
      });
    } else {
      csvContent = 'Match ID,User,Left Volume,Right Volume,Matched Volume,Bonus Amount,Date\n';
      data.forEach(item => {
        csvContent += `${item.match_id},"${item.username}",${item.left_volume},${item.right_volume},${item.matched_volume},${item.bonus_amount},"${formatDate(item.matched_at)}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${bonusType}_bonus_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bonus reports...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <FaChartLine className="text-3xl text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bonus Reports</h1>
              <p className="text-gray-600 mt-1">View and analyze direct and matching bonus distribution</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600 text-sm font-medium">Total Records</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">{filteredData().length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-sm font-medium">Total Bonus Paid</p>
            <p className="text-2xl font-bold text-green-800 mt-1">₹{getTotalAmount().toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-600 text-sm font-medium">Report Type</p>
            <p className="text-xl font-bold text-purple-800 mt-1">
              {bonusType === 'direct' ? 'Direct Bonus (10%)' : 'Matching Bonus (10%)'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Bonus Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bonus Type</label>
              <select
                value={bonusType}
                onChange={(e) => setBonusType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="direct">Direct Bonus</option>
                <option value="matching">Matching Bonus</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search User</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Username..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaDownload />
              Export to CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {bonusType === 'direct' ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bonus ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referred User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bonus Amount (10%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData().length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No direct bonuses found
                      </td>
                    </tr>
                  ) : (
                    filteredData().map((bonus) => (
                      <tr key={bonus.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bonus.bonus_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{bonus.referrer_name}</p>
                            <p className="text-sm text-gray-500">@{bonus.referrer_username}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{bonus.referred_name}</p>
                            <p className="text-sm text-gray-500">@{bonus.referred_username}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{parseFloat(bonus.package_amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          ₹{parseFloat(bonus.bonus_amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(bonus.credited_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Left Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Right Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matched Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bonus Amount (10%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carry Forward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData().length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No matching bonuses found
                      </td>
                    </tr>
                  ) : (
                    filteredData().map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {match.match_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{match.name}</p>
                            <p className="text-sm text-gray-500">@{match.username}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{parseFloat(match.left_volume).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{parseFloat(match.right_volume).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          ₹{parseFloat(match.matched_volume).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          ₹{parseFloat(match.bonus_amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                          Left: ₹{parseFloat(match.left_carry_forward || 0).toLocaleString()}<br />
                          Right: ₹{parseFloat(match.right_carry_forward || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(match.matched_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BonusReportsPage;
