import Link from 'next/link';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import PostList from '@/components/posts/PostList';

async function getFeaturedPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      featured: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
      viewCount: true,
      author: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
  
  return posts;
}

async function getRecentPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
      viewCount: true,
      author: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
  
  return posts;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });
  
  return categories.map((category) => ({
    ...category,
    postCount: category._count.posts,
  }));
}

function FeaturedPostsSection({ posts }: { posts: Awaited<ReturnType<typeof getFeaturedPosts>> }) {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">精选文章</h2>
        <PostList posts={posts} />
      </div>
    </section>
  );
}

function RecentPostsSection({ posts }: { posts: Awaited<ReturnType<typeof getRecentPosts>> }) {
  return (
    <section className="py-10 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">最新文章</h2>
          <Link 
            href="/blog" 
            className="text-primary hover:underline flex items-center"
          >
            查看全部
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
        <PostList posts={posts} />
      </div>
    </section>
  );
}

function CategoriesSection({ categories }: { categories: Awaited<ReturnType<typeof getCategories>> }) {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">分类</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <div className="glass-card p-6 rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{category.postCount} 篇文章</span>
                  <span className="text-primary">浏览 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 md:py-20 px-4 flex items-center min-h-[50vh] bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">欢迎来到我的个人博客</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              分享技术和生活的个人空间
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/blog" className="btn btn-primary">
                浏览文章
              </Link>
              <Link href="/about" className="btn btn-outline btn-primary">
                关于我
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Suspense fallback={<div className="container mx-auto py-10 px-4">正在加载精选文章...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <FeaturedPostsSection posts={await getFeaturedPosts()} />
      </Suspense>
      
      <Suspense fallback={<div className="container mx-auto py-10 px-4 bg-gray-50 dark:bg-gray-800">正在加载最新文章...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <RecentPostsSection posts={await getRecentPosts()} />
      </Suspense>
      
      <Suspense fallback={<div className="container mx-auto py-10 px-4">正在加载分类...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <CategoriesSection categories={await getCategories()} />
      </Suspense>
    </div>
  );
}