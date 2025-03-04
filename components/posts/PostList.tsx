import PostCard from './PostCard';

interface PostListProps {
  posts: Array<{
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
  }>;
}

const PostList = ({ posts }: PostListProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">没有找到文章</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;