import React from 'react';
import { Calendar, User, ArrowRight, Clock, MapPin, Heart, Bookmark } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  likes: number;
  location: string;
}

const Blog: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Hidden Gems of Southeast Asia: 7 Destinations Off the Beaten Path",
      excerpt: "Discover enchanting locations that haven't been touched by mass tourism, from secret waterfalls in Laos to pristine beaches in the Philippines.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      author: "Sarah Mitchell",
      date: "March 15, 2024",
      readTime: "8 min read",
      category: "Adventure",
      likes: 247,
      location: "Southeast Asia"
    },
    {
      id: 2,
      title: "The Ultimate Guide to Solo Female Travel in Europe",
      excerpt: "Comprehensive tips, safety advice, and inspiring stories from women who've explored Europe independently and fearlessly.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
      author: "Emma ",
      date: "March 12, 2024",
      readTime: "12 min read",
      category: "Solo Travel",
      likes: 189,
      location: "Europe"
    },
    {
      id: 3,
      title: "Budget Backpacking Through South America: ₹ 10000 a Day",
      excerpt: "Learn how to explore the diverse landscapes and rich cultures of South America without breaking the bank.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
      author: "Miguel ",
      date: "March 10, 2024",
      readTime: "10 min read",
      category: "Budget Travel",
      likes: 156,
      location: "South America"
    },
    {
      id: 4,
      title: "Digital Nomad Hotspots: Best Cities for Remote Work",
      excerpt: "From Bali's co-working spaces to Lisbon's vibrant tech scene, discover where digital nomads are thriving in 2024.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
      author: "Alex Chen",
      date: "March 8, 2024",
      readTime: "6 min read",
      category: "Digital Nomad",
      likes: 203,
      location: "Global"
    },
    {
      id: 5,
      title: "Sustainable Tourism: How to Travel Responsibly",
      excerpt: "Make a positive impact while exploring the world with these eco-friendly travel practices and sustainable accommodation options.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      author: "green travel",
      date: "March 5, 2024",
      readTime: "9 min read",
      category: "Eco-Travel",
      likes: 134,
      location: "Worldwide"
    },
    {
      id: 6,
      title: "Food Adventures: Street Food Capitals of the World",
      excerpt: "Embark on a culinary journey through Bangkok's floating markets, Istanbul's spice bazaars, and Mexico City's taco stands.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      author: "Food Explorer",
      date: "March 3, 2024",
      readTime: "7 min read",
      category: "Food & Culture",
      likes: 278,
      location: "Global"
    }
  ];

  const categories = ["All", "Adventure", "Solo Travel", "Budget Travel", "Digital Nomad", "Eco-Travel", "Food & Culture"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [likedPosts, setLikedPosts] = React.useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = React.useState(new Set());

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const toggleLike = (postId: number): void => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (postId: number): void => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#16baa5] via-[#0aa58d] to-[#087c6b]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Travel
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Stories</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover inspiring adventures, hidden destinations, and travel wisdom from explorers around the globe
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#16baa5] to-[#0aa58d] text-white shadow-lg shadow-blue-500/25 cursor-pointer'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200 cursor-pointer'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="lg:flex">
              <div className="lg:w-1/2">
                <div className="relative h-80 lg:h-full overflow-hidden">
                  <img
                    src={filteredPosts[0]?.image}
                    alt={filteredPosts[0]?.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Featured Story
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
              </div>
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {filteredPosts[0]?.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {filteredPosts[0]?.location}
                  </div>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {filteredPosts[0]?.title}
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {filteredPosts[0]?.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <User className="w-4 h-4 mr-2" />
                      {filteredPosts[0]?.author}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {filteredPosts[0]?.date}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {filteredPosts[0]?.readTime}
                    </div>
                  </div>
                  {/* <button className="bg-gradient-to-r from-[#16baa5] to-[#0aa58d] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      likedPosts.has(post.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleBookmark(post.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      bookmarkedPosts.has(post.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/90 text-gray-700 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {post.location}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex  items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                    <div className="flex items-center text-red-500">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </div>
                  </div>
                </div>
                
                <a href='https://www.instagram.com/sha_ni_hala_' className="w-full mt-4 bg-gradient-to-r from-[#16baa5] to-[#0aa58d] text-white cursor-pointer py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  Read Full Story
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>


        {/* Newsletter Section */}
        <div className="mt-20 bg-gradient-to-r from-[#16baa5] via-[#0aa58d] to-[#087c6b] rounded-3xl p-8 lg:p-12 text-center">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Never Miss an Adventure
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest travel stories, tips, and exclusive destination guides delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl border-none focus:outline-none focus:ring-4 focus:ring-white/25 text-gray-800"
            />
            <button className="bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;