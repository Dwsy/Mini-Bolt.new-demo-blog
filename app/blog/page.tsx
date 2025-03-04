import { prisma } from '@/lib/prisma';
import PostList from '@/components/posts/PostList';
import Search from '@/components/common/Search';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '博客文章 | 个人博客',
  description: '浏览所有博客文章',
};

interface BlogPageProps {
  searchParams?: {
    search?: string;
    category?: string;
    tag?: string;
  };
}

async function getPosts(search?: string, category?: string, tag?: string) {
  const where: any = {
    published: true,
  };
  
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }
  
  if (category) {
    where.category = {
      slug: category,
    };
  }
  
  if (tag) {
    where.tags = {
      some: {
        tag: {
          slug: tag,
        },
      },
    };
  }
  
  const posts = await prisma.post.findMany({
    where,
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

function PostsSection({ posts }: { posts: Awaited<ReturnType<typeof getPosts>> }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">没有找到文章</h3>
        <p className="mt-2">尝试使用不同的搜索词或过滤条件</p>
      </div>
    );
  }
  
  return <PostList posts={posts} />;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { search, category, tag } = searchParams || {};
  
  let title = '所有文章';
  let description;
  
  if (search) {
    title = `搜索: ${search}`;
    description = `与 "${search}" 相关的文章`;
  } else if (category) {
    title = `分类: ${category}`;
    description = `${category} 分类下的所有文章`;
  } else if (tag) {
    title = `标签: ${tag}`;
    description = `带有 ${tag} 标签的所有文章`;
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>}
      
      <Search initialValue={search} />
      
      <div className="mt-10">
        <Suspense fallback={<div>正在加载文章...</div>}>
          {/* @ts-expect-error Async Server Component */}
          <PostsSection posts={await getPosts(search, category, tag)} />
        </Suspense>
      </div>
    </div>
  );
}