import React from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  UserPlus, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Globe 
} from 'lucide-react';

export default function RecentActivity() {
  
  const activities = [
    {
      id: 1,
      type: 'like',
      platform: 'twitter',
      userName: 'Alex Rivers',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
      description: 'liked your tweet about Antigravity 2.0 launch',
      time: '4m ago',
    },
    {
      id: 2,
      type: 'comment',
      platform: 'linkedin',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
      description: 'commented: "This is exactly what our dev team was looking for!"',
      time: '18m ago',
    },
    {
      id: 3,
      type: 'share',
      platform: 'linkedin',
      userName: 'Marcus Sterling',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
      description: 'reposted your Node.js Event-Driven design tip',
      time: '1h ago',
    },
    {
      id: 4,
      type: 'follow',
      platform: 'instagram',
      userName: 'Creative Agency',
      userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
      description: 'started following you on Instagram',
      time: '2h ago',
    },
    {
      id: 5,
      type: 'like',
      platform: 'instagram',
      userName: 'Chloe Vance',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
      description: 'liked your कंपनी हैकाथॉन company photo',
      time: '4h ago',
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'like':
        return <div className="p-1 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 rounded-full"><Heart size={12} fill="currentColor" /></div>;
      case 'comment':
        return <div className="p-1 bg-indigo-150 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full"><MessageCircle size={12} fill="currentColor" /></div>;
      case 'share':
        return <div className="p-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded-full"><Share2 size={12} /></div>;
      case 'follow':
        return <div className="p-1 bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-full"><UserPlus size={12} /></div>;
      default:
        return <Globe size={12} />;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return <Twitter size={10} className="text-sky-400" />;
      case 'linkedin':
        return <Linkedin size={10} className="text-blue-600" />;
      case 'instagram':
        return <Instagram size={10} className="text-pink-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <h4 className="font-bold text-slate-900 dark:text-white">Recent Activities</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">Live feeds of engagement across accounts</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto max-h-[360px] pr-1">
        {activities.map((act) => (
          <div key={act.id} className="flex gap-3 items-start text-left">
            <div className="relative shrink-0">
              <img 
                src={act.userAvatar} 
                alt={act.userName} 
                className="w-9 h-9 rounded-full object-cover" 
              />
              <div className="absolute -bottom-1 -right-1">
                {getTypeIcon(act.type)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-800 dark:text-slate-200">
                <span className="font-semibold mr-1 text-slate-950 dark:text-white">{act.userName}</span>
                {act.description}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                {getPlatformIcon(act.platform)}
                <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
