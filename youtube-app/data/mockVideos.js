// Mock video data for the YouTube app
export const mockVideos = [
  {
    id: '1',
    title: 'React Native Tutorial for Beginners',
    channelName: 'Code Academy',
    channelImage: 'https://i.pravatar.cc/150?img=1',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    views: '1.2M',
    uploadDate: '2 days ago',
    duration: '12:34',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Learn React Native from scratch in this comprehensive tutorial.',
  },
  {
    id: '2',
    title: 'Building a Mobile App with Expo',
    channelName: 'Dev Tutorials',
    channelImage: 'https://i.pravatar.cc/150?img=2',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
    views: '856K',
    uploadDate: '5 days ago',
    duration: '18:45',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Discover how to build mobile apps using Expo framework.',
  },
  {
    id: '3',
    title: 'JavaScript ES6+ Features Explained',
    channelName: 'JS Master',
    channelImage: 'https://i.pravatar.cc/150?img=3',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
    views: '2.3M',
    uploadDate: '1 week ago',
    duration: '15:20',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Master modern JavaScript features including async/await, promises, and more.',
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    channelName: 'Design Hub',
    channelImage: 'https://i.pravatar.cc/150?img=4',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    views: '945K',
    uploadDate: '3 days ago',
    duration: '22:10',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'Learn essential UI/UX design principles for mobile applications.',
  },
  {
    id: '5',
    title: 'React Hooks Deep Dive',
    channelName: 'React Pro',
    channelImage: 'https://i.pravatar.cc/150?img=5',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    views: '1.8M',
    uploadDate: '1 week ago',
    duration: '25:30',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: 'Understand React Hooks in depth with practical examples.',
  },
  {
    id: '6',
    title: 'Mobile App Performance Optimization',
    channelName: 'Tech Optimizer',
    channelImage: 'https://i.pravatar.cc/150?img=6',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    views: '678K',
    uploadDate: '4 days ago',
    duration: '19:15',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    description: 'Tips and tricks to optimize your mobile app performance.',
  },
  {
    id: '7',
    title: 'API Integration in React Native',
    channelName: 'Backend Dev',
    channelImage: 'https://i.pravatar.cc/150?img=7',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    views: '1.5M',
    uploadDate: '6 days ago',
    duration: '16:45',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    description: 'Learn how to integrate REST APIs in your React Native app.',
  },
  {
    id: '8',
    title: 'State Management with Redux',
    channelName: 'State Master',
    channelImage: 'https://i.pravatar.cc/150?img=8',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    views: '923K',
    uploadDate: '2 weeks ago',
    duration: '28:20',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    description: 'Master Redux for state management in React Native applications.',
  },
];

export const searchVideos = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(lowerQuery) ||
      video.channelName.toLowerCase().includes(lowerQuery) ||
      video.description.toLowerCase().includes(lowerQuery)
  );
};

