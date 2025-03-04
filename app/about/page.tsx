import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于 | 个人博客',
  description: '了解博客作者的更多信息',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">关于我</h1>
        
        <div className="glass-card p-8 rounded-lg mb-10">
          <p className="text-lg mb-4">
            你好! 我是这个博客的作者，一名热爱技术和分享的开发者。
          </p>
          <p className="text-lg mb-4">
            我创建这个博客的目的是分享我在技术学习过程中的心得体会，以及生活中的所思所想。希望我的文章能够对你有所帮助或启发。
          </p>
          <p className="text-lg">
            欢迎在文章下方留言，或通过下面的联系方式与我交流!
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">技能</h2>
        <div className="glass-card p-6 rounded-lg mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">前端开发</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>React / Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>HTML5 / CSS3</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">后端开发</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Node.js</li>
                <li>Prisma ORM</li>
                <li>SQL / NoSQL 数据库</li>
                <li>RESTful API 设计</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">联系方式</h2>
        <div className="glass-card p-6 rounded-lg">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>example@example.com</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                GitHub
              </a>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>微信: example</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}