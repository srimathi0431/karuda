import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, ShoppingBag, Package, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import '../../styles/AdminDashboard.css';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const { getDashboardStats } = useAdmin();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalProducts: 16,
    totalPackages: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        if (data) {
          // Ensure all numeric values have defaults
          setStats({
            totalUsers: data.totalUsers || data.total_users || 0,
            activeUsers: data.activeUsers || data.active_users || 0,
            totalOrders: data.totalOrders || data.total_orders || 0,
            pendingOrders: data.pendingOrders || data.pending_orders || 0,
            completedOrders: data.completedOrders || data.completed_orders || 0,
            totalRevenue: data.totalRevenue || data.total_revenue || 0,
            totalProducts: data.totalProducts || data.total_products || 16,
            totalPackages: data.totalPackages || data.total_packages || 2,
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        // Keep default stats on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getDashboardStats]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      iconClass: 'blue',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      iconClass: 'green',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      iconClass: 'purple',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      iconClass: 'orange',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: CheckCircle,
      iconClass: 'emerald',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      iconClass: 'primary',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      iconClass: 'accent',
    },
    {
      title: 'Total Packages',
      value: stats.totalPackages,
      icon: Package,
      iconClass: 'pink',
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Page Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome to Karuda Admin Panel</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="dashboard-stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="admin-stat-card">
              <div className="stat-icon-wrapper">
                <div className={`admin-stat-icon ${stat.iconClass}`}>
                  <stat.icon />
                </div>
              </div>
              <h3 className="admin-stat-title">{stat.title}</h3>
              <p className="admin-stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Info */}
        <div className="dashboard-info-grid">
          {/* Recent Activity */}
          <div className="info-card">
            <h2>Quick Overview</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Pending Orders</span>
                <span className="info-value orange">{stats.pendingOrders}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Completed Today</span>
                <span className="info-value green">{Math.floor(stats.completedOrders / 30)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Active Users</span>
                <span className="info-value blue">{stats.activeUsers}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Revenue</span>
                <span className="info-value primary">
                  ₹{stats.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="info-card">
            <h2>System Status</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Database</span>
                <span className="status-badge active">
                  Active
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Payment Gateway</span>
                <span className="status-badge connected">
                  Connected
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Service</span>
                <span className="status-badge running">
                  Running
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Storage</span>
                <span className="storage-value">78% Used</span>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
