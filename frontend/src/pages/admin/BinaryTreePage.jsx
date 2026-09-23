import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mlmAPI } from '../../services/api';
import { FaNetworkWired, FaSearch, FaUser, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const BinaryTreePage = () => {
  const [loading, setLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [treeData, setTreeData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const fetchTree = async () => {
    if (!searchUsername.trim()) {
      alert('Please enter a username');
      return;
    }

    try {
      setLoading(true);
      const response = await mlmAPI.getBinaryLegs(searchUsername);
      if (response.success) {
        setTreeData(response.legs);
        setExpandedNodes(new Set([searchUsername]));
      } else {
        alert('User not found or has no team');
        setTreeData(null);
      }
    } catch (error) {
      console.error('Error fetching tree:', error);
      alert('Failed to load binary tree');
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (username) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(username)) {
      newExpanded.delete(username);
    } else {
      newExpanded.add(username);
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <FaNetworkWired className="text-3xl text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Binary Tree Viewer</h1>
              <p className="text-gray-600 mt-1">Visualize user binary tree structure</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchTree()}
                placeholder="Enter username to view their binary tree..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchTree}
              disabled={loading}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <FaSearch />
                  View Tree
                </>
              )}
            </button>
          </div>

          {/* Legend */}
          <div className="mt-4 flex gap-4 text-sm">
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
              <span className="text-gray-600">Root User</span>
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

        {!treeData && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaNetworkWired className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Enter a username to view their binary tree</p>
            <p className="text-gray-400 text-sm mt-2">The tree shows the complete downline structure with volumes and team counts</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BinaryTreePage;
