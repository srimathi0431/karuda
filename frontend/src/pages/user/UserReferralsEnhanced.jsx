import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useUserPanel } from '../../context/UserPanelContext';
import { useAuth } from '../../context/AuthContext';
import UserPagination from '../../components/user/UserPagination';
import { 
  FaSearch, FaCopy, FaCheck, FaWhatsapp, FaEnvelope, FaQrcode, 
  FaLightbulb, FaChartLine, FaUser, FaTrophy, FaClock, FaArrowUp,
  FaFacebook, FaTwitter, FaLinkedin, FaFileP, FaVideo
} from 'react-icons/fa';
import '../../styles/UserReferrals.css';

const UserReferralsEnhanced = () => {
  const { referrals = [], loading } = useUserPanel() || {};
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedLink, setCopiedLink] = useState('');
  const rowsPerPage = 10;

  // Mock data for tree strength (will come from API)
  const [treeStrength] = useState({
    leftStrength: 45,
    rightStrength: 55,
    leftCount: 12,
    rightCount: 15,
    leftVolume: 240000,
    rightVolume: 310000,
    weakerLeg: 'left',
    balancePercentage: 82
  });

  // Generate referral links
  const baseUrl = 'https://srikaruda.shop';
  const leftReferralLink = `${baseUrl}/${user?.username || 'karuda'}/left`;
  const rightReferralLink = `${baseUrl}/${user?.username || 'karuda'}/right`;

  // Stats data
  const stats = {
    totalReferrals: referrals.length || 27,
    activeMembers: referrals.filter(r => r.status === 'Active').length || 24,
    pendingApprovals: 3,
    weeklyEarnings: 45000
  };

  const handleCopyLink = (link, position) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(position);
    setTimeout(() => setCopiedLink(''), 2000);
  };

  const handleWhatsAppShare = (link, position) => {
    const message = `Join my team at Karuda! Use my ${position} leg referral link: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailShare = (link, position) => {
    const subject = 'Join My Karuda Network';
    const body = `Hi,\n\nI'd like to invite you to join my Karuda network through my ${position} leg.\n\nUse this link to sign up: ${link}\n\nLooking forward to working together!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="referral-hero">
          <p>Loading your referral network...</p>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div>
        {/* 1. HERO SECTION */}
        <div className="referral-hero">
          <div className="referral-hero-content">
            <div className="referral-avatar">
              {(user?.name || 'K').charAt(0).toUpperCase()}
            </div>
            <div className="referral-hero-info">
              <h2>🎯 Your Referral Network</h2>
              <p className="username">@{user?.username || 'karuda'}</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Build Your Empire | Earn Together</p>
              <span className="rank">⭐ Diamond Member</span>
            </div>
          </div>
        </div>

        {/* 2. SMART REFERRAL LINKS SECTION */}
        <div className="referral-links-section">
          <h3>📲 Share Your Referral Links</h3>
          <div className="referral-links-grid">
            {/* LEFT LEG */}
            <div className="referral-link-card left">
              <div className="referral-link-header">
                <h4>⬅️ LEFT LEG</h4>
              </div>
              <div className="link-stats">
                <div className="link-stat">
                  <p className="link-stat-value" style={{ color: '#10b981' }}>{treeStrength.leftStrength}%</p>
                  <p className="link-stat-label">Strength</p>
                </div>
                <div className="link-stat">
                  <p className="link-stat-value">{treeStrength.leftCount}</p>
                  <p className="link-stat-label">Members</p>
                </div>
                <div className="link-stat">
                  <p className="link-stat-value">₹{(treeStrength.leftVolume / 100000).toFixed(1)}L</p>
                  <p className="link-stat-label">Volume</p>
                </div>
              </div>
              <div className="referral-link-input">
                <input type="text" value={leftReferralLink} readOnly />
                <button 
                  className={`btn-copy ${copiedLink === 'left' ? 'copied' : ''}`}
                  onClick={() => handleCopyLink(leftReferralLink, 'left')}
                >
                  {copiedLink === 'left' ? <FaCheck /> : <FaCopy />}
                  {copiedLink === 'left' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="share-buttons">
                <button className="btn-share whatsapp" onClick={() => handleWhatsAppShare(leftReferralLink, 'LEFT')}>
                  <FaWhatsapp /> WhatsApp
                </button>
                <button className="btn-share email" onClick={() => handleEmailShare(leftReferralLink, 'LEFT')}>
                  <FaEnvelope /> Email
                </button>
                <button className="btn-share">
                  <FaQrcode /> QR Code
                </button>
              </div>
            </div>

            {/* RIGHT LEG */}
            <div className="referral-link-card right">
              <div className="referral-link-header">
                <h4>➡️ RIGHT LEG</h4>
              </div>
              <div className="link-stats">
                <div className="link-stat">
                  <p className="link-stat-value" style={{ color: '#3b82f6' }}>{treeStrength.rightStrength}%</p>
                  <p className="link-stat-label">Strength</p>
                </div>
                <div className="link-stat">
                  <p className="link-stat-value">{treeStrength.rightCount}</p>
                  <p className="link-stat-label">Members</p>
                </div>
                <div className="link-stat">
                  <p className="link-stat-value">₹{(treeStrength.rightVolume / 100000).toFixed(1)}L</p>
                  <p className="link-stat-label">Volume</p>
                </div>
              </div>
              <div className="referral-link-input">
                <input type="text" value={rightReferralLink} readOnly />
                <button 
                  className={`btn-copy ${copiedLink === 'right' ? 'copied' : ''}`}
                  onClick={() => handleCopyLink(rightReferralLink, 'right')}
                >
                  {copiedLink === 'right' ? <FaCheck /> : <FaCopy />}
                  {copiedLink === 'right' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="share-buttons">
                <button className="btn-share whatsapp" onClick={() => handleWhatsAppShare(rightReferralLink, 'RIGHT')}>
                  <FaWhatsapp /> WhatsApp
                </button>
                <button className="btn-share email" onClick={() => handleEmailShare(rightReferralLink, 'RIGHT')}>
                  <FaEnvelope /> Email
                </button>
                <button className="btn-share">
                  <FaQrcode /> QR Code
                </button>
              </div>
            </div>
          </div>

          {/* Smart Suggestion */}
          {treeStrength.weakerLeg && (
            <div className="balance-suggestion">
              <span className="balance-suggestion-icon">💡</span>
              <div className="balance-suggestion-text">
                <p>Smart Suggestion: Balance your tree!</p>
                <small>Add 3 more members to {treeStrength.weakerLeg.toUpperCase()} leg for bonus</small>
              </div>
            </div>
          )}
        </div>

        {/* 4. PERFORMANCE CARDS */}
        <div className="performance-cards">
          <div className="performance-card">
            <p className="performance-card-label">Total Referrals</p>
            <p className="performance-card-value primary">{stats.totalReferrals}</p>
            <p className="performance-card-change positive">
              <FaArrowUp /> +3 this week
            </p>
          </div>
          <div className="performance-card">
            <p className="performance-card-label">Active Members</p>
            <p className="performance-card-value success">{stats.activeMembers}</p>
            <p className="performance-card-change positive">
              <FaArrowUp /> +2 this week
            </p>
          </div>
          <div className="performance-card">
            <p className="performance-card-label">Pending Approvals</p>
            <p className="performance-card-value" style={{ color: '#f59e0b' }}>{stats.pendingApprovals}</p>
            <p className="performance-card-change positive">
              <FaArrowUp /> +1 today
            </p>
          </div>
          <div className="performance-card">
            <p className="performance-card-label">Earnings This Week</p>
            <p className="performance-card-value info">₹{(stats.weeklyEarnings / 1000).toFixed(0)}K</p>
            <p className="performance-card-change positive">
              <FaArrowUp /> +12%
            </p>
          </div>
        </div>

        {/* 3. BINARY TREE VISUALIZATION */}
        <div className="tree-visualization">
          <h3>🌳 Your Binary Tree</h3>
          <div className="tree-container">
            <div className="tree-node">
              <h4>YOU - {user?.name || 'Karuda'}</h4>
              <p>Level 0 | Diamond</p>
            </div>
            <div className="tree-children">
              <div className="tree-child left">
                <h5>⬅️ LEFT</h5>
                <p>{treeStrength.leftCount} members</p>
                <p style={{ color: '#10b981', fontWeight: 600 }}>₹{(treeStrength.leftVolume / 100000).toFixed(1)}L volume</p>
              </div>
              <div className="tree-child right">
                <h5>➡️ RIGHT</h5>
                <p>{treeStrength.rightCount} members</p>
                <p style={{ color: '#3b82f6', fontWeight: 600 }}>₹{(treeStrength.rightVolume / 100000).toFixed(1)}L volume</p>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-share">
                <FaChartLine /> View Full Tree
              </button>
              <button className="btn-share">
                📊 Analytics
              </button>
            </div>
          </div>
        </div>

        {/* 7. SMART SHARE OPTIONS */}
        <div className="referral-links-section">
          <h3>🚀 Quick Share Tools</h3>
          <div className="share-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button className="btn-share">
              <FaWhatsapp /> WhatsApp Blast
            </button>
            <button className="btn-share">
              <FaEnvelope /> Email Campaign
            </button>
            <button className="btn-share">
              📲 SMS Campaign
            </button>
            <button className="btn-share">
              <FaFacebook /> Social Media
            </button>
            <button className="btn-share">
              <FaFileP /> Generate PDF
            </button>
            <button className="btn-share">
              <FaVideo /> Video Link
            </button>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            💬 Pre-written messages available!
          </p>
        </div>

        {/* 5. RECENT REFERRALS TABLE */}
        <div className="referral-table-section">
          <div className="referral-table-header">
            <h3>📊 Recent Activity</h3>
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {currentReferrals.length > 0 ? (
            <>
              <table className="referral-table">
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
                  {currentReferrals.map((referral) => (
                    <tr key={referral.id}>
                      <td>{referral.name}</td>
                      <td>{referral.email}</td>
                      <td>{referral.mobile}</td>
                      <td>{new Date(referral.joining_date || referral.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${referral.status === 'Active' ? 'active' : 'inactive'}`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="level-badge">Level {referral.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <UserPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h4>No referrals yet</h4>
              <p>Start sharing your referral links to build your network!</p>
            </div>
          )}
        </div>

        {/* 6. GAMIFICATION / ACHIEVEMENTS */}
        <div className="tree-visualization">
          <h3>🏆 Your Achievements</h3>
          <div style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#333' }}>🎯 Referral Milestones:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>✅</span>
                <span>10 Referrals - Unlocked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>✅</span>
                <span>25 Referrals - Unlocked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🔒</span>
                <span>50 Referrals - {stats.totalReferrals}/50 (Next: ₹10K bonus)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🔒</span>
                <span>100 Referrals - {stats.totalReferrals}/100</span>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>🎖️ Current Rank: Diamond</span>
                <span style={{ color: '#6b7280' }}>46%</span>
              </div>
              <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', width: '46%', height: '100%' }}></div>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                Next Rank: Platinum (Need 23 more members)
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default UserReferralsEnhanced;
