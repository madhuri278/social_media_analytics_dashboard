import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Calendar, 
  Clock, 
  Send, 
  FileText, 
  Globe, 
  MessageCircle, 
  Heart, 
  Share2, 
  Trash2, 
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function PostScheduler({ posts, onCreatePost, onUpdatePost, onDeletePost }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState(['twitter']);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [status, setStatus] = useState('draft'); // draft, scheduled, published
  const [editingPostId, setEditingPostId] = useState(null);
  
  // Filter tabs for listing
  const [filterTab, setFilterTab] = useState('all'); // all, draft, scheduled, published
  const [activePreviewTab, setActivePreviewTab] = useState('twitter');

  const togglePlatform = (platform) => {
    if (platforms.includes(platform)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter(p => p !== platform));
        // Reset active preview if removing the current active one
        if (activePreviewTab === platform) {
          const remaining = platforms.filter(p => p !== platform);
          setActivePreviewTab(remaining[0]);
        }
      }
    } else {
      setPlatforms([...platforms, platform]);
      setActivePreviewTab(platform);
    }
  };

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    let scheduledAt = null;
    let postStatus = status;

    if (status === 'scheduled') {
      if (!scheduleDate || !scheduleTime) {
        alert('Please select both date and time for scheduling.');
        return;
      }
      scheduledAt = `${scheduleDate}T${scheduleTime}`;
    }

    const postPayload = {
      content,
      platforms,
      scheduledAt,
      status: postStatus
    };

    if (editingPostId) {
      onUpdatePost(editingPostId, postPayload);
      setEditingPostId(null);
    } else {
      onCreatePost(postPayload);
    }

    // Reset Form
    setContent('');
    setScheduleDate('');
    setScheduleTime('');
    setStatus('draft');
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setContent(post.content);
    setPlatforms(post.platforms);
    setStatus(post.status);
    if (post.scheduledAt) {
      const d = new Date(post.scheduledAt);
      const dateStr = d.toISOString().split('T')[0];
      const timeStr = d.toTimeString().substring(0, 5);
      setScheduleDate(dateStr);
      setScheduleTime(timeStr);
    } else {
      setScheduleDate('');
      setScheduleTime('');
    }
    // Switch preview tab to first available platform of the post
    setActivePreviewTab(post.platforms[0] || 'twitter');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setContent('');
    setPlatforms(['twitter']);
    setScheduleDate('');
    setScheduleTime('');
    setStatus('draft');
  };

  // Helper for rendering badges
  const renderStatusBadge = (postStatus) => {
    switch (postStatus) {
      case 'published':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 w-fit"><CheckCircle2 size={12} /> Published</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center gap-1 w-fit"><Clock size={12} /> Scheduled</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1 w-fit"><FileText size={12} /> Draft</span>;
    }
  };

  // Previews mockups configuration
  const twitterCharacterLimit = 280;

  const filteredPosts = posts.filter(post => {
    if (filterTab === 'all') return true;
    return post.status === filterTab;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Post Composer Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
            {editingPostId ? 'Edit Scheduled/Draft Post' : 'Compose New Post'}
          </h3>
          
          <form onSubmit={handleComposeSubmit} className="space-y-5">
            {/* Platform Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Target Platforms
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => togglePlatform('twitter')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    platforms.includes('twitter')
                      ? 'border-sky-400 bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Twitter size={16} />
                  <span>Twitter/X</span>
                </button>

                <button
                  type="button"
                  onClick={() => togglePlatform('linkedin')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    platforms.includes('linkedin')
                      ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={() => togglePlatform('instagram')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    platforms.includes('instagram')
                      ? 'border-pink-500 bg-pink-50 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Instagram size={16} />
                  <span>Instagram</span>
                </button>
              </div>
            </div>

            {/* Post content editor */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Post Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What would you like to share?"
                rows={5}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-slate-400">
                  Markdown shortcuts are supported
                </span>
                {platforms.includes('twitter') && (
                  <span className={`text-xs font-medium ${
                    content.length > twitterCharacterLimit ? 'text-rose-500' : 'text-slate-400'
                  }`}>
                    Twitter Limit: {content.length}/{twitterCharacterLimit}
                  </span>
                )}
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Posting Queue Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                    status === 'draft'
                      ? 'border-slate-400 bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('scheduled')}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                    status === 'scheduled'
                      ? 'border-sky-500 bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Schedule Post
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                    status === 'published'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Publish Now
                </button>
              </div>
            </div>

            {/* Time Picker if Scheduled */}
            {status === 'scheduled' && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-150 dark:border-slate-800/80 animate-in slide-in-from-top-2 duration-150">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md py-1.5 pl-8 pr-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md py-1.5 pl-8 pr-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Submit */}
            <div className="flex gap-2 justify-end">
              {editingPostId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold rounded-lg"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!content.trim() || (status === 'scheduled' && (!scheduleDate || !scheduleTime))}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Send size={15} />
                <span>{editingPostId ? 'Update Post' : 'Submit Post'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Mockups Previews Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Live Mockup Preview</h3>
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              {platforms.map(p => (
                <button
                  key={p}
                  onClick={() => setActivePreviewTab(p)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                    activePreviewTab === p
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  {p === 'twitter' ? 'Twitter' : p}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 p-4 md:p-6 min-h-80 flex items-center justify-center">
            {/* Twitter/X Mockup */}
            {activePreviewTab === 'twitter' && (
              <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl p-4 shadow-sm text-left">
                <div className="flex gap-3">
                  <img src={user?.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.name}</span>
                      <span className="text-slate-400 text-xs truncate">@{user?.name.toLowerCase().replace(/ /g, '')}</span>
                      <span className="text-slate-400 text-xs shrink-0">· Just now</span>
                    </div>
                    <p className="text-sm mt-1 whitespace-pre-wrap text-slate-800 dark:text-slate-200 break-words">
                      {content || 'Enter post content to see tweet preview...'}
                    </p>
                    {content.length > twitterCharacterLimit && (
                      <div className="flex items-center gap-1 text-xs text-rose-500 font-semibold mt-2.5">
                        <AlertCircle size={14} /> Character count exceeds Twitter limits!
                      </div>
                    )}
                    <div className="flex justify-between max-w-xs text-slate-400 mt-4 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                      <MessageCircle size={16} />
                      <Heart size={16} />
                      <Share2 size={16} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LinkedIn Mockup */}
            {activePreviewTab === 'linkedin' && (
              <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm text-left">
                <div className="flex gap-2.5 items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <img src={user?.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{user?.name}</h5>
                    <p className="text-[10px] text-slate-400">Social Media & Analytics Specialist • Just now</p>
                    <p className="text-[9px] text-slate-400 flex items-center gap-0.5 mt-0.5"><Globe size={10} /> Public</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs whitespace-pre-wrap text-slate-800 dark:text-slate-200 break-words leading-relaxed">
                    {content || 'Enter post content to see LinkedIn preview...'}
                  </p>
                </div>
                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/60 mt-4 pt-3 text-[10px] text-slate-500 font-semibold px-2">
                  <span className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600"><Heart size={14} /> Like</span>
                  <span className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600"><MessageCircle size={14} /> Comment</span>
                  <span className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600"><Share2 size={14} /> Repost</span>
                </div>
              </div>
            )}

            {/* Instagram Mockup */}
            {activePreviewTab === 'instagram' && (
              <div className="w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm text-left">
                <div className="flex gap-2 items-center p-3">
                  <img src={user?.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-pink-500 p-0.5" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {user?.name.toLowerCase().replace(/ /g, '')}
                  </span>
                </div>
                {/* Media Placeholder */}
                <div className="bg-slate-100 dark:bg-slate-850 aspect-video w-full flex items-center justify-center text-slate-400 text-xs border-y border-slate-200/50 dark:border-slate-850">
                  [Instagram Image/Video Media Placeholder]
                </div>
                <div className="p-3">
                  <div className="flex gap-3 text-slate-700 dark:text-slate-300 mb-2">
                    <Heart size={18} />
                    <MessageCircle size={18} />
                  </div>
                  <p className="text-xs text-slate-900 dark:text-slate-100 break-words leading-relaxed">
                    <span className="font-bold mr-1.5">{user?.name.toLowerCase().replace(/ /g, '')}</span>
                    {content || 'Enter post content to see Instagram preview...'}
                  </p>
                  <span className="text-[9px] text-slate-400 block mt-2 uppercase">Just now</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Queue Manager list of posts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-150 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Posting Queue & Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">View details, delete or edit scheduled posts and drafts</p>
          </div>
          
          {/* Listing filters */}
          <div className="flex overflow-x-auto gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-150 dark:border-slate-800 shrink-0">
            {['all', 'draft', 'scheduled', 'published'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize shrink-0 transition-all ${
                  filterTab === tab
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Table/Card Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            No posts found matching the filtered status.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post._id} 
                className="border border-slate-150 dark:border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors"
              >
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(post.status)}
                    <div className="flex gap-1.5">
                      {post.platforms.map((p) => {
                        let PlatformIcon = Globe;
                        let colorClass = 'text-slate-400';
                        if (p === 'twitter') { PlatformIcon = Twitter; colorClass = 'text-sky-400'; }
                        else if (p === 'linkedin') { PlatformIcon = Linkedin; colorClass = 'text-blue-600'; }
                        else if (p === 'instagram') { PlatformIcon = Instagram; colorClass = 'text-pink-500'; }
                        return <PlatformIcon key={p} size={15} className={colorClass} />;
                      })}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400">
                    {post.status === 'scheduled' && post.scheduledAt && (
                      <span className="flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400">
                        <Calendar size={13} /> Will publish at: {new Date(post.scheduledAt).toLocaleString()}
                      </span>
                    )}
                    {post.status === 'published' && post.createdAt && (
                      <span className="flex items-center gap-1">
                        Published at: {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {post.status === 'published' && (
                      <span className="flex gap-3 text-slate-500 font-medium">
                        <span>Likes: {post.metrics.likes}</span>
                        <span>Shares: {post.metrics.shares}</span>
                        <span>Comments: {post.metrics.comments}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center md:items-start gap-2 self-end md:self-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0">
                  {post.status !== 'published' && (
                    <button
                      onClick={() => handleEditClick(post)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onDeletePost(post._id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
