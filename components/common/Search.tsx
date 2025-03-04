'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchProps {
  initialValue?: string;
}

const Search = ({ initialValue = '' }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/blog');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full pl-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
          placeholder="搜索文章..."
        />
        <button type="submit" className="absolute right-2.5 bottom-2.5 btn btn-primary btn-sm">
          搜索
        </button>
      </div>
    </form>
  );
};

export default Search;