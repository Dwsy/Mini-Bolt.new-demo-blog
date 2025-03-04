import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文章标签 | 个人博客',
  description: '浏览所有文章标签',
};

async function getTags() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              post: {
                published: true,
              },
            },
          },
        },
      },
    },
  });
  
  return tags.map((tag) => ({
    ...tag,
    postCount: tag._count.posts,
  }));
}

export default async function TagsPage() {
  const tags = await getTags();
  
  // 根据文章数量对标签进行排序
  const sortedTags = [...tags].sort((a, b) => b.postCount - a.postCount);
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-10">文章标签</h1>
      
      {sortedTags.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">暂无标签</p>
        </div>
      ) : (
        <div className="glass-card p-8 rounded-lg">
          <div className="flex flex-wrap gap-3">
            {sortedTags.map((tag) => (
              <Link 
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="badge badge-lg badge-primary badge-outline p-4 hover:bg-primary hover:text-white transition-colors"
              >
                {tag.name} ({tag.postCount})
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}