import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import {
  Users, Music, Film, Download, BarChart3, MessageSquare, Settings,
  TrendingUp, Clock, CheckCircle, AlertCircle, LogOut, Menu, X
} from 'lucide-react';
import MusicUpload from '../components/uploads/MusicUpload';
import MoviesUpload from '../components/uploads/MoviesUpload';
import SoftwareUpload from '../components/uploads/SoftwareUpload';

type TabType = 'overview' | 'users' | 'music' | 'movies' | 'software' | 'payments' | 'orders' | 'support' | 'notifications' | 'analytics' | 'settings';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 125,
    totalRevenue: 15000000,
    pendingOrders: 8,
    totalSongs: 320,
    totalMovies: 450,
    totalSoftware: 65,
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }
  }, [user, isAdmin, navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'users' as TabType, label: 'User Management', icon: Users },
    { id: 'music' as TabType, label: 'Music Upload', icon: Music },
    { id: 'movies' as TabType, label: 'Movies Upload', icon: Film },
    { id: 'software' as TabType, label: 'Software Upload', icon: Download },
    { id: 'payments' as TabType, label: 'Payment Processing', icon: TrendingUp },
    { id: 'orders' as TabType, label: 'Order Management', icon: Clock },
    { id: 'support' as TabType, label: 'Customer Support', icon: MessageSquare },
    { id: 'notifications' as TabType, label: 'Notifications', icon: AlertCircle },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold">DJ ENOCH PRO - Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">{user?.email}</span>
            <button onClick={handleLogout} className="bg-orange-700 hover:bg-orange-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-600" />
                <StatCard icon={TrendingUp} label="Total Revenue" value={`UGX ${(stats.totalRevenue / 1000000).toFixed(1)}M`} color="bg-green-600" />
                <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} color="bg-yellow-600" />
                <StatCard icon={Music} label="Total Songs" value={stats.totalSongs} color="bg-purple-600" />
                <StatCard icon={Film} label="Total Movies" value={stats.totalMovies} color="bg-pink-600" />
                <StatCard icon={Download} label="Total Software" value={stats.totalSoftware} color="bg-cyan-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <RecentActivityCard />
                <QuickStatsCard stats={stats} />
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && <UserManagementSection />}

          {/* Music Upload */}
          {activeTab === 'music' && <MusicUpload />}

          {/* Movies Upload */}
          {activeTab === 'movies' && <MoviesUpload />}

          {/* Software Upload */}
          {activeTab === 'software' && <SoftwareUpload />}

          {/* Payment Processing */}
          {activeTab === 'payments' && <PaymentProcessingSection />}

          {/* Order Management */}
          {activeTab === 'orders' && <OrderManagementSection />}

          {/* Customer Support */}
          {activeTab === 'support' && <CustomerSupportSection />}

          {/* Notifications */}
          {activeTab === 'notifications' && <NotificationsSection />}

          {/* Analytics */}
          {activeTab === 'analytics' && <AnalyticsSection />}

          {/* Settings */}
          {activeTab === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className={`${color} rounded-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} opacity={0.7} />
      </div>
    </div>
  );
}

// Recent Activity Card
function RecentActivityCard() {
  const activities = [
    { id: 1, user: 'John Doe', action: 'Purchased Music Bundle', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'Downloaded 5 Songs', time: '4 hours ago' },
    { id: 3, user: 'Bob Johnson', action: 'Subscribed to Premium', time: '6 hours ago' },
    { id: 4, user: 'Alice Brown', action: 'Watched Movie', time: '8 hours ago' },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex justify-between items-center pb-3 border-b border-gray-800 last:border-0">
            <div>
              <p className="font-medium">{activity.user}</p>
              <p className="text-sm text-gray-400">{activity.action}</p>
            </div>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick Stats Card
function QuickStatsCard({ stats }: any) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-bold mb-4">Content Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Music Files</span>
          <div className="w-32 bg-gray-800 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <span className="text-sm font-medium">{stats.totalSongs}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Movies</span>
          <div className="w-32 bg-gray-800 rounded-full h-2">
            <div className="bg-pink-600 h-2 rounded-full" style={{ width: '72%' }}></div>
          </div>
          <span className="text-sm font-medium">{stats.totalMovies}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Software</span>
          <div className="w-32 bg-gray-800 rounded-full h-2">
            <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '42%' }}></div>
          </div>
          <span className="text-sm font-medium">{stats.totalSoftware}</span>
        </div>
      </div>
    </div>
  );
}

// User Management Section
function UserManagementSection() {
  const [users] = useState([
    { id: 1, email: 'user1@example.com', role: 'User', status: 'Active', joined: '2025-01-15' },
    { id: 2, email: 'user2@example.com', role: 'Premium', status: 'Active', joined: '2025-02-20' },
    { id: 3, email: 'user3@example.com', role: 'User', status: 'Inactive', joined: '2025-01-10' },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">User Management</h2>
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Role</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Joined</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select className="bg-gray-700 border border-gray-600 rounded px-2 py-1">
                    <option>User</option>
                    <option>Premium</option>
                    <option>Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${user.status === 'Active' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{user.joined}</td>
                <td className="px-6 py-4">
                  <button className="text-orange-500 hover:text-orange-400">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Payment Processing Section
function PaymentProcessingSection() {
  const [payments] = useState([
    { id: 1, user: 'John Doe', amount: '50,000', status: 'Pending', date: '2025-04-20' },
    { id: 2, user: 'Jane Smith', amount: '100,000', status: 'Approved', date: '2025-04-19' },
    { id: 3, user: 'Bob Johnson', amount: '75,000', status: 'Pending', date: '2025-04-18' },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Payment Processing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6">
          <p className="text-gray-200">Approved Payments</p>
          <p className="text-3xl font-bold mt-2">UGX 8.5M</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6">
          <p className="text-gray-200">Pending Payments</p>
          <p className="text-3xl font-bold mt-2">UGX 6.2M</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6">
          <p className="text-gray-200">Rejected Payments</p>
          <p className="text-3xl font-bold mt-2">UGX 1.3M</p>
        </div>
      </div>
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">User</th>
              <th className="px-6 py-3 text-left font-semibold">Amount</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4">{payment.user}</td>
                <td className="px-6 py-4 font-semibold">{payment.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${payment.status === 'Pending' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-green-600/20 text-green-400'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{payment.date}</td>
                <td className="px-6 py-4 space-x-2">
                  {payment.status === 'Pending' && (
                    <>
                      <button className="text-green-500 hover:text-green-400">Approve</button>
                      <button className="text-red-500 hover:text-red-400">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Order Management Section
function OrderManagementSection() {
  const [orders] = useState([
    { id: '#ORD001', user: 'John Doe', product: 'Music Bundle', amount: '50,000', status: 'Shipped', date: '2025-04-20' },
    { id: '#ORD002', user: 'Jane Smith', product: 'Software License', amount: '100,000', status: 'Processing', date: '2025-04-19' },
    { id: '#ORD003', user: 'Bob Johnson', product: 'Movie Subscription', amount: '30,000', status: 'Delivered', date: '2025-04-18' },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Order Management</h2>
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Order ID</th>
              <th className="px-6 py-3 text-left font-semibold">Customer</th>
              <th className="px-6 py-3 text-left font-semibold">Product</th>
              <th className="px-6 py-3 text-left font-semibold">Amount</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4 font-semibold">{order.id}</td>
                <td className="px-6 py-4">{order.user}</td>
                <td className="px-6 py-4">{order.product}</td>
                <td className="px-6 py-4">UGX {order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'Delivered' ? 'bg-green-600/20 text-green-400' : order.status === 'Processing' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-blue-600/20 text-blue-400'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Customer Support Section
function CustomerSupportSection() {
  const [tickets] = useState([
    { id: '#TKT001', user: 'John Doe', subject: 'Payment Issue', priority: 'High', status: 'Open', date: '2025-04-20' },
    { id: '#TKT002', user: 'Jane Smith', subject: 'Download Problem', priority: 'Medium', status: 'In Progress', date: '2025-04-19' },
    { id: '#TKT003', user: 'Bob Johnson', subject: 'Account Recovery', priority: 'High', status: 'Resolved', date: '2025-04-18' },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Customer Support</h2>
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Ticket ID</th>
              <th className="px-6 py-3 text-left font-semibold">Customer</th>
              <th className="px-6 py-3 text-left font-semibold">Subject</th>
              <th className="px-6 py-3 text-left font-semibold">Priority</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4 font-semibold">{ticket.id}</td>
                <td className="px-6 py-4">{ticket.user}</td>
                <td className="px-6 py-4">{ticket.subject}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${ticket.priority === 'High' ? 'bg-red-600/20 text-red-400' : 'bg-yellow-600/20 text-yellow-400'}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${ticket.status === 'Open' ? 'bg-orange-600/20 text-orange-400' : ticket.status === 'Resolved' ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Notifications Section
function NotificationsSection() {
  const [notifications] = useState([
    { id: 1, type: 'Payment', message: 'New payment received from John Doe', time: '2 hours ago' },
    { id: 2, type: 'Order', message: 'Order #ORD002 needs confirmation', time: '4 hours ago' },
    { id: 3, type: 'Support', message: 'New support ticket from Jane Smith', time: '6 hours ago' },
    { id: 4, type: 'Content', message: 'Movie upload completed successfully', time: '8 hours ago' },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Notifications</h2>
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-orange-600 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-orange-500">{notif.type}</p>
                <p className="text-gray-300 mt-1">{notif.message}</p>
              </div>
              <p className="text-xs text-gray-500">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Analytics Section
function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Analytics & Reports</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="font-bold text-xl mb-4">User Activity Trend</h3>
          <div className="h-48 bg-gray-800 rounded flex items-center justify-center">
            <p className="text-gray-400">Activity chart placeholder</p>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="font-bold text-xl mb-4">Revenue Breakdown</h3>
          <div className="h-48 bg-gray-800 rounded flex items-center justify-center">
            <p className="text-gray-400">Revenue chart placeholder</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="font-bold text-xl mb-4">Top Products</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
            <span>Premium Music Bundle</span>
            <span className="font-bold">450 sales</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-700">
            <span>Movie Subscription</span>
            <span className="font-bold">320 subscriptions</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Software License Pack</span>
            <span className="font-bold">165 purchases</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Section
function SettingsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Settings</h2>
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Platform Name</label>
          <input type="text" defaultValue="DJ ENOCH PRO UG" className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Contact Email</label>
          <input type="email" defaultValue="primerceug@gmail.com" className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Commission Rate (%)</label>
          <input type="number" defaultValue="10" className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white" />
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-lg font-semibold">Save Settings</button>
      </div>
    </div>
  );
}

            {uploadType === 'music' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    value={musicTitle}
                    onChange={(e) => setMusicTitle(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    placeholder="Track title"
                  />
                </div>
                <div>
                  <label className="block mb-2">Type</label>
                  <select
                    value={musicType}
                    onChange={(e) => setMusicType(e.target.value as 'audio' | 'video')}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  >
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">File (up to 5GB)</label>
                  <input
                    type="file"
                    accept={musicType === 'audio' ? 'audio/*' : 'video/*'}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            )}

            {uploadType === 'movies' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Type</label>
                  <select
                    value={movieType}
                    onChange={(e) => setMovieType(e.target.value as 'movie' | 'series')}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    value={movieTitle}
                    onChange={(e) => setMovieTitle(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    placeholder="Movie/Series title"
                  />
                </div>
                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    value={movieDescription}
                    onChange={(e) => setMovieDescription(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    rows={3}
                    placeholder="Description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Genre</label>
                    <select
                      value={movieGenre}
                      onChange={(e) => setMovieGenre(e.target.value)}
                      className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    >
                      <option>Action</option>
                      <option>Comedy</option>
                      <option>Drama</option>
                      <option>Horror</option>
                      <option>Romance</option>
                      <option>Thriller</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">VJ</label>
                    <select
                      value={movieVJ}
                      onChange={(e) => setMovieVJ(e.target.value)}
                      className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    >
                      {VJ_LIST.map(vj => <option key={vj}>{vj}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2">Video File (up to 5GB)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            )}

            {uploadType === 'software' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    value={softwareTitle}
                    onChange={(e) => setSoftwareTitle(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    placeholder="Software name"
                  />
                </div>
                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    value={softwareDescription}
                    onChange={(e) => setSoftwareDescription(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">Platform</label>
                  <select
                    value={softwarePlatform}
                    onChange={(e) => setSoftwarePlatform(e.target.value)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  >
                    <option>Windows</option>
                    <option>Android</option>
                    <option>macOS</option>
                    <option>Linux</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">File (up to 5GB)</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-6 bg-orange-600 py-4 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              {uploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
            </button>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Pending Payment Approvals</h2>
            {pendingPayments.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No pending payments</p>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map(payment => (
                  <div key={payment.id} className="bg-gray-800 p-6 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold">{payment.userName}</p>
                      <p className="text-sm text-gray-400">{payment.items} - {payment.total} UGX</p>
                      <p className="text-xs text-gray-500">Transaction ID: {payment.transactionId}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-green-600 p-2 rounded hover:bg-green-700">
                        <Check size={20} />
                      </button>
                      <button className="bg-red-600 p-2 rounded hover:bg-red-700">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
