import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import CommentForm from '@/components/comments/CommentForm';
import CommentList from '@/components/comments/CommentList';
import { Suspense } from 'react';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: '文章未找到 | 个人博客',
    };
  }
  
  return {
    title: `${post.title} | 个人博客`,
    description: post.excerpt || undefined,
  };
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      comments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
  
  if (!post) {
    return null;
  }
  
  // 增加浏览次数
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });
  
  return {
    ...post,
    tags: post.tags.map((tag) => tag.tag),
  };
}

function PostContent({ post }: { post: NonNullable<Awaited<ReturnType<typeof getPost>>> }) {
  return (
    <article className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
        <span className="mr-4">
          {post.author.name}
        </span>
        <span className="mr-4">
          {formatDistanceToNow(new Date(post.createdAt), { 
            addSuffix: true,
            locale: zhCN 
          })}
        </span>
        <span className="mr-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {post.viewCount}
        </span>
        {post.category && (
          <Link 
            href={`/categories/${post.category.slug}`}
            className="badge badge-outline mr-2"
          >
            {post.category.name}
          </Link>
        )}
        {post.tags.map((tag) => (
          <Link 
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className="badge badge-primary badge-outline mr-2"
          >
            {tag.name}
          </Link>
        ))}
      </div>
      
      <div 
        className="prose prose-lg max-w-none dark:prose-invert markdown-content"
        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
      />
    </article>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <PostContent post={post} />
      
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6">评论 ({post.comments.length})</h2>
        <CommentForm postId={post.id} />
        
        <div className="mt-8">
          <Suspense fallback={<div>加载评论...</div>}>
            <CommentList comments={post.comments} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}