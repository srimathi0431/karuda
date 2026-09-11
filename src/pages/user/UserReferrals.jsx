import React, { useState } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useUserPanel } from '../../context/UserPanelContext';
import UserPagination from '../../components/user/UserPagination';
import { FaSearch, FaCopy, FaCheck } from 'react-icons/fa';

const UserReferrals = () => {
  const { referrals = [] } = useUserPanel() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const rowsPerPage = 10;

  // Mock referral link (in production, get from backend)
  const referralLink = `https://karuda.com/register?ref=USER123`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredReferrals = referrals.filter(
    (referral) =>
      (referral.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (referral.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (referral.mobile || '').includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredReferrals.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentReferrals = filteredReferrals.slice(startIndex, startIndex + rowsPerPage);

  return (
    <UserPanelLayout>
      <div>
        {/* Header */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h1 className="page-title" style={{ marginBottom: '16px' }}>My Referrals</h1>
          
          {/* Referral Link */}
          <div className="referral-link-card">
            <p className="referral-link-label">Your Referral Link:</p>
            <div className="referral-link-input-group">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="referral-link-input"
              />
              <button
                onClick={handleCopyLink}
                className="referral-copy-btn"
              >
                {copied ? <FaCheck /> : <FaCopy />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="referral-stats">
          <div className="user-dashboard-stat-card">
            <p className="user-dashboard-stat-label">Total Referrals</p>
            <p className="user-dashboard-stat-value" style={{ color: '#ec4899' }}>{referrals.length}</p>
          </div>
          <div className="user-dashboard-stat-card">
            <p className="user-dashboard-stat-label">Active Referrals</p>
            <p className="user-dashboard-stat-value" style={{ color: '#22c55e' }}>
              {referrals.filter(r => r.status === 'Active').length}
            </p>
          </div>
          <div className="user-dashboard-stat-card">
            <p className="user-dashboard-stat-label">Total Earnings</p>
            <p className="user-dashboard-stat-value" style={{ color: '#3b82f6' }}>
              ₹{referrals.reduce((sum, r) => sum + r.earnings, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {currentReferrals.length > 0 ? (
                currentReferrals.map((referral) => (
                  <tr key={referral.id}>
                    <td>{referral.name}</td>
                    <td>{referral.email}</td>
                    <td>{referral.mobile}</td>
                    <td>{new Date(referral.joiningDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${referral.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {referral.status}
                      </span>
                    </td>
                    <td style={{ color: '#22c55e', fontWeight: 600 }}>Level {referral.level}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="table-empty">
                    No referrals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </UserPanelLayout>
  );
};

export default UserReferrals;
