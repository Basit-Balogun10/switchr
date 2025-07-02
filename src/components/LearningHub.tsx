import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function LearningHub() {
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const articles = useQuery(api.articles.list, { 
    category: selectedCategory || undefined,
    published: true 
  });
  const featuredArticles = useQuery(api.articles.list, { featured: true, published: true });

  if (articles === undefined || featuredArticles === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const categories = [
    { id: "", label: "All Articles", icon: "📚" },
    { id: "benefits", label: "Benefits", icon: "💡" },
    { id: "safety", label: "Safety", icon: "🛡️" },
    { id: "government", label: "Government", icon: "🏛️" },
    { id: "maintenance", label: "Maintenance", icon: "🔧" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Learning Hub</h1>
        <p className="text-white/70">Everything you need to know about clean mobility</p>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Featured Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.slice(0, 3).map((article) => (
              <div key={article._id} className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                  <span className="text-white/60 text-sm">{article.readTime} min read</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{article.title}</h3>
                <p className="text-white/70 mb-4 line-clamp-3">
                  {article.content.substring(0, 150)}...
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
                  Read Article
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border transition-all text-center ${
                selectedCategory === category.id
                  ? "border-green-500 bg-green-500/20 text-green-300"
                  : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium">{category.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          {selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : "All Articles"}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article._id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  article.category === "benefits" ? "bg-blue-500/20 text-blue-300" :
                  article.category === "safety" ? "bg-red-500/20 text-red-300" :
                  article.category === "government" ? "bg-purple-500/20 text-purple-300" :
                  "bg-gray-500/20 text-gray-300"
                }`}>
                  {article.category}
                </span>
                <span className="text-white/60 text-sm">{article.readTime} min read</span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-3">{article.title}</h3>
              <p className="text-white/70 mb-4 line-clamp-3">
                {article.content.substring(0, 120)}...
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70">No articles found in this category.</p>
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            {
              question: "How long does a CNG conversion take?",
              answer: "A typical CNG conversion takes 2-3 days, depending on the vehicle type and complexity of the installation."
            },
            {
              question: "Is my vehicle warranty affected by conversion?",
              answer: "Professional conversions by certified providers typically don't void your warranty, but it's best to check with your manufacturer."
            },
            {
              question: "What government incentives are available?",
              answer: "The Nigerian government offers import duty waivers on CNG kits and tax rebates for clean vehicle adoption."
            },
            {
              question: "How often do CNG systems need maintenance?",
              answer: "CNG systems require inspection every 6 months and major servicing annually by certified technicians."
            }
          ].map((faq, index) => (
            <details key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <summary className="text-white font-medium cursor-pointer hover:text-green-300 transition-colors">
                {faq.question}
              </summary>
              <p className="text-white/70 mt-3 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
