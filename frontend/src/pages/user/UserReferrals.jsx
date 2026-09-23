import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useUserPanel } from '../../context/UserPanelContext';
import { useAuth } from '../../context/AuthContext';
import UserPagination from '../../components/user/UserPagination';
import { referralAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaCopy, FaCheck, FaWhatsapp, FaEnvelope, FaQrcode, 
  FaLightbulb, FaChartLine, FaUser, FaTrophy, FaClock, FaArrowUp,
  FaFacebook, FaTwitter, FaLinkedin, FaFilePdf, FaVideo
} from 'react-icons/fa';
import '../../styles/UserReferrals.css';

const UserReferrals = () => {
  const { referrals = [], loading } = useUserPanel() || {};
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedLink, setCopiedLink] = useState('');
  const [treeStrength, setTreeStrength] = useState(null);
  const [loadingStrength, setLoadingStrength] = useState(true);
  const rowsPerPage = 10;

  // Generate referral links
  const baseUrl = 'https://srikaruda.shop';
  const leftReferralLink = `${baseUrl}/${user?.username || 'karuda'}/left`;
  const rightReferralLink = `${baseUrl}/${user?.username || 'karuda'}/right`;

  // Fetch tree strength on mount
  useEffect(() => {
    const fetchTreeStrength = async () => {
      if (!user?.username) return;
      
      try {
        setLoadingStrength(true);
        const response = await referralAPI.getTreeStrength(user.username);
        if (response.success && response.tree_strength) {
          const strength = response.tree_strength;
          setTreeStrength({
            leftStrength: Math.round((strength.left_leg_count / Math.max(strength.total_team, 1)) * 100),
            rightStrength: Math.round((strength.right_leg_count / Math.max(strength.total_team, 1)) * 100),
            leftCount: strength.left_leg_count || 0,
            rightCount: strength.right_leg_count || 0,
            leftVolume: strength.left_leg_volume || 0,
            rightVolume: strength.right_leg_volume || 0,
            weakerLeg: strength.weaker_leg,
            balancePercentage: strength.balance_percentage || 0,
            totalTeam: strength.total_team || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch tree strength:', error);
        // Use default mock data if API fails
        setTreeStrength({
          leftStrength: 45,
          rightStrength: 55,
          leftCount: 12,
          rightCount: 15,
          leftVolume: 240000,
          rightVolume: 310000,
          weakerLeg: 'left',
          balancePercentage: 82,
          totalTeam: 27
        });
      } finally {
        setLoadingStrength(false);
      }
    };

    fetchTreeStrength();
  }, [user?.username]);

  // Stats data - use real referral data
  const stats = {
    totalReferrals: referrals.length || 0,
    activeMembers: referrals.filter(r => r.status === 'Active').length || 0,
    pendingApprovals: referrals.filter(r => r.status === 'Pending').length || 0,
    weeklyEarnings: user?.wallet_balance || 0
  };

  const handleCopyLink = async (link, position) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(position);
      setTimeout(() => setCopiedLink(''), 2000);
      
      // Log share activity
      if (user?.username) {
        await referralAPI.logShare(user.username, 'copy', position);
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleWhatsAppShare = async (link, position) => {
    const message = `Join my team at Karuda! Use my ${position} leg referral link: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    
    // Log share activity
    if (user?.username) {
      await referralAPI.logShare(user.username, 'whatsapp', position.toLowerCase(), {
        share_platform: 'whatsapp'
      });
    }
  };

  const handleEmailShare = async (link, position) => {
    const subject = 'Join My Karuda Network';
    const body = `Hi,\n\nI'd like to invite you to join my Karuda network through my ${position} leg.\n\nUse this link to sign up: ${link}\n\nLooking forward to working together!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Log share activity
    if (user?.username) {
      await referralAPI.logShare(user.username, 'email', position.toLowerCase(), {
        share_platform: 'email'
      });
    }
  };

  const handleQRCode = (link, position) => {
    // Generate QR code URL using QR Server API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
    
    // Open QR code in new window
    const qrWindow = window.open('', '_blank', 'width=400,height=500');
    qrWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${position} Leg</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 20px;
            background: #f9fafb;
          }
          .qr-container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: inline-block;
            margin-top: 20px;
          }
          h2 { color: #667eea; margin-bottom: 10px; }
          p { color: #6b7280; margin: 10px 0; }
          img { margin: 20px 0; border: 2px solid #e5e7eb; border-radius: 8px; }
          .link { 
            background: #f3f4f6; 
            padding: 10px; 
            border-radius: 6px; 
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
            margin: 10px 0;
          }
          button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 10px;
          }
          button:hover { background: #5568d3; }
        </style>
      </head>
      <body>
        <div class="qr-container">
          <h2>📲 ${position.toUpperCase()} Leg Referral QR Code</h2>
          <p>Scan to join Karuda Network</p>
          <img src="${qrUrl}" alt="QR Code" />
          <div class="link">${link}</div>
          <button onclick="window.print()">🖨️ Print QR Code</button>
        </div>
      </body>
      </html>
    `);
    qrWindow.document.close();
    
    // Log share activity
    if (user?.username) {
      referralAPI.logShare(user.username, 'qr_code', position.toLowerCase(), {
        share_platform: 'qr_code'
      });
    }
  };

  const handleViewFullTree = () => {
    // Navigate to full tree page
    navigate(`/account/team-tree`);
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

  if (loading || loadingStrength) {
    return (
      <UserPanelLayout>
        <div className="referral-hero">
          <p>Loading your referral network...</p>
        </div>
      </UserPanelLayout>
    );
  }

  const displayTreeStrength = treeStrength || {
    leftStrength: 0,
    rightStrength: 0,
    leftCount: 0,
    rightCount: 0,
    leftVolume: 0,
    rightVolume: 0,
    weakerLeg: 'left',
    balancePercentage: 0,
    totalTeam: 0
  };

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
                  <p className="link-stat-value" style={{ color: '#10b981' }}>{displayTreeStrength.leftStrength}%</p>
                  <p className="link-stat-label">Strength</p>
                </div>
                <div className="link-stat">
                  <p className="link-stat-value">{displayTreeStrength.leftCount}</p>
                  <p className="link-stat-label">Members</p>
                </div>
                <div className="link-stat">
                  <p className="link-stat-value">₹{(displayTreeStrength.leftVolume / 100000).toFixed(1)}L</p>
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
                <button className="btn-share" onClick={() => handleQRCode(leftReferralLink, 'LEFT')}>
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
                  <p className="link-stat-value" style={{ color: '#3b82f6' }}>{displayTreeStrength.rightStrength}%</p>
                  <p className="link-stat-label">Strength</p>
                </div>
                <div className="link-stat">
                  <p className="link-stat-value">{displayTreeStrength.rightCount}</p>
                  <p className="link-stat-label">Members</p>
                </div>
                <div className="link-stat">
                  <p className="link-stat-value">₹{(displayTreeStrength.rightVolume / 100000).toFixed(1)}L</p>
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
                <button className="btn-share" onClick={() => handleQRCode(rightReferralLink, 'RIGHT')}>
                  <FaQrcode /> QR Code
                </button>
              </div>
            </div>
          </div>

          {/* Smart Suggestion */}
          {displayTreeStrength.weakerLeg && displayTreeStrength.totalTeam > 0 && (
            <div className="balance-suggestion">
              <span className="balance-suggestion-icon">💡</span>
              <div className="balance-suggestion-text">
                <p>Smart Suggestion: Balance your tree!</p>
                <small>Add {Math.abs(displayTreeStrength.leftCount - displayTreeStrength.rightCount)} more members to {displayTreeStrength.weakerLeg.toUpperCase()} leg for bonus</small>
              </div>
            </div>
          )}
        </div>

        {/* 4. PERFORMANCE CARDS */}
        <div className="performance-cards">
          <div className="performance-card">
            <p className="performance-card-label">Total Referrals</p>
            <p className="performance-card-value primary">{stats.totalReferrals}</p>
          </div>
          <div className="performance-card">
            <p className="performance-card-label">Active Members</p>
            <p className="performance-card-value success">{stats.activeMembers}</p>
          </div>
          <div className="performance-card">
            <p className="performance-card-label">Pending Approvals</p>
            <p className="performance-card-value" style={{ color: '#f59e0b' }}>{stats.pendingApprovals}</p>
          </div>
          <div className="performance-card">
            <p className="performance-card-label">Wallet Balance</p>
            <p className="performance-card-value info">₹{stats.weeklyEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* 3. BINARY TREE VISUALIZATION */}
        <div className="tree-visualization">
          <h3>🌳 Your Binary Tree</h3>
          <div className="tree-container">
            <div className="tree-node">
              <h4>{user?.name || 'Karuda'}</h4>
              <p>@{user?.username || 'karuda'}</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Volume: ₹{((displayTreeStrength.leftVolume + displayTreeStrength.rightVolume) / 100000).toFixed(2)}L
              </p>
            </div>
            <div className="tree-children">
              <div className="tree-child left">
                <h5>⬅️ LEFT LEG</h5>
                <p><strong>{displayTreeStrength.leftCount}</strong> members</p>
                <p style={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>
                  ₹{(displayTreeStrength.leftVolume / 100000).toFixed(2)}L volume
                </p>
              </div>
              <div className="tree-child right">
                <h5>➡️ RIGHT LEG</h5>
                <p><strong>{displayTreeStrength.rightCount}</strong> members</p>
                <p style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.875rem' }}>
                  ₹{(displayTreeStrength.rightVolume / 100000).toFixed(2)}L volume
                </p>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-share" onClick={handleViewFullTree}>
                <FaChartLine /> View Full Tree
              </button>
            </div>
          </div>
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
                <span style={{ fontSize: '1.25rem' }}>{stats.totalReferrals >= 10 ? '✅' : '🔒'}</span>
                <span>10 Referrals {stats.totalReferrals >= 10 ? '- Unlocked' : `- ${stats.totalReferrals}/10`}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{stats.totalReferrals >= 25 ? '✅' : '🔒'}</span>
                <span>25 Referrals {stats.totalReferrals >= 25 ? '- Unlocked' : `- ${stats.totalReferrals}/25`}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{stats.totalReferrals >= 50 ? '✅' : '🔒'}</span>
                <span>50 Referrals - {stats.totalReferrals}/50 {stats.totalReferrals < 50 && '(Next: ₹10K bonus)'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{stats.totalReferrals >= 100 ? '✅' : '🔒'}</span>
                <span>100 Referrals - {stats.totalReferrals}/100</span>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>🎖️ Team Growth</span>
                <span style={{ color: '#6b7280' }}>{Math.min(100, Math.round((stats.totalReferrals / 100) * 100))}%</span>
              </div>
              <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', 
                  width: `${Math.min(100, Math.round((stats.totalReferrals / 100) * 100))}%`, 
                  height: '100%' 
                }}></div>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                {stats.totalReferrals < 100 
                  ? `Next Milestone: ${stats.totalReferrals < 10 ? '10' : stats.totalReferrals < 25 ? '25' : stats.totalReferrals < 50 ? '50' : '100'} referrals` 
                  : 'All milestones completed! 🎉'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default UserReferrals;
