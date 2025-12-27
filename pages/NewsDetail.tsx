
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsPost } from '../types';
import { getImageUrl } from '../utils/database';

interface NewsDetailProps {
  news: NewsPost[];
}

const NewsDetail: React.FC<NewsDetailProps> = ({ news }) => {
  const { id } = useParams<{ id: string }>();
  const post = news.find(n => n.id === id);

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Artikel Tidak Ditemukan</h2>
        <Link to="/news" className="text-blue-600 hover:underline">Kembali ke Berita</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Image */}
      <div className="w-full h-[50vh] relative">
         <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
         <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <Link to="/news" className="inline-block mb-6 text-orange-400 hover:text-orange-300 font-bold text-sm tracking-widest uppercase transition-colors">
              ← Kembali ke Berita
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight shadow-sm">{post.title}</h1>
            <div className="flex items-center gap-6 text-blue-100 text-sm font-medium">
              <span className="flex items-center gap-2">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 {post.date}
              </span>
              <span className="flex items-center gap-2">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 {post.author}
              </span>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
           <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8 border-l-4 border-orange-500 pl-6 italic">
              {post.excerpt}
           </p>
           <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-loose">
              {post.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6 last:mb-0">{paragraph}</p>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
