import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文章分类 | 个人博客',
  description: '浏览所有文章分类',
};

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              published: true,
            },
          },
        },
      },
    },
  });
  
  return categories.map((category) => ({
    ...category,
    postCount: category._count.posts,
  }));
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-10">文章分类</h1>
      
      {categories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">暂无分类</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <div className="glass-card p-6 rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
                <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
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
      )}
    </div>
  );
}