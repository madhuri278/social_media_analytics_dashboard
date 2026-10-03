import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import MetricCard from '../components/MetricCard';
import AnalyticsChart from '../components/AnalyticsChart';
import PostScheduler from '../components/PostScheduler';
import RecentActivity from '../components/RecentActivity';
import { 
  Users, 
  Percent, 
  TrendingUp, 
  Send, 
  Loader2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, scheduler
  
  // Data States
  const [overview, setOverview] = useState(null);
  const [charts, setCharts] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      // Execute parallel requests to backend API
      const [overviewRes, chartsRes, postsRes] = await Promise.all([
        api.get('/api/analytics/overview'),
        api.get('/api/analytics/charts'),
        api.get('/api/posts')
      ]);

      setOverview(overviewRes.data.metrics);
      setCharts(chartsRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data. Please make sure the database is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  // Create post handler
  const handleCreatePost = async (postPayload) => {
    try {
      const res = await api.post('/api/posts', postPayload);
      setPosts([res.data, ...posts]);
      // Silently refresh analytics overview to update the "Total Posts" count
      fetchData(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating post');
    }
  };

  // Update post handler
  const handleUpdatePost = async (postId, postPayload) => {
    try {
      const res = await api.put(`/api/posts/${postId}`, postPayload);
      setPosts(posts.map(p => p._id === postId ? res.data : p));
      // Refresh analytics in background
      fetchData(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating post');
    }
  };

  // Delete post handler
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
      // Refresh analytics in background
      fetchData(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading SocialMetrics Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center shadow-lg">
          <AlertCircle className="text-rose-500 mx-auto mb-4" size={44} />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Connection Error</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{error}</p>
          <button 
            onClick={() => fetchData()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Action Row */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Overview Statistics</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time metrics aggregates for {user?.name}</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
              title="Refresh Dashboard"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Metric cards list grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <MetricCard
              title="Total Followers"
              value={overview?.totalFollowers?.value || 0}
              change={overview?.totalFollowers?.change || 0}
              isPositive={overview?.totalFollowers?.isPositive}
              icon={Users}
            />
            <MetricCard
              title="Engagement Rate"
              value={overview?.engagementRate?.value || 0}
              change={overview?.engagementRate?.change || 0}
              isPositive={overview?.engagementRate?.isPositive}
              icon={Percent}
              format="percent"
            />
            <MetricCard
              title="Total Reach"
              value={overview?.reach?.value || 0}
              change={overview?.reach?.change || 0}
              isPositive={overview?.reach?.isPositive}
              icon={TrendingUp}
            />
            <MetricCard
              title="Total Composed Posts"
              value={overview?.totalPosts?.value || 0}
              change={overview?.totalPosts?.change || 0}
              isPositive={overview?.totalPosts?.isPositive}
              icon={Send}
            />
          </div>

          {/* Chart diagrams and Activity Feed layout grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            <div className="xl:col-span-3">
              <AnalyticsChart
                followerGrowth={charts?.followerGrowth || []}
                engagementByPlatform={charts?.engagementByPlatform || []}
                engagementByPostType={charts?.engagementByPostType || []}
              />
            </div>
            <div className="xl:col-span-1 h-full">
              <RecentActivity />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scheduler' && (
        <div className="animate-in fade-in duration-200">
          <PostScheduler
            posts={posts}
            onCreatePost={handleCreatePost}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
