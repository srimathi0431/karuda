import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useAuth } from '../../context/AuthContext';
import { useUserPanel } from '../../context/UserPanelContext';
import { referralAPI } from '../../services/api';
import { FaUser, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import '../../styles/UserTeamTree.css';

const UserTeamTree = () => {
  const { user } = useAuth();
  const { referrals = [] } = useUserPanel() || {};
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set([user?.username]));

  useEffect(() => {
    const fetchTreeData = async () => {
      if (!user?.username) return;
      
      try {
        setLoading(true);
        const response = await referralAPI.getTreeStrength(user.username);
        
        // Build tree structure from referrals
        const leftReferrals = referrals.filter(r => r.position === 'left');
        const rightReferrals = referrals.filter(r => r.position === 'right');
        
        setTreeData({
          root: {
            username: user.username,
            name: user.name,
            wallet_balance: user.wallet_balance || 0,
            total_referrals: referrals.length
          },
          left: leftReferrals,
          right: rightReferrals,
          strength: response.tree_strength
        });
      } catch (error) {
        console.error('Failed to fetch tree data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreeData();
  }, [user, referrals]);

  const toggleNode = (username) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(username)) {
      newExpanded.delete(username);
    } else {
      newExpanded.add(username);
    }
    setExpandedNodes(newExpanded);
  };

  const TreeNode = ({ node, level = 0, position = 'root' }) => {
    const isExpanded = expandedNodes.has(node.username);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div className={`tree-node-item level-${level} position-${position}`}>
        <div className="tree-node-card">
          <div className="tree-node-header">
            {hasChildren && (
              <button 
                className="expand-btn" 
                onClick={() => toggleNode(node.username)}
              >
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </button>
            )}
            <div className="tree-node-avatar">
              {node.name ? node.name.charAt(0).toUpperCase() : <FaUser />}
            </div>
            <div className="tree-node-info">
              <h4>{node.name || 'Member'}</h4>
              <p>@{node.username}</p>
            </div>
          </div>
          <div className="tree-node-stats">
            <div className="stat">
              <span className="stat-label">Business</span>
              <span className="stat-value">₹{((node.wallet_balance || 0) / 1000).toFixed(1)}K</span>
            </div>
            <div className="stat">
              <span className="stat-label">Team</span>
              <span className="stat-value">{node.total_referrals || 0}</span>
            </div>
          </div>
          {position !== 'root' && (
            <div className={`position-badge ${position}`}>
              {position === 'left' ? '⬅️ Left' : '➡️ Right'}
            </div>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="tree-node-children">
            {node.children.map((child, idx) => (
              <TreeNode 
                key={child.username || idx} 
                node={child} 
                level={level + 1}
                position={child.position || 'unknown'}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="tree-page">
          <h1 className="tree-title">Loading your team tree...</h1>
        </div>
      </UserPanelLayout>
    );
  }

  if (!treeData) {
    return (
      <UserPanelLayout>
        <div className="tree-page">
          <h1 className="tree-title">No tree data available</h1>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div className="tree-page">
        {/* Header */}
        <div className="tree-header">
          <h1 className="tree-title">🌳 Complete Team Tree</h1>
          <p className="tree-subtitle">Visualize your entire network structure</p>
        </div>

        {/* Tree Stats */}
        <div className="tree-stats">
          <div className="tree-stat-card">
            <p className="tree-stat-label">Total Team</p>
            <p className="tree-stat-value">{treeData.left.length + treeData.right.length}</p>
          </div>
          <div className="tree-stat-card">
            <p className="tree-stat-label">Left Leg</p>
            <p className="tree-stat-value" style={{ color: '#10b981' }}>{treeData.left.length}</p>
          </div>
          <div className="tree-stat-card">
            <p className="tree-stat-label">Right Leg</p>
            <p className="tree-stat-value" style={{ color: '#3b82f6' }}>{treeData.right.length}</p>
          </div>
          <div className="tree-stat-card">
            <p className="tree-stat-label">Balance</p>
            <p className="tree-stat-value">{treeData.strength?.balance_percentage || 0}%</p>
          </div>
        </div>

        {/* Root Node */}
        <div className="tree-container">
          <div className="tree-root">
            <TreeNode node={{
              username: treeData.root.username,
              name: treeData.root.name,
              wallet_balance: treeData.root.wallet_balance,
              total_referrals: treeData.root.total_referrals,
              children: []
            }} />
          </div>

          {/* Left and Right Legs */}
          <div className="tree-branches">
            {/* Left Leg */}
            <div className="tree-branch left">
              <h3 className="branch-title">⬅️ Left Leg ({treeData.left.length})</h3>
              {treeData.left.length > 0 ? (
                <div className="branch-content">
                  {treeData.left.map((member, idx) => (
                    <TreeNode 
                      key={member.username || idx} 
                      node={{
                        username: member.username,
                        name: member.name,
                        wallet_balance: member.wallet_balance || 0,
                        total_referrals: 0,
                        children: []
                      }} 
                      level={1}
                      position="left"
                    />
                  ))}
                </div>
              ) : (
                <div className="branch-empty">
                  <p>No members yet</p>
                  <small>Share your left leg referral link</small>
                </div>
              )}
            </div>

            {/* Right Leg */}
            <div className="tree-branch right">
              <h3 className="branch-title">➡️ Right Leg ({treeData.right.length})</h3>
              {treeData.right.length > 0 ? (
                <div className="branch-content">
                  {treeData.right.map((member, idx) => (
                    <TreeNode 
                      key={member.username || idx} 
                      node={{
                        username: member.username,
                        name: member.name,
                        wallet_balance: member.wallet_balance || 0,
                        total_referrals: 0,
                        children: []
                      }} 
                      level={1}
                      position="right"
                    />
                  ))}
                </div>
              ) : (
                <div className="branch-empty">
                  <p>No members yet</p>
                  <small>Share your right leg referral link</small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="tree-legend">
          <h4>Legend:</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-icon left">⬅️</span>
              <span>Left Leg Member</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon right">➡️</span>
              <span>Right Leg Member</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon">💰</span>
              <span>Business = Wallet Balance</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon">👥</span>
              <span>Team = Direct Referrals</span>
            </div>
          </div>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default UserTeamTree;
