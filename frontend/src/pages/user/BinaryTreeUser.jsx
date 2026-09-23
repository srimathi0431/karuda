import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { mlmAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaNetworkWired, FaUser, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const BinaryTreeUser = () => {
  const { user } = useAuth();
  const username = user?.username;
  const [loading, setLoading] = useState(true);
  const [treeData, setTreeData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      setLoading(true);
      const response = await mlmAPI.getBinaryLegs(username);
      if (response.success) {
        setTreeData(response.legs);
        setExpandedNodes(new Set([username]));
      }
    } catch (error) {
      console.error('Error fetching tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeUsername) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeUsername)) {
      newExpanded.delete(nodeUsername);
    } else {
      newExpanded.add(nodeUsername);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node, position = null, level = 0) => {
    if (!node) return null;

    const isExpanded = expandedNodes.has(node.username);
    const hasChildren = node.left_child || node.right_child;

    const positionColors = {
      left: 'border-blue-500 bg-blue-50',
      right: 'border-green-500 bg-green-50',
      root: 'border-purple-500 bg-purple-50'
    };

    const positionLabels = {
      left: 'L',
      right: 'R'
    };

    return (
      <div className="flex flex-col items-center">
        {/* Node */}
        <div
          className={`border-2 rounded-lg p-4 min-w-[200px] shadow-md transition-all hover:shadow-lg ${
            position ? positionColors[position] : positionColors.root
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-600" />
              <div>
                <p className="font-bold text-gray-800">{node.name}</p>
                <p className="text-xs text-gray-600">@{node.username}</p>
              </div>
            </div>
            {position && (
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                position === 'left' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
              }`}>
                {positionLabels[position]}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Left Team</p>
              <p className="font-bold text-blue-600">{node.left_count || 0}</p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Right Team</p>
              <p className="font-bold text-green-600">{node.right_count || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Left Vol</p>
              <p className="font-bold text-blue-600">₹{parseFloat(node.left_volume || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Right Vol</p>
              <p className="font-bold text-green-600">₹{parseFloat(node.right_volume || 0).toLocaleString()}</p>
            </div>
          </div>

          {hasChildren && (
            <button
              onClick={() => toggleNode(node.username)}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm"
            >
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="flex gap-8 mt-8 relative">
            {/* Connector Line */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-0.5 h-8 bg-gray-300"></div>
            
            {/* Left Child */}
            <div className="flex-1 flex flex-col items-center relative">
              {node.left_child && (
                <>
                  <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-gray-300"></div>
                  <div className="absolute top-0 right-0 w-0.5 h-8 bg-gray-300"></div>
                  <div className="mt-8">
                    {renderNode(node.left_child, 'left', level + 1)}
                  </div>
                </>
              )}
              {!node.left_child && (
                <div className="mt-8 border-2 border-dashed border-gray-300 rounded-lg p-4 min-w-[200px] text-center bg-gray-50">
                  <FaUser className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Empty Position</p>
                  <p className="text-xs text-gray-400 mt-1">Left</p>
                  <a
                    href="/account/referrals"
                    className="mt-3 inline-block text-xs text-blue-600 hover:text-blue-700"
                  >
                    Get Referral Link
                  </a>
                </div>
              )}
            </div>

            {/* Right Child */}
            <div className="flex-1 flex flex-col items-center relative">
              {node.right_child && (
                <>
                  <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-gray-300"></div>
                  <div className="absolute top-0 left-0 w-0.5 h-8 bg-gray-300"></div>
                  <div className="mt-8">
                    {renderNode(node.right_child, 'right', level + 1)}
                  </div>
                </>
              )}
              {!node.right_child && (
                <div className="mt-8 border-2 border-dashed border-gray-300 rounded-lg p-4 min-w-[200px] text-center bg-gray-50">
                  <FaUser className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Empty Position</p>
                  <p className="text-xs text-gray-400 mt-1">Right</p>
                  <a
                    href="/account/referrals"
                    className="mt-3 inline-block text-xs text-blue-600 hover:text-blue-700"
                  >
                    Get Referral Link
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading binary tree...</p>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center gap-3">
            <FaNetworkWired className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">My Binary Tree</h1>
              <p className="opacity-90 mt-1">Visualize your downline structure</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        {treeData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-600 text-sm font-medium">Left Team</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">{treeData.left_count || 0}</p>
              <p className="text-xs text-blue-600 mt-1">Total members</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-600 text-sm font-medium">Right Team</p>
              <p className="text-2xl font-bold text-green-800 mt-1">{treeData.right_count || 0}</p>
              <p className="text-xs text-green-600 mt-1">Total members</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-600 text-sm font-medium">Left Volume</p>
              <p className="text-2xl font-bold text-purple-800 mt-1">
                ₹{parseFloat(treeData.left_volume || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <p className="text-pink-600 text-sm font-medium">Right Volume</p>
              <p className="text-2xl font-bold text-pink-800 mt-1">
                ₹{parseFloat(treeData.right_volume || 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
              <span className="text-gray-600">Left Position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
              <span className="text-gray-600">Right Position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded"></div>
              <span className="text-gray-600">You (Root)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-dashed border-gray-300 rounded"></div>
              <span className="text-gray-600">Empty Position</span>
            </div>
          </div>
        </div>

        {/* Tree Visualization */}
        {treeData && (
          <div className="bg-white rounded-lg shadow-md p-8 overflow-x-auto">
            <div className="min-w-max">
              {renderNode(treeData)}
            </div>
          </div>
        )}

        {!treeData && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaNetworkWired className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No team members yet</p>
            <p className="text-gray-400 text-sm mt-2">Start building your binary tree by referring new members</p>
            <a
              href="/account/referrals"
              className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-colors"
            >
              Get Referral Links
            </a>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Understanding Your Binary Tree</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Click "Expand" to view deeper levels of your downline</li>
            <li>• Left and Right positions show your binary leg structure</li>
            <li>• Team counts include all members in that leg (direct + indirect)</li>
            <li>• Volume represents the total package value from each leg</li>
            <li>• Empty positions can be filled by referring new members</li>
          </ul>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default BinaryTreeUser;
