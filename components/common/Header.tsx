'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <header className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            个人博客
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/" className={`hover:text-primary transition-colors ${pathname === '/' ? 'text-primary font-medium' : ''}`}>
              首页
            </Link>
            <Link href="/blog" className={`hover:text-primary transition-colors ${pathname === '/blog' || pathname.startsWith('/blog/') ? 'text-primary font-medium' : ''}`}>
              博客
            </Link>
            <Link href="/categories" className={`hover:text-primary transition-colors ${pathname === '/categories' || pathname.startsWith('/categories/') ? 'text-primary font-medium' : ''}`}>
              分类
            </Link>
            <Link href="/tags" className={`hover:text-primary transition-colors ${pathname === '/tags' || pathname.startsWith('/tags/') ? 'text-primary font-medium' : ''}`}>
              标签
            </Link>
            <Link href="/about" className={`hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary font-medium' : ''}`}>
              关于
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <button 
              onClick={toggleMenu}
              className="md:hidden text-gray-500 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <Link href="/" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                首页
              </Link>
              <Link href="/blog" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/blog' || pathname.startsWith('/blog/') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                博客
              </Link>
              <Link href="/categories" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/categories' || pathname.startsWith('/categories/') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                分类
              </Link>
              <Link href="/tags" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/tags' || pathname.startsWith('/tags/') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                标签
              </Link>
              <Link href="/about" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/about' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                关于
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;