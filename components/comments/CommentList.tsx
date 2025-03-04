import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: Date;
}

interface CommentListProps {
  comments: Comment[];
}

const CommentList = ({ comments }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        还没有评论。成为第一个发表评论的人！
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="glass-card p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">{comment.authorName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), { 
                addSuffix: true,
                locale: zhCN
              })}
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;