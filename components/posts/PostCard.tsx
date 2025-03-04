import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    createdAt: Date;
    viewCount: number;
    category?: {
      name: string;
      slug: string;
    } | null;
    author: {
      name: string;
    };
  };
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow overflow-hidden backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
      <div className="card-body">
        <Link href={`/blog/${post.slug}`}>
          <h2 className="card-title text-xl md:text-2xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">{post.title}</h2>
        </Link>
        
        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="mr-3">{post.author.name}</span>
          <span className="mr-3">•</span>
          <span>
            {formatDistance(new Date(post.createdAt), new Date(), { 
              addSuffix: true,
              locale: zhCN
            })}
          </span>
          {post.category && (
            <>
              <span className="mx-3">•</span>
              <Link 
                href={`/categories/${post.category.slug}`}
                className="text-primary hover:underline"
              >
                {post.category.name}
              </Link>
            </>
          )}
        </div>
        
        {post.excerpt && (
          <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        <div className="card-actions justify-between items-center mt-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.viewCount}
          </div>
          
          <Link href={`/blog/${post.slug}`} className="btn btn-primary btn-sm">
            阅读更多
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;