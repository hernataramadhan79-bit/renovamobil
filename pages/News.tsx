
import React from 'react';
import { Link } from 'react-router-dom';
import { NewsPost } from '../types';

interface NewsProps {
  news: NewsPost[];
}

const News: React.FC<NewsProps> = ({ news }) => {
  return (
    <div className="min-h-screen pt-12 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 animate-fade-in-up">
          <h2 className="text-orange-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">Pembaruan Terbaru</h2>
          <h1 className="text-5xl font-black text-slate-900">BERITA OTOMOTIF</h1>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {news.map((post, idx) => (
            <article key={post.id} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in-up`} style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="w-full md:w-1/2 h-64 md:h-96 overflow-hidden rounded-2xl group">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center px-4">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 uppercase tracking-widest">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                  <span>Oleh {post.author}</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6 hover:text-blue-800 transition-colors cursor-pointer leading-tight">
                  <Link to={`/news/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link 
                  to={`/news/${post.id}`}
                  className="self-start text-orange-600 font-bold flex items-center gap-2 group hover:text-orange-700 hover:translate-x-1 transition-all"
                >
                  Baca Selengkapnya
                  <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
