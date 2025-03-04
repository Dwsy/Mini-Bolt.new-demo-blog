import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import PostList from '@/components/posts/PostList';

interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTag(params.slug);
  
  if (!tag) {
    return {
      title: '标签未找到 | 个人博客',
    };
  }
  
  return {
    title: `${tag.name} | 标签 | 个人博客`,
    description: `浏览所有带有 ${tag.name} 标签的文章`,
  };
}

async function getTag(slug: string) {
  const tag = await prisma.tag.findUnique({
    where: { slug },
  });
  
  return tag;
}

async function getTagPosts(slug: string) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      tags: {
        some: {
          tag: {
            slug,
          },
        },
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

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTag(params.slug);
  
  if (!tag) {
    notFound();
  }
  
  const posts = await getTagPosts(params.slug);
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        标签: {tag.name} ({posts.length}篇文章)
      </h1>
      
      <div className="mt-6">
        <PostList posts={posts} />
      </div>
    </div>
  );
}