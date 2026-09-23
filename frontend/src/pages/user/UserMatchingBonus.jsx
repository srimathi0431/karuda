import React, { useState } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useUserPanel } from '../../context/UserPanelContext';
import UserPagination from '../../components/user/UserPagination';
import { FaSearch } from 'react-icons/fa';

const UserMatchingBonus = () => {
  const { matchingBonus = [], loading } = useUserPanel() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredBonus = matchingBonus.filter(
    (bonus) =>
      (bonus.transaction_id || bonus.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bonus.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBonus.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentBonus = filteredBonus.slice(startIndex, startIndex + rowsPerPage);

  const totalEarned = matchingBonus
    .filter(b => b.status === 'Credited')
    .reduce((sum, b) => sum + (b.bonus_amount || b.bonusAmount || 0), 0);

  const totalPending = matchingBonus
    .filter(b => b.status === 'Pending')
    .reduce((sum, b) => sum + (b.bonus_amount || b.bonusAmount || 0), 0);

  if (loading) {
    return (
      <UserPanelLayout>
        <div>
          <div className="card">
            <h1 className="page-title">Loading matching bonus...</h1>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div>
        {/* Header */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h1 className="page-title">Matching Bonus</h1>
          <p style={{ color: 'var(--gray-600)', marginTop: '8px' }}>Track your team matching bonuses</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="user-dashboard-stat-card">
            <p className="user-dashboard-stat-label">Total Earned</p>
            <p className="user-dashboard-stat-value" style={{ color: '#22c55e' }}>
              ₹{totalEarned.toLocaleString()}
            </p>
          </div>
          <div className="user-dashboard-stat-card">
            <p className="user-dashboard-stat-label">Pending</p>
            <p className="user-dashboard-stat-value" style={{ color: '#eab308' }}>
              ₹{totalPending.toLocaleString()}
            </p>
          </div>
          <div className="user-dashboard-stat-card">
            <p className="user-dashboard-stat-label">Total Transactions</p>
            <p className="user-dashboard-stat-value" style={{ color: '#3b82f6' }}>{matchingBonus.length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by description or status..."
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
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Left Points</th>
                <th>Right Points</th>
                <th>Matching Pairs</th>
                <th>Bonus Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentBonus.length > 0 ? (
                currentBonus.map((bonus) => (
                  <tr key={bonus.id}>
                    <td>{bonus.transaction_id || bonus.transactionId}</td>
                    <td>{new Date(bonus.bonus_date || bonus.date || bonus.created_at).toLocaleDateString()}</td>
                    <td>{bonus.left_points || bonus.leftPoints || 0}</td>
                    <td>{bonus.right_points || bonus.rightPoints || 0}</td>
                    <td>{bonus.matching_pairs || bonus.matchingPairs || 0}</td>
                    <td style={{ color: '#22c55e', fontWeight: 700 }}>
                      ₹{(bonus.bonus_amount || bonus.bonusAmount || 0).toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          bonus.status === 'Credited'
                            ? 'status-credited'
                            : bonus.status === 'Pending'
                            ? 'status-pending'
                            : 'status-failed'
                        }`}
                      >
                        {bonus.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="table-empty">
                    No matching bonus records found
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

export default UserMatchingBonus;
