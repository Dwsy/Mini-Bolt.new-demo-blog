import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import PostList from '@/components/posts/PostList';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);
  
  if (!category) {
    return {
      title: '分类未找到 | 个人博客',
    };
  }
  
  return {
    title: `${category.name} | 分类 | 个人博客`,
    description: category.description || `浏览 ${category.name} 分类下的所有文章`,
  };
}

async function getCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });
  
  return category;
}

async function getCategoryPosts(slug: string) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      category: {
        slug,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug);
  
  if (!category) {
    notFound();
  }
  
  const posts = await getCategoryPosts(params.slug);
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6">{category.description}</p>
      )}
      
      <div className="mt-10">
        <PostList posts={posts} />
      </div>
    </div>
  );
}