*Thinking...*

> 我需要设计一个使用Next.js 13+React+TypeScript+TailwindCSS+daisyUI+Prisma+SQLite的个人博客系统。首先，我需要规划整个应用的需求和架构，然后编写相关代码。
> 
> ### 1. 产品需求分析
> 
> 作为产品经理，我会提出以下需求：
> 
> #### 核心功能需求：
> 1. 博客文章管理（发布、编辑、删除）
> 2. 文章分类和标签管理
> 3. 评论系统
> 4. 用户认证（管理员登录）
> 5. 响应式设计，支持移动端和桌面端
> 6. 支持暗色和亮色主题模式，并提供切换功能
> 7. 使用玻璃拟态等现代视觉效果
> 8. 文章搜索功能
> 9. 文章阅读计数
> 
> #### 页面规划：
> 1. 首页 - 展示最新博客文章列表
> 2. 文章详情页 - 展示单篇文章内容和评论
> 3. 分类页 - 按分类浏览文章
> 4. 标签页 - 按标签浏览文章
> 5. 关于页 - 博主个人介绍
> 6. 管理后台 - 文章管理界面（需要登录）
> 
> ### 2. 技术架构
> 
> #### 前端架构：
> - Next.js 13（App Router）
> - React 18+
> - TypeScript
> - TailwindCSS + daisyUI（通过CDN引入）
> - 主题切换功能
> 
> #### 后端架构：
> - Next.js API Routes
> - Prisma ORM
> - SQLite 数据库
> 
> #### 数据库设计：
> 需要考虑SQLite不支持枚举类型的限制。
> 
> 主要实体：
> 1. 用户（User）- 管理员账户
> 2. 文章（Post）
> 3. 分类（Category）
> 4. 标签（Tag）
> 5. 评论（Comment）
> 
> ### 3. 文件结构规划
> 
> ```
> my-blog/
> ├── app/
> │   ├── (admin)/
> │   │   ├── dashboard/
> │   │   │   └── page.tsx
> │   │   ├── login/
> │   │   │   └── page.tsx
> │   │   └── layout.tsx
> │   ├── about/
> │   │   └── page.tsx
> │   ├── api/
> │   │   ├── auth/
> │   │   │   └── [...nextauth]/
> │   │   │       └── route.ts
> │   │   ├── posts/
> │   │   │   └── route.ts
> │   │   ├── categories/
> │   │   │   └── route.ts
> │   │   ├── tags/
> │   │   │   └── route.ts
> │   │   └── comments/
> │   │       └── route.ts
> │   ├── blog/
> │   │   ├── [slug]/
> │   │   │   └── page.tsx
> │   │   └── page.tsx
> │   ├── categories/
> │   │   ├── [slug]/
> │   │   │   └── page.tsx
> │   │   └── page.tsx
> │   ├── tags/
> │   │   ├── [slug]/
> │   │   │   └── page.tsx
> │   │   └── page.tsx
> │   ├── layout.tsx
> │   ├── page.tsx
> │   └── globals.css
> ├── components/
> │   ├── common/
> │   │   ├── Header.tsx
> │   │   ├── Footer.tsx
> │   │   ├── ThemeToggle.tsx
> │   │   └── ...
> │   ├── posts/
> │   │   ├── PostCard.tsx
> │   │   ├── PostList.tsx
> │   │   └── ...
> │   └── admin/
> │       ├── PostForm.tsx
> │       └── ...
> ├── lib/
> │   ├── prisma.ts
> │   ├── utils.ts
> │   └── auth.ts
> ├── prisma/
> │   ├── schema.prisma
> │   ├── migrations/
> │   ├── seed.ts
> │   └── dev.db
> ├── public/
> │   └── ...
> ├── next.config.js
> ├── postcss.config.js
> ├── tailwind.config.js
> ├── tsconfig.json
> ├── package.json
> └── README.md
> ```
> 
> 现在我将开始编写这个项目的代码。
> 
> ### 4. 首先，定义 Prisma Schema
> 
> 创建 Prisma Schema 来定义我们的数据模型：
> 
> ```prisma
> // prisma/schema.prisma
> generator client {
>   provider = "prisma-client-js"
> }
> 
> datasource db {
>   provider = "sqlite"
>   url      = "file:./dev.db"
> }
> 
> model User {
>   id            String    @id @default(cuid())
>   name          String
>   email         String    @unique
>   password      String
>   image         String?
>   role          String    @default("USER") // 注意：SQLite不支持枚举，使用String
>   createdAt     DateTime  @default(now())
>   updatedAt     DateTime  @updatedAt
>   posts         Post[]
> }
> 
> model Post {
>   id            String    @id @default(cuid())
>   title         String
>   slug          String    @unique
>   content       String
>   excerpt       String?
>   featured      Boolean   @default(false)
>   published     Boolean   @default(false)
>   viewCount     Int       @default(0)
>   createdAt     DateTime  @default(now())
>   updatedAt     DateTime  @updatedAt
>   author        User      @relation(fields: [authorId], references: [id])
>   authorId      String
>   category      Category? @relation(fields: [categoryId], references: [id])
>   categoryId    String?
>   tags          TagsOnPosts[]
>   comments      Comment[]
> }
> 
> model Category {
>   id            String    @id @default(cuid())
>   name          String    @unique
>   slug          String    @unique
>   description   String?
>   posts         Post[]
> }
> 
> model Tag {
>   id            String    @id @default(cuid())
>   name          String    @unique
>   slug          String    @unique
>   posts         TagsOnPosts[]
> }
> 
> model TagsOnPosts {
>   post          Post      @relation(fields: [postId], references: [id])
>   postId        String
>   tag           Tag       @relation(fields: [tagId], references: [id])
>   tagId         String
> 
>   @@id([postId, tagId])
> }
> 
> model Comment {
>   id            String    @id @default(cuid())
>   content       String
>   authorName    String
>   authorEmail   String
>   createdAt     DateTime  @default(now())
>   post          Post      @relation(fields: [postId], references: [id])
>   postId        String
> }
> ```
> 
> ### 5. 创建 Prisma 客户端文件
> 
> ```typescript
> // lib/prisma.ts
> import { PrismaClient } from '@prisma/client';
> 
> declare global {
>   var prisma: PrismaClient | undefined;
> }
> 
> export const prisma = global.prisma || new PrismaClient();
> 
> if (process.env.NODE_ENV !== 'production') {
>   global.prisma = prisma;
> }
> ```
> 
> ### 6. 创建 Seed 文件
> 
> ```typescript
> // prisma/seed.ts
> import { PrismaClient } from '@prisma/client';
> import { hash } from 'bcrypt';
> 
> const prisma = new PrismaClient();
> 
> async function main() {
>   // 创建管理员用户
>   const adminPassword = await hash('admin123', 10);
>   const admin = await prisma.user.upsert({
>     where: { email: 'admin@example.com' },
>     update: {},
>     create: {
>       email: 'admin@example.com',
>       name: 'Admin',
>       password: adminPassword,
>       role: 'ADMIN',
>     },
>   });
> 
>   // 创建分类
>   const technology = await prisma.category.upsert({
>     where: { slug: 'technology' },
>     update: {},
>     create: {
>       name: '技术',
>       slug: 'technology',
>       description: '技术相关文章',
>     },
>   });
> 
>   const lifestyle = await prisma.category.upsert({
>     where: { slug: 'lifestyle' },
>     update: {},
>     create: {
>       name: '生活方式',
>       slug: 'lifestyle',
>       description: '生活方式相关文章',
>     },
>   });
> 
>   // 创建标签
>   const tagReact = await prisma.tag.upsert({
>     where: { slug: 'react' },
>     update: {},
>     create: {
>       name: 'React',
>       slug: 'react',
>     },
>   });
> 
>   const tagNextjs = await prisma.tag.upsert({
>     where: { slug: 'nextjs' },
>     update: {},
>     create: {
>       name: 'Next.js',
>       slug: 'nextjs',
>     },
>   });
> 
>   const tagLifestyle = await prisma.tag.upsert({
>     where: { slug: 'lifestyle' },
>     update: {},
>     create: {
>       name: '生活方式',
>       slug: 'lifestyle',
>     },
>   });
> 
>   // 创建文章
>   const post1 = await prisma.post.create({
>     data: {
>       title: '开始使用 Next.js 13',
>       slug: 'getting-started-with-nextjs-13',
>       content: `
> # 开始使用 Next.js 13
> 
> Next.js 13 引入了许多令人兴奋的新特性，包括新的 App Router、React Server Components 等。
> 
> ## App Router
> 
> App Router 是 Next.js 13 中最令人兴奋的新特性之一。它允许你使用文件系统路由来组织你的应用。
> 
> ## React Server Components
> 
> React Server Components 允许你在服务器上渲染 React 组件，从而提高性能和用户体验。
> 
> ## 结论
> 
> Next.js 13 带来了许多改进，使构建现代 Web 应用程序变得更加容易和高效。
>       `,
>       excerpt: 'Next.js 13 引入了许多令人兴奋的新特性，包括新的 App Router、React Server Components 等。',
>       published: true,
>       featured: true,
>       authorId: admin.id,
>       categoryId: technology.id,
>     },
>   });
> 
>   // 为文章添加标签
>   await prisma.tagsOnPosts.create({
>     data: {
>       postId: post1.id,
>       tagId: tagReact.id,
>     },
>   });
> 
>   await prisma.tagsOnPosts.create({
>     data: {
>       postId: post1.id,
>       tagId: tagNextjs.id,
>     },
>   });
> 
>   const post2 = await prisma.post.create({
>     data: {
>       title: '如何保持工作与生活的平衡',
>       slug: 'how-to-maintain-work-life-balance',
>       content: `
> # 如何保持工作与生活的平衡
> 
> 在当今快节奏的世界中，保持工作与生活的平衡变得越来越具有挑战性。本文将分享一些技巧，帮助你在忙碌的工作生活中找到平衡。
> 
> ## 设定清晰的边界
> 
> 设定工作时间和个人时间的清晰边界是保持平衡的关键。尽量避免在非工作时间处理工作事务。
> 
> ## 优先考虑自我照顾
> 
> 确保你有足够的时间进行自我照顾，包括锻炼、健康饮食和足够的休息。
> 
> ## 学会说不
> 
> 学会对不必要的承诺说不，这样你就可以专注于对你真正重要的事情。
> 
> ## 结论
> 
> 保持工作与生活的平衡需要有意识的努力，但这对于你的整体健康和幸福至关重要。
>       `,
>       excerpt: '在当今快节奏的世界中，保持工作与生活的平衡变得越来越具有挑战性。本文将分享一些技巧，帮助你在忙碌的工作生活中找到平衡。',
>       published: true,
>       authorId: admin.id,
>       categoryId: lifestyle.id,
>     },
>   });
> 
>   await prisma.tagsOnPosts.create({
>     data: {
>       postId: post2.id,
>       tagId: tagLifestyle.id,
>     },
>   });
> 
>   // 添加评论
>   await prisma.comment.create({
>     data: {
>       content: '非常有用的文章，谢谢分享！',
>       authorName: '张三',
>       authorEmail: 'zhangsan@example.com',
>       postId: post1.id,
>     },
>   });
> 
>   await prisma.comment.create({
>     data: {
>       content: '很期待 Next.js 13 的更多功能',
>       authorName: '李四',
>       authorEmail: 'lisi@example.com',
>       postId: post1.id,
>     },
>   });
> 
>   console.log('数据库初始化完成');
> }
> 
> main()
>   .then(async () => {
>     await prisma.$disconnect();
>   })
>   .catch(async (e) => {
>     console.error(e);
>     await prisma.$disconnect();
>     process.exit(1);
>   });
> ```
> 
> ### 7. 创建基础组件
> 
> 现在让我们创建核心公共组件：
> 
> #### Header 组件
> 
> ```tsx
> // components/common/Header.tsx
> 'use client';
> 
> import Link from 'next/link';
> import { useState, useEffect } from 'react';
> import ThemeToggle from './ThemeToggle';
> import { usePathname } from 'next/navigation';
> 
> const Header = () => {
>   const [isMenuOpen, setIsMenuOpen] = useState(false);
>   const pathname = usePathname();
>   
>   const toggleMenu = () => {
>     setIsMenuOpen(!isMenuOpen);
>   };
>   
>   const closeMenu = () => {
>     setIsMenuOpen(false);
>   };
> 
>   useEffect(() => {
>     closeMenu();
>   }, [pathname]);
> 
>   return (
>     <header className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 fixed top-0 left-0 right-0 z-50 shadow-sm">
>       <div className="container mx-auto px-4">
>         <div className="flex justify-between items-center h-16">
>           <Link href="/" className="text-2xl font-bold text-primary">
>             个人博客
>           </Link>
>           
>           <div className="hidden md:flex space-x-6">
>             <Link href="/" className={`hover:text-primary transition-colors ${pathname === '/' ? 'text-primary font-medium' : ''}`}>
>               首页
>             </Link>
>             <Link href="/blog" className={`hover:text-primary transition-colors ${pathname === '/blog' || pathname.startsWith('/blog/') ? 'text-primary font-medium' : ''}`}>
>               博客
>             </Link>
>             <Link href="/categories" className={`hover:text-primary transition-colors ${pathname === '/categories' || pathname.startsWith('/categories/') ? 'text-primary font-medium' : ''}`}>
>               分类
>             </Link>
>             <Link href="/tags" className={`hover:text-primary transition-colors ${pathname === '/tags' || pathname.startsWith('/tags/') ? 'text-primary font-medium' : ''}`}>
>               标签
>             </Link>
>             <Link href="/about" className={`hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary font-medium' : ''}`}>
>               关于
>             </Link>
>           </div>
>           
>           <div className="flex items-center space-x-4">
>             <ThemeToggle />
>             
>             <button 
>               onClick={toggleMenu}
>               className="md:hidden text-gray-500 hover:text-primary focus:outline-none"
>               aria-label="Toggle menu"
>             >
>               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
>                 {isMenuOpen ? (
>                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
>                 ) : (
>                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
>                 )}
>               </svg>
>             </button>
>           </div>
>         </div>
>         
>         {/* Mobile Menu */}
>         {isMenuOpen && (
>           <div className="md:hidden py-4 animate-fadeIn">
>             <div className="flex flex-col space-y-3">
>               <Link href="/" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
>                 首页
>               </Link>
>               <Link href="/blog" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/blog' || pathname.startsWith('/blog/') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
>                 博客
>               </Link>
>               <Link href="/categories" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/categories' || pathname.startsWith('/categories/') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
>                 分类
>               </Link>
>               <Link href="/tags" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/tags' || pathname.startsWith('/tags/') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
>                 标签
>               </Link>
>               <Link href="/about" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/about' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
>                 关于
>               </Link>
>             </div>
>           </div>
>         )}
>       </div>
>     </header>
>   );
> };
> 
> export default Header;
> ```
> 
> #### ThemeToggle 组件
> 
> ```tsx
> // components/common/ThemeToggle.tsx
> 'use client';
> 
> import { useState, useEffect } from 'react';
> 
> const ThemeToggle = () => {
>   const [isDarkMode, setIsDarkMode] = useState(false);
> 
>   useEffect(() => {
>     // 初始化时检查系统主题偏好
>     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
>       setIsDarkMode(true);
>       document.documentElement.classList.add('dark');
>     } else {
>       setIsDarkMode(false);
>       document.documentElement.classList.remove('dark');
>     }
> 
>     // 监听系统主题偏好变化
>     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
>     const handleChange = (e: MediaQueryListEvent) => {
>       setIsDarkMode(e.matches);
>       if (e.matches) {
>         document.documentElement.classList.add('dark');
>       } else {
>         document.documentElement.classList.remove('dark');
>       }
>     };
> 
>     mediaQuery.addEventListener('change', handleChange);
>     return () => mediaQuery.removeEventListener('change', handleChange);
>   }, []);
> 
>   const toggleTheme = () => {
>     setIsDarkMode(!isDarkMode);
>     if (isDarkMode) {
>       document.documentElement.classList.remove('dark');
>     } else {
>       document.documentElement.classList.add('dark');
>     }
>   };
> 
>   return (
>     <button
>       onClick={toggleTheme}
>       className="btn btn-ghost btn-circle"
>       aria-label="Toggle theme"
>     >
>       {isDarkMode ? (
>         <svg
>           xmlns="http://www.w3.org/2000/svg"
>           className="h-5 w-5"
>           fill="none"
>           viewBox="0 0 24 24"
>           stroke="currentColor"
>         >
>           <path
>             strokeLinecap="round"
>             strokeLinejoin="round"
>             strokeWidth={2}
>             d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
>           />
>         </svg>
>       ) : (
>         <svg
>           xmlns="http://www.w3.org/2000/svg"
>           className="h-5 w-5"
>           fill="none"
>           viewBox="0 0 24 24"
>           stroke="currentColor"
>         >
>           <path
>             strokeLinecap="round"
>             strokeLinejoin="round"
>             strokeWidth={2}
>             d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
>           />
>         </svg>
>       )}
>     </button>
>   );
> };
> 
> export default ThemeToggle;
> ```
> 
> #### Footer 组件
> 
> ```tsx
> // components/common/Footer.tsx
> import Link from 'next/link';
> 
> const Footer = () => {
>   const currentYear = new Date().getFullYear();
>   
>   return (
>     <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
>       <div className="container mx-auto px-6 py-8">
>         <div className="flex flex-col md:flex-row justify-between items-center">
>           <div className="mb-6 md:mb-0">
>             <Link href="/" className="text-2xl font-bold text-primary">
>               个人博客
>             </Link>
>             <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
>               分享技术和生活的个人空间
>             </p>
>           </div>
>           
>           <div className="flex space-x-6">
>             <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
>               首页
>             </Link>
>             <Link href="/blog" className="text-gray-500 hover:text-primary transition-colors">
>               博客
>             </Link>
>             <Link href="/categories" className="text-gray-500 hover:text-primary transition-colors">
>               分类
>             </Link>
>             <Link href="/tags" className="text-gray-500 hover:text-primary transition-colors">
>               标签
>             </Link>
>             <Link href="/about" className="text-gray-500 hover:text-primary transition-colors">
>               关于
>             </Link>
>           </div>
>         </div>
>         
>         <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
>           <p className="text-sm text-gray-500 dark:text-gray-400">
>             © {currentYear} 个人博客. 保留所有权利.
>           </p>
>           
>           <div className="mt-4 md:mt-0 flex space-x-6">
>             <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
>               <span className="sr-only">GitHub</span>
>               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
>                 <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
>               </svg>
>             </a>
>             <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
>               <span className="sr-only">Twitter</span>
>               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
>                 <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
>               </svg>
>             </a>
>           </div>
>         </div>
>       </div>
>     </footer>
>   );
> };
> 
> export default Footer;
> ```
> 
> #### PostCard 组件
> 
> ```tsx
> // components/posts/PostCard.tsx
> import Link from 'next/link';
> import { formatDistance } from 'date-fns';
> import { zhCN } from 'date-fns/locale';
> 
> interface PostCardProps {
>   post: {
>     id: string;
>     title: string;
>     slug: string;
>     excerpt?: string | null;
>     createdAt: Date;
>     viewCount: number;
>     category?: {
>       name: string;
>       slug: string;
>     } | null;
>     author: {
>       name: string;
>     };
>   };
> }
> 
> const PostCard = ({ post }: PostCardProps) => {
>   return (
>     <div className="card bg-base-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow overflow-hidden backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
>       <div className="card-body">
>         <Link href={`/blog/${post.slug}`}>
>           <h2 className="card-title text-xl md:text-2xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">{post.title}</h2>
>         </Link>
>         
>         <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
>           <span className="mr-3">{post.author.name}</span>
>           <span className="mr-3">•</span>
>           <span>
>             {formatDistance(new Date(post.createdAt), new Date(), { 
>               addSuffix: true,
>               locale: zhCN
>             })}
>           </span>
>           {post.category && (
>             <>
>               <span className="mx-3">•</span>
>               <Link 
>                 href={`/categories/${post.category.slug}`}
>                 className="text-primary hover:underline"
>               >
>                 {post.category.name}
>               </Link>
>             </>
>           )}
>         </div>
>         
>         {post.excerpt && (
>           <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-3">
>             {post.excerpt}
>           </p>
>         )}
>         
>         <div className="card-actions justify-between items-center mt-4">
>           <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
>             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
>               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
>               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
>             </svg>
>             {post.viewCount}
>           </div>
>           
>           <Link href={`/blog/${post.slug}`} className="btn btn-primary btn-sm">
>             阅读更多
>           </Link>
>         </div>
>       </div>
>     </div>
>   );
> };
> 
> export default PostCard;
> ```
> 
> #### PostList 组件
> 
> ```tsx
> // components/posts/PostList.tsx
> import PostCard from './PostCard';
> 
> interface PostListProps {
>   posts: Array<{
>     id: string;
>     title: string;
>     slug: string;
>     excerpt?: string | null;
>     createdAt: Date;
>     viewCount: number;
>     category?: {
>       name: string;
>       slug: string;
>     } | null;
>     author: {
>       name: string;
>     };
>   }>;
> }
> 
> const PostList = ({ posts }: PostListProps) => {
>   if (posts.length === 0) {
>     return (
>       <div className="text-center py-10">
>         <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">没有找到文章</h3>
>       </div>
>     );
>   }
> 
>   return (
>     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
>       {posts.map((post) => (
>         <PostCard key={post.id} post={post} />
>       ))}
>     </div>
>   );
> };
> 
> export default PostList;
> ```
> 
> ### 8. 创建 API Routes
> 
> 让我们创建一些基本的 API 路由：
> 
> #### Posts API
> 
> ```tsx
> // app/api/posts/route.ts
> import { NextRequest, NextResponse } from 'next/server';
> import { prisma } from '@/lib/prisma';
> 
> export async function GET(request: NextRequest) {
>   const { searchParams } = new URL(request.url);
>   const category = searchParams.get('category');
>   const tag = searchParams.get('tag');
>   const search = searchParams.get('search');
>   const featured = searchParams.get('featured') === 'true';
>   const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
>   
>   try {
>     const where: any = {
>       published: true,
>     };
>     
>     if (category) {
>       where.category = {
>         slug: category,
>       };
>     }
>     
>     if (tag) {
>       where.tags = {
>         some: {
>           tag: {
>             slug: tag,
>           },
>         },
>       };
>     }
>     
>     if (search) {
>       where.OR = [
>         { title: { contains: search } },
>         { content: { contains: search } },
>       ];
>     }
>     
>     if (featured) {
>       where.featured = true;
>     }
>     
>     const posts = await prisma.post.findMany({
>       where,
>       take: limit,
>       orderBy: {
>         createdAt: 'desc',
>       },
>       select: {
>         id: true,
>         title: true,
>         slug: true,
>         excerpt: true,
>         createdAt: true,
>         viewCount: true,
>         author: {
>           select: {
>             name: true,
>           },
>         },
>         category: {
>           select: {
>             name: true,
>             slug: true,
>           },
>         },
>         tags: {
>           select: {
>             tag: {
>               select: {
>                 name: true,
>                 slug: true,
>               },
>             },
>           },
>         },
>       },
>     });
>     
>     // 格式化标签数据
>     const formattedPosts = posts.map((post) => ({
>       ...post,
>       tags: post.tags.map((t) => t.tag),
>     }));
>     
>     return NextResponse.json(formattedPosts);
>   } catch (error) {
>     console.error('Error fetching posts:', error);
>     return NextResponse.json(
>       { error: 'Failed to fetch posts' },
>       { status: 500 }
>     );
>   }
> }
> ```
> 
> #### Single Post API
> 
> ```tsx
> // app/api/posts/[slug]/route.ts
> import { NextRequest, NextResponse } from 'next/server';
> import { prisma } from '@/lib/prisma';
> 
> interface Params {
>   params: {
>     slug: string;
>   };
> }
> 
> export async function GET(
>   request: NextRequest,
>   { params }: Params
> ) {
>   const { slug } = params;
>   
>   try {
>     // 查找文章
>     const post = await prisma.post.findUnique({
>       where: { slug },
>       include: {
>         author: {
>           select: {
>             name: true,
>             image: true,
>           },
>         },
>         category: {
>           select: {
>             name: true,
>             slug: true,
>           },
>         },
>         tags: {
>           select: {
>             tag: {
>               select: {
>                 name: true,
>                 slug: true,
>               },
>             },
>           },
>         },
>         comments: {
>           orderBy: {
>             createdAt: 'desc',
>           },
>         },
>       },
>     });
>     
>     if (!post) {
>       return NextResponse.json(
>         { error: 'Post not found' },
>         { status: 404 }
>       );
>     }
>     
>     // 更新访问计数
>     await prisma.post.update({
>       where: { id: post.id },
>       data: { viewCount: { increment: 1 } },
>     });
>     
>     // 格式化标签数据
>     const formattedPost = {
>       ...post,
>       tags: post.tags.map((t) => t.tag),
>     };
>     
>     return NextResponse.json(formattedPost);
>   } catch (error) {
>     console.error('Error fetching post:', error);
>     return NextResponse.json(
>       { error: 'Failed to fetch post' },
>       { status: 500 }
>     );
>   }
> }
> ```
> 
> #### Categories API
> 
> ```tsx
> // app/api/categories/route.ts
> import { NextResponse } from 'next/server';
> import { prisma } from '@/lib/prisma';
> 
> export async function GET() {
>   try {
>     const categories = await prisma.category.findMany({
>       include: {
>         _count: {
>           select: {
>             posts: true,
>           },
>         },
>       },
>     });
>     
>     // 格式化类别数据，添加文章计数
>     const formattedCategories = categories.map((category) => ({
>       id: category.id,
>       name: category.name,
>       slug: category.slug,
>       description: category.description,
>       postCount: category._count.posts,
>     }));
>     
>     return NextResponse.json(formattedCategories);
>   } catch (error) {
>     console.error('Error fetching categories:', error);
>     return NextResponse.json(
>       { error: 'Failed to fetch categories' },
>       { status: 500 }
>     );
>   }
> }
> ```
> 
> #### Tags API
> 
> ```tsx
> // app/api/tags/route.ts
> import { NextResponse } from 'next/server';
> import { prisma } from '@/lib/prisma';
> 
> export async function GET() {
>   try {
>     const tags = await prisma.tag.findMany({
>       include: {
>         _count: {
>           select: {
>             posts: true,
>           },
>         },
>       },
>     });
>     
>     // 格式化标签数据，添加文章计数
>     const formattedTags = tags.map((tag) => ({
>       id: tag.id,
>       name: tag.name,
>       slug: tag.slug,
>       postCount: tag._count.posts,
>     }));
>     
>     return NextResponse.json(formattedTags);
>   } catch (error) {
>     console.error('Error fetching tags:', error);
>     return NextResponse.json(
>       { error: 'Failed to fetch tags' },
>       { status: 500 }
>     );
>   }
> }
> ```
> 
> #### Comments API
> 
> ```tsx
> // app/api/comments/route.ts
> import { NextRequest, NextResponse } from 'next/server';
> import { prisma } from '@/lib/prisma';
> 
> export async function POST(request: NextRequest) {
>   try {
>     const body = await request.json();
>     const { content, authorName, authorEmail, postId } = body;
>     
>     // 验证输入
>     if (!content || !authorName || !authorEmail || !postId) {
>       return NextResponse.json(
>         { error: 'Missing required fields' },
>         { status: 400 }
>       );
>     }
>     
>     // 创建评论
>     const comment = await prisma.comment.create({
>       data: {
>         content,
>         authorName,
>         authorEmail,
>         postId,
>       },
>     });
>     
>     return NextResponse.json(comment, { status: 201 });
>   } catch (error) {
>     console.error('Error creating comment:', error);
>     return NextResponse.json(
>       { error: 'Failed to create comment' },
>       { status: 500 }
>     );
>   }
> }
> ```
> 
> ### 9. 创建页面
> 
> 现在我们来创建主要页面：
> 
> #### 根布局
> 
> ```tsx
> // app/layout.tsx
> import type { Metadata } from 'next';
> import Header from '@/components/common/Header';
> import Footer from '@/components/common/Footer';
> import './globals.css';
> 
> export const metadata: Metadata = {
>   title: '个人博客',
>   description: '分享技术和生活的个人空间',
> };
> 
> export default function RootLayout({
>   children,
> }: {
>   children: React.ReactNode;
> }) {
>   return (
>     <html lang="zh-CN" suppressHydrationWarning>
>       <head>
>         <meta charSet="utf-8" />
>         <meta name="viewport" content="width=device-width, initial-scale=1" />
>         <link href="https://cdn.jsdelivr.net/npm/daisyui@3.5.0/dist/full.css" rel="stylesheet" type="text/css" />
>         <script src="https://cdn.tailwindcss.com"></script>
>         <script dangerouslySetInnerHTML={{
>           __html: `
>             tailwind.config = {
>               darkMode: 'class',
>               theme: {
>                 extend: {
>                   colors: {
>                     primary: '#5D5CDE',
>                   },
>                   animation: {
>                     fadeIn: 'fadeIn 0.5s ease-in-out',
>                   },
>                   keyframes: {
>                     fadeIn: {
>                       '0%': { opacity: '0' },
>                       '100%': { opacity: '1' },
>                     }
>                   }
>                 }
>               }
>             }
>           `
>         }} />
>         <script dangerouslySetInnerHTML={{
>           __html: `
>             // 检查系统主题偏好
>             if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
>               document.documentElement.classList.add('dark');
>             }
>             
>             // 监听系统主题偏好变化
>             window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
>               if (event.matches) {
>                 document.documentElement.classList.add('dark');
>               } else {
>                 document.documentElement.classList.remove('dark');
>               }
>             });
>           `
>         }} />
>       </head>
>       <body className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
>         <Header />
>         <main className="flex-grow pt-16">
>           {children}
>         </main>
>         <Footer />
>       </body>
>     </html>
>   );
> }
> ```
> 
> #### 全局样式
> 
> ```css
> /* app/globals.css */
> @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
> 
> * {
>   margin: 0;
>   padding: 0;
>   box-sizing: border-box;
> }
> 
> body {
>   font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
>     Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
> }
> 
> /* 玻璃拟态效果 */
> .glass-card {
>   backdrop-filter: blur(10px);
>   background: rgba(255, 255, 255, 0.7);
>   border: 1px solid rgba(255, 255, 255, 0.2);
>   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
> }
> 
> .dark .glass-card {
>   background: rgba(24, 24, 24, 0.7);
>   border: 1px solid rgba(255, 255, 255, 0.05);
> }
> 
> /* 文章内容样式 */
> .markdown-content h1 {
>   @apply text-3xl font-bold mt-8 mb-4;
> }
> 
> .markdown-content h2 {
>   @apply text-2xl font-bold mt-6 mb-3;
> }
> 
> .markdown-content h3 {
>   @apply text-xl font-bold mt-5 mb-2;
> }
> 
> .markdown-content p {
>   @apply my-4;
> }
> 
> .markdown-content ul, .markdown-content ol {
>   @apply my-4 ml-6;
> }
> 
> .markdown-content li {
>   @apply mb-2;
> }
> 
> .markdown-content a {
>   @apply text-primary hover:underline;
> }
> 
> .markdown-content blockquote {
>   @apply border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4;
> }
> 
> .markdown-content pre {
>   @apply bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4;
> }
> 
> .markdown-content code {
>   @apply bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded;
> }
> 
> .markdown-content pre code {
>   @apply bg-transparent p-0;
> }
> 
> /* 动画效果 */
> @keyframes fadeIn {
>   from {
>     opacity: 0;
>     transform: translateY(10px);
>   }
>   to {
>     opacity: 1;
>     transform: translateY(0);
>   }
> }
> 
> .animate-fade-in {
>   animation: fadeIn 0.5s ease-out;
> }
> ```
> 
> #### 首页
> 
> ```tsx
> // app/page.tsx
> import Link from 'next/link';
> import { Suspense } from 'react';
> import { prisma } from '@/lib/prisma';
> import PostList from '@/components/posts/PostList';
> 
> async function getFeaturedPosts() {
>   const posts = await prisma.post.findMany({
>     where: {
>       published: true,
>       featured: true,
>     },
>     orderBy: {
>       createdAt: 'desc',
>     },
>     take: 3,
>     select: {
>       id: true,
>       title: true,
>       slug: true,
>       excerpt: true,
>       createdAt: true,
>       viewCount: true,
>       author: {
>         select: {
>           name: true,
>         },
>       },
>       category: {
>         select: {
>           name: true,
>           slug: true,
>         },
>       },
>     },
>   });
>   
>   return posts;
> }
> 
> async function getRecentPosts() {
>   const posts = await prisma.post.findMany({
>     where: {
>       published: true,
>     },
>     orderBy: {
>       createdAt: 'desc',
>     },
>     take: 6,
>     select: {
>       id: true,
>       title: true,
>       slug: true,
>       excerpt: true,
>       createdAt: true,
>       viewCount: true,
>       author: {
>         select: {
>           name: true,
>         },
>       },
>       category: {
>         select: {
>           name: true,
>           slug: true,
>         },
>       },
>     },
>   });
>   
>   return posts;
> }
> 
> async function getCategories() {
>   const categories = await prisma.category.findMany({
>     include: {
>       _count: {
>         select: {
>           posts: true,
>         },
>       },
>     },
>   });
>   
>   return categories.map((category) => ({
>     ...category,
>     postCount: category._count.posts,
>   }));
> }
> 
> function FeaturedPostsSection({ posts }: { posts: Awaited<ReturnType<typeof getFeaturedPosts>> }) {
>   return (
>     <section className="py-10 px-4">
>       <div className="container mx-auto">
>         <h2 className="text-3xl font-bold mb-8">精选文章</h2>
>         <PostList posts={posts} />
>       </div>
>     </section>
>   );
> }
> 
> function RecentPostsSection({ posts }: { posts: Awaited<ReturnType<typeof getRecentPosts>> }) {
>   return (
>     <section className="py-10 px-4 bg-gray-50 dark:bg-gray-800">
>       <div className="container mx-auto">
>         <div className="flex justify-between items-center mb-8">
>           <h2 className="text-3xl font-bold">最新文章</h2>
>           <Link 
>             href="/blog" 
>             className="text-primary hover:underline flex items-center"
>           >
>             查看全部
>             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
>               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
>             </svg>
>           </Link>
>         </div>
>         <PostList posts={posts} />
>       </div>
>     </section>
>   );
> }
> 
> function CategoriesSection({ categories }: { categories: Awaited<ReturnType<typeof getCategories>> }) {
>   return (
>     <section className="py-10 px-4">
>       <div className="container mx-auto">
>         <h2 className="text-3xl font-bold mb-8">分类</h2>
>         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
>           {categories.map((category) => (
>             <Link key={category.id} href={`/categories/${category.slug}`}>
>               <div className="glass-card p-6 rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
>                 <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
>                 {category.description && (
>                   <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
>                 )}
>                 <div className="flex justify-between items-center">
>                   <span className="text-sm text-gray-500 dark:text-gray-400">{category.postCount} 篇文章</span>
>                   <span className="text-primary">浏览 →</span>
>                 </div>
>               </div>
>             </Link>
>           ))}
>         </div>
>       </div>
>     </section>
>   );
> }
> 
> export default async function Home() {
>   return (
>     <div className="animate-fade-in">
>       <section className="py-16 md:py-20 px-4 flex items-center min-h-[50vh] bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
>         <div className="container mx-auto">
>           <div className="max-w-2xl">
>             <h1 className="text-4xl md:text-5xl font-bold mb-6">欢迎来到我的个人博客</h1>
>             <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
>               分享技术和生活的个人空间
>             </p>
>             <div className="flex flex-wrap gap-4">
>               <Link href="/blog" className="btn btn-primary">
>                 浏览文章
>               </Link>
>               <Link href="/about" className="btn btn-outline btn-primary">
>                 关于我
>               </Link>
>             </div>
>           </div>
>         </div>
>       </section>
>       
>       <Suspense fallback={<div className="container mx-auto py-10 px-4">正在加载精选文章...</div>}>
>         {/* @ts-expect-error Async Server Component */}
>         <FeaturedPostsSection posts={await getFeaturedPosts()} />
>       </Suspense>
>       
>       <Suspense fallback={<div className="container mx-auto py-10 px-4 bg-gray-50 dark:bg-gray-800">正在加载最新文章...</div>}>
>         {/* @ts-expect-error Async Server Component */}
>         <RecentPostsSection posts={await getRecentPosts()} />
>       </Suspense>
>       
>       <Suspense fallback={<div className="container mx-auto py-10 px-4">正在加载分类...</div>}>
>         {/* @ts-expect-error Async Server Component */}
>         <CategoriesSection categories={await getCategories()} />
>       </Suspense>
>     </div>
>   );
> }
> ```
> 
> #### 博客列表页
> 
> ```tsx
> // app/blog/page.tsx
> import { prisma } from '@/lib/prisma';
> import PostList from '@/components/posts/PostList';
> import Search from '@/components/common/Search';
> import { Suspense } from 'react';
> 
> // 搜索组件
> import { Metadata } from 'next';
> 
> export const metadata: Metadata = {
>   title: '博客文章 | 个人博客',
>   description: '浏览所有博客文章',
> };
> 
> interface BlogPageProps {
>   searchParams?: {
>     search?: string;
>     category?: string;
>     tag?: string;
>   };
> }
> 
> async function getPosts(search?: string, category?: string, tag?: string) {
>   const where: any = {
>     published: true,
>   };
>   
>   if (search) {
>     where.OR = [
>       { title: { contains: search } },
>       { content: { contains: search } },
>     ];
>   }
>   
>   if (category) {
>     where.category = {
>       slug: category,
>     };
>   }
>   
>   if (tag) {
>     where.tags = {
>       some: {
>         tag: {
>           slug: tag,
>         },
>       },
>     };
>   }
>   
>   const posts = await prisma.post.findMany({
>     where,
>     orderBy: {
>       createdAt: 'desc',
>     },
>     select: {
>       id: true,
>       title: true,
>       slug: true,
>       excerpt: true,
>       createdAt: true,
>       viewCount: true,
>       author: {
>         select: {
>           name: true,
>         },
>       },
>       category: {
>         select: {
>           name: true,
>           slug: true,
>         },
>       },
>     },
>   });
>   
>   return posts;
> }
> 
> function PostsSection({ posts }: { posts: Awaited<ReturnType<typeof getPosts>> }) {
>   if (posts.length === 0) {
>     return (
>       <div className="text-center py-10">
>         <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">没有找到文章</h3>
>         <p className="mt-2">尝试使用不同的搜索词或过滤条件</p>
>       </div>
>     );
>   }
>   
>   return <PostList posts={posts} />;
> }
> 
> export default async function BlogPage({ searchParams }: BlogPageProps) {
>   const { search, category, tag } = searchParams || {};
>   
>   let title = '所有文章';
>   let description;
>   
>   if (search) {
>     title = `搜索: ${search}`;
>     description = `与 "${search}" 相关的文章`;
>   } else if (category) {
>     title = `分类: ${category}`;
>     description = `${category} 分类下的所有文章`;
>   } else if (tag) {
>     title = `标签: ${tag}`;
>     description = `带有 ${tag} 标签的所有文章`;
>   }
>   
>   return (
>     <div className="container mx-auto py-10 px-4">
>       <h1 className="text-3xl font-bold mb-2">{title}</h1>
>       {description && <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>}
>       
>       <Search initialValue={search} />
>       
>       <div className="mt-10">
>         <Suspense fallback={<div>正在加载文章...</div>}>
>           {/* @ts-expect-error Async Server Component */}
>           <PostsSection posts={await getPosts(search, category, tag)} />
>         </Suspense>
>       </div>
>     </div>
>   );
> }
> ```
> 
> #### 文章详情页
> 
> ```tsx
> // app/blog/[slug]/page.tsx
> import { notFound } from 'next/navigation';
> import { prisma } from '@/lib/prisma';
> import { Metadata } from 'next';
> import Link from 'next/link';
> import { formatDistanceToNow } from 'date-fns';
> import { zhCN } from 'date-fns/locale';
> import CommentForm from '@/components/comments/CommentForm';
> import CommentList from '@/components/comments/CommentList';
> import { Suspense } from 'react';
> 
> interface PostPageProps {
>   params: {
>     slug: string;
>   };
> }
> 
> export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
>   const post = await getPost(params.slug);
>   
>   if (!post) {
>     return {
>       title: '文章未找到 | 个人博客',
>     };
>   }
>   
>   return {
>     title: `${post.title} | 个人博客`,
>     description: post.excerpt || undefined,
>   };
> }
> 
> async function getPost(slug: string) {
>   const post = await prisma.post.findUnique({
>     where: { slug },
>     include: {
>       author: {
>         select: {
>           name: true,
>           image: true,
>         },
>       },
>       category: {
>         select: {
>           name: true,
>           slug: true,
>         },
>       },
>       tags: {
>         select: {
>           tag: {
>             select: {
>               name: true,
>               slug: true,
>             },
>           },
>         },
>       },
>       comments: {
>         orderBy: {
>           createdAt: 'desc',
>         },
>       },
>     },
>   });
>   
>   if (!post) {
>     return null;
>   }
>   
>   // 增加浏览次数
>   await prisma.post.update({
>     where: { id: post.id },
>     data: { viewCount: { increment: 1 } },
>   });
>   
>   return {
>     ...post,
>     tags: post.tags.map((tag) => tag.tag),
>   };
> }
> 
> function PostContent({ post }: { post: NonNullable<Awaited<ReturnType<typeof getPost>>> }) {
>   return (
>     <article className="max-w-4xl mx-auto">
>       <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
>       
>       <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
>         <span className="mr-4">
>           {post.author.name}
>         </span>
>         <span className="mr-4">
>           {formatDistanceToNow(new Date(post.createdAt), { 
>             addSuffix: true,
>             locale: zhCN 
>           })}
>         </span>
>         <span className="mr-4 flex items-center">
>           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
>             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
>             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
>           </svg>
>           {post.viewCount}
>         </span>
>         {post.category && (
>           <Link 
>             href={`/categories/${post.category.slug}`}
>             className="badge badge-outline mr-2"
>           >
>             {post.category.name}
>           </Link>
>         )}
>         {post.tags.map((tag) => (
>           <Link 
>             key={tag.id}
>             href={`/tags/${tag.slug}`}
>             className="badge badge-primary badge-outline mr-2"
>           >
>             {tag.name}
>           </Link>
>         ))}
>       </div>
>       
>       <div 
>         className="prose prose-lg max-w-none dark:prose-invert markdown-content"
>         dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
>       />
>     </article>
>   );
> }
> 
> export default async function PostPage({ params }: PostPageProps) {
>   const post = await getPost(params.slug);
>   
>   if (!post) {
>     notFound();
>   }
>   
>   return (
>     <div className="container mx-auto py-10 px-4">
>       <PostContent post={post} />
>       
>       <div className="max-w-4xl mx-auto mt-16">
>         <h2 className="text-2xl font-bold mb-6">评论 ({post.comments.length})</h2>
>         <CommentForm postId={post.id} />
>         
>         <div className="mt-8">
>           <Suspense fallback={<div>加载评论...</div>}>
>             <CommentList comments={post.comments} />
>           </Suspense>
>         </div>
>       </div>
>     </div>
>   );
> }
> ```
> 
> #### 评论组件
> 
> ```tsx
> // components/comments/CommentForm.tsx
> 'use client';
> 
> import { useState, FormEvent } from 'react';
> 
> interface CommentFormProps {
>   postId: string;
> }
> 
> const CommentForm = ({ postId }: CommentFormProps) => {
>   const [name, setName] = useState('');
>   const [email, setEmail] = useState('');
>   const [content, setContent] = useState('');
>   const [isSubmitting, setIsSubmitting] = useState(false);
>   const [error, setError] = useState('');
>   const [success, setSuccess] = useState(false);
>   
>   const handleSubmit = async (e: FormEvent) => {
>     e.preventDefault();
>     
>     if (!name.trim() || !email.trim() || !content.trim()) {
>       setError('所有字段都是必填的');
>       return;
>     }
>     
>     // 简单的电子邮件验证
>     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
>     if (!emailRegex.test(email)) {
>       setError('请输入有效的电子邮件地址');
>       return;
>     }
>     
>     setIsSubmitting(true);
>     setError('');
>     
>     try {
>       const response = await fetch('/api/comments', {
>         method: 'POST',
>         headers: {
>           'Content-Type': 'application/json',
>         },
>         body: JSON.stringify({
>           content,
>           authorName: name,
>           authorEmail: email,
>           postId,
>         }),
>       });
>       
>       if (!response.ok) {
>         const data = await response.json();
>         throw new Error(data.error || '提交评论时出错');
>       }
>       
>       setSuccess(true);
>       setName('');
>       setEmail('');
>       setContent('');
>       
>       // 3秒后重置成功消息
>       setTimeout(() => {
>         setSuccess(false);
>       }, 3000);
>     } catch (err) {
>       if (err instanceof Error) {
>         setError(err.message);
>       } else {
>         setError('提交评论时出错');
>       }
>     } finally {
>       setIsSubmitting(false);
>     }
>   };
>   
>   return (
>     <div className="glass-card p-6 rounded-lg">
>       <h3 className="text-xl font-semibold mb-4">发表评论</h3>
>       
>       {error && (
>         <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
>           {error}
>         </div>
>       )}
>       
>       {success && (
>         <div className="bg-green-100 dark:bg-green-900/50 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
>           评论已成功提交！
>         </div>
>       )}
>       
>       <form onSubmit={handleSubmit}>
>         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
>           <div>
>             <label htmlFor="name" className="block text-sm font-medium mb-1">
>               姓名 <span className="text-red-500">*</span>
>             </label>
>             <input
>               type="text"
>               id="name"
>               value={name}
>               onChange={(e) => setName(e.target.value)}
>               className="input input-bordered w-full"
>               required
>             />
>           </div>
>           
>           <div>
>             <label htmlFor="email" className="block text-sm font-medium mb-1">
>               电子邮件 <span className="text-red-500">*</span>
>             </label>
>             <input
>               type="email"
>               id="email"
>               value={email}
>               onChange={(e) => setEmail(e.target.value)}
>               className="input input-bordered w-full"
>               required
>             />
>           </div>
>         </div>
>         
>         <div className="mb-4">
>           <label htmlFor="content" className="block text-sm font-medium mb-1">
>             评论 <span className="text-red-500">*</span>
>           </label>
>           <textarea
>             id="content"
>             value={content}
>             onChange={(e) => setContent(e.target.value)}
>             className="textarea textarea-bordered w-full"
>             rows={4}
>             required
>           ></textarea>
>         </div>
>         
>         <button
>           type="submit"
>           disabled={isSubmitting}
>           className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
>         >
>           {isSubmitting ? '提交中...' : '提交评论'}
>         </button>
>       </form>
>     </div>
>   );
> };
> 
> export default CommentForm;
> ```
> 
> ```tsx
> // components/comments/CommentList.tsx
> import { formatDistanceToNow } from 'date-fns';
> import { zhCN } from 'date-fns/locale';
> 
> interface Comment {
>   id: string;
>   content: string;
>   authorName: string;
>   createdAt: Date;
> }
> 
> interface CommentListProps {
>   comments: Comment[];
> }
> 
> const CommentList = ({ comments }: CommentListProps) => {
>   if (comments.length === 0) {
>     return (
>       <div className="text-center py-6 text-gray-500 dark:text-gray-400">
>         还没有评论。成为第一个发表评论的人！
>       </div>
>     );
>   }
>   
>   return (
>     <div className="space-y-6">
>       {comments.map((comment) => (
>         <div key={comment.id} className="glass-card p-4 rounded-lg">
>           <div className="flex justify-between items-center mb-2">
>             <div className="font-medium">{comment.authorName}</div>
>             <div className="text-sm text-gray-500 dark:text-gray-400">
>               {formatDistanceToNow(new Date(comment.createdAt), { 
>                 addSuffix: true,
>                 locale: zhCN
>               })}
>             </div>
>           </div>
>           <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
>         </div>
>       ))}
>     </div>
>   );
> };
> 
> export default CommentList;
> ```
> 
> #### 分类页面
> 
> ```tsx
> // app/categories/page.tsx
> import { prisma } from '@/lib/prisma';
> import Link from 'next/link';
> import { Metadata } from 'next';
> 
> export const metadata: Metadata = {
>   title: '文章分类 | 个人博客',
>   description: '浏览所有文章分类',
> };
> 
> async function getCategories() {
>   const categories = await prisma.category.findMany({
>     include: {
>       _count: {
>         select: {
>           posts: {
>             where: {
>               published: true,
>             },
>           },
>         },
>       },
>     },
>   });
>   
>   return categories.map((category) => ({
>     ...category,
>     postCount: category._count.posts,
>   }));
> }
> 
> export default async function CategoriesPage() {
>   const categories = await getCategories();
>   
>   return (
>     <div className="container mx-auto py-10 px-4">
>       <h1 className="text-3xl font-bold mb-10">文章分类</h1>
>       
>       {categories.length === 0 ? (
>         <div className="text-center py-10">
>           <p className="text-gray-600 dark:text-gray-400">暂无分类</p>
>         </div>
>       ) : (
>         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
>           {categories.map((category) => (
>             <Link key={category.id} href={`/categories/${category.slug}`}>
>               <div className="glass-card p-6 rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
>                 <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
>                 {category.description && (
>                   <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
>                 )}
>                 <div className="flex justify-between items-center">
>                   <span className="text-sm text-gray-500 dark:text-gray-400">{category.postCount} 篇文章</span>
>                   <span className="text-primary">浏览 →</span>
>                 </div>
>               </div>
>             </Link>
>           ))}
>         </div>
>       )}
>     </div>
>   );
> }
> ```
> 
> #### 单个分类页面
> 
> ```tsx
> // app/categories/[slug]/page.tsx
> import { notFound } from 'next/navigation';
> import { prisma } from '@/lib/prisma';
> import { Metadata } from 'next';
> import PostList from '@/components/posts/PostList';
> 
> interface CategoryPageProps {
>   params: {
>     slug: string;
>   };
> }
> 
> export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
>   const category = await getCategory(params.slug);
>   
>   if (!category) {
>     return {
>       title: '分类未找到 | 个人博客',
>     };
>   }
>   
>   return {
>     title: `${category.name} | 分类 | 个人博客`,
>     description: category.description || `浏览 ${category.name} 分类下的所有文章`,
>   };
> }
> 
> async function getCategory(slug: string) {
>   const category = await prisma.category.findUnique({
>     where: { slug },
>   });
>   
>   return category;
> }
> 
> async function getCategoryPosts(slug: string) {
>   const posts = await prisma.post.findMany({
>     where: {
>       published: true,
>       category: {
>         slug,
>       },
>     },
>     orderBy: {
>       createdAt: 'desc',
>     },
>     select: {
>       id: true,
>       title: true,
>       slug: true,
>       excerpt: true,
>       createdAt: true,
>       viewCount: true,
>       author: {
>         select: {
>           name: true,
>         },
>       },
>       category: {
>         select: {
>           name: true,
>           slug: true,
>         },
>       },
>     },
>   });
>   
>   return posts;
> }
> 
> export default async function CategoryPage({ params }: CategoryPageProps) {
>   const category = await getCategory(params.slug);
>   
>   if (!category) {
>     notFound();
>   }
>   
>   const posts = await getCategoryPosts(params.slug);
>   
>   return (
>     <div className="container mx-auto py-10 px-4">
>       <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
>       {category.description && (
>         <p className="text-gray-600 dark:text-gray-400 mb-6">{category.description}</p>
>       )}
>       
>       <div className="mt-10">
>         <PostList posts={posts} />
>       </div>
>     </div>
>   );
> }
> ```
> 
> #### 标签页面
> 
> ```tsx
> // app/tags/page.tsx
> import { prisma } from '@/lib/prisma';
> import Link from 'next/link';
> import { Metadata } from 'next';
> 
> export const metadata: Metadata = {
>   title: '文章标签 | 个人博客',
>   description: '浏览所有文章标签',
> };
> 
> async function getTags() {
>   const tags = await prisma.tag.findMany({
>     include: {
>       _count: {
>         select: {
>           posts: {
>             where: {
>               post: {
>                 published: true,
>               },
>             },
>           },
>         },
>       },
>     },
>   });
>   
>   return tags.map((tag) => ({
>     ...tag,
>     postCount: tag._count.posts,
>   }));
> }
> 
> export default async function TagsPage() {
>   const tags = await getTags();
>   
>   // 根据文章数量对标签进行排序
>   const sortedTags = [...tags].sort((a, b) => b.postCount - a.postCount);
>   
>   return (
>     <div className="container mx-auto py-10 px-4">
>       <h1 className="text-3xl font-bold mb-10">文章标签</h1>
>       
>       {sortedTags.length === 0 ? (
>         <div className="text-center py-10">
>           <p className="text-gray-600 dark:text-gray-400">暂无标签</p>
>         </div>
>       ) : (
>         <div className="glass-card p-8 rounded-lg">
>           <div className="flex flex-wrap gap-3">
>             {sortedTags.map((tag) => (
>               <Link 
>                 key={tag.id}
>                 href={`/tags/${tag.slug}`}
>                 className="badge badge-lg badge-primary badge-outline p-4 hover:bg-primary hover:text-white transition-colors"
>               >
>                 {tag.name} ({tag.postCount})
>               </Link>
>             ))}
>           </div>
>         </div>
>       )}
>     </div>
>   );
> }
> ```
> 
> #### 单个标签页面
> 
> ```tsx
> // app/tags/[slug]/page.tsx
> import { notFound } from 'next/navigation';
> import { prisma } from '@/lib/prisma';
> import { Metadata } from 'next';
> import PostList from '@/components/posts/PostList';
> 
> interface TagPageProps {
>   params: {
>     slug: string;
>   };
> }
> 
> export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
>   const tag = await getTag(params.slug);
>   
>   if (!tag) {
>     return {
>       title: '标签未找到 | 个人博客',
>     };
>   }
>   
>   return {
>     title: `${tag.name} | 标签 | 个人博客`,
>     description: `浏览所有带有 ${tag.name} 标签的文章`,
>   };
> }
> 
> async function getTag(slug: string) {
>   const tag = await prisma.tag.findUnique({
>     where: { slug },
>   });
>   
>   return tag;
> }
> 
> async function getTagPosts(slug: string) {
>   const posts = await prisma.post.findMany({
>     where: {
>       published: true,
>       tags: {
>         some: {
>           tag: {
>             slug,
>           },
>         },
>       },
>     },
>     orderBy: {
>       createdAt: 'desc',
>     },
>     select: {
>       id: true,
>       title: true,
>       slug: true,
>       excerpt: true,
>       createdAt: true,
>       viewCount: true,
>       author: {
>         select: {
>           name: true,
>         },
>       },
>       category: {
>         select: {
>           name: true,
>           slug: true,
>         },
>       },
>     },
>   });
>   
>   return posts;
> }
> 
> export default async function TagPage({ params }: TagPageProps) {
>   const tag = await getTag(params.slug);
>   
>   if (!tag) {
>     notFound();
>   }
>   
>   const posts = await getTagPosts(params.slug);
>   
>   return (
>     <div className="container mx-auto py-10 px-4">
>       <h1 className="text-3xl font-bold mb-6">
>         标签: {tag.name} ({posts.length}篇文章)
>       </h1>
>       
>       <div className="mt-6">
>         <PostList posts={posts} />
>       </div>
>     </div>
>   );
> }
> ```
> 
> #### 关于页面
> 
> ```tsx
> // app/about/page.tsx
> import { Metadata } from 'next';
> 
> export const metadata: Metadata = {
>   title: '关于 | 个人博客',
>   description: '了解博客作者的更多信息',
> };
> 
> export default function AboutPage() {
>   return (
>     <div className="container mx-auto py-10 px-4">
>       <div className="max-w-3xl mx-auto">
>         <h1 className="text-3xl font-bold mb-6">关于我</h1>
>         
>         <div className="glass-card p-8 rounded-lg mb-10">
>           <p className="text-lg mb-4">
>             你好! 我是这个博客的作者，一名热爱技术和分享的开发者。
>           </p>
>           <p className="text-lg mb-4">
>             我创建这个博客的目的是分享我在技术学习过程中的心得体会，以及生活中的所思所想。希望我的文章能够对你有所帮助或启发。
>           </p>
>           <p className="text-lg">
>             欢迎在文章下方留言，或通过下面的联系方式与我交流!
>           </p>
>         </div>
>         
>         <h2 className="text-2xl font-bold mb-4">技能</h2>
>         <div className="glass-card p-6 rounded-lg mb-10">
>           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
>             <div>
>               <h3 className="font-semibold mb-2">前端开发</h3>
>               <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
>                 <li>React / Next.js</li>
>                 <li>TypeScript</li>
>                 <li>Tailwind CSS</li>
>                 <li>HTML5 / CSS3</li>
>               </ul>
>             </div>
>             <div>
>               <h3 className="font-semibold mb-2">后端开发</h3>
>               <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
>                 <li>Node.js</li>
>                 <li>Prisma ORM</li>
>                 <li>SQL / NoSQL 数据库</li>
>                 <li>RESTful API 设计</li>
>               </ul>
>             </div>
>           </div>
>         </div>
>         
>         <h2 className="text-2xl font-bold mb-4">联系方式</h2>
>         <div className="glass-card p-6 rounded-lg">
>           <div className="flex flex-col space-y-3">
>             <div className="flex items-center">
>               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
>                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
>               </svg>
>               <span>example@example.com</span>
>             </div>
>             <div className="flex items-center">
>               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
>                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
>               </svg>
>               <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
>                 GitHub
>               </a>
>             </div>
>             <div className="flex items-center">
>               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
>                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
>               </svg>
>               <span>微信: example</span>
>             </div>
>           </div>
>         </div>
>       </div>
>     </div>
>   );
> }
> ```
> 
> #### 搜索组件
> 
> ```tsx
> // components/common/Search.tsx
> 'use client';
> 
> import { useState, FormEvent } from 'react';
> import { useRouter } from 'next/navigation';
> 
> interface SearchProps {
>   initialValue?: string;
> }
> 
> const Search = ({ initialValue = '' }: SearchProps) => {
>   const [searchTerm, setSearchTerm] = useState(initialValue);
>   const router = useRouter();
>   
>   const handleSubmit = (e: FormEvent) => {
>     e.preventDefault();
>     if (searchTerm.trim()) {
>       router.push(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
>     } else {
>       router.push('/blog');
>     }
>   };
>   
>   return (
>     <form onSubmit={handleSubmit} className="max-w-xl">
>       <div className="relative">
>         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
>           <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
>             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
>           </svg>
>         </div>
>         <input
>           type="search"
>           value={searchTerm}
>           onChange={(e) => setSearchTerm(e.target.value)}
>           className="input input-bordered w-full pl-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
>           placeholder="搜索文章..."
>         />
>         <button type="submit" className="absolute right-2.5 bottom-2.5 btn btn-primary btn-sm">
>           搜索
>         </button>
>       </div>
>     </form>
>   );
> };
> 
> export default Search;
> ```
> 
> ### 10. 创建配置文件
> 
> #### Next.js 配置
> 
> ```js
> // next.config.js
> /** @type {import('next').NextConfig} */
> const nextConfig = {
>   experimental: {
>     serverActions: true,
>   },
>   images: {
>     remotePatterns: [
>       {
>         protocol: 'https',
>         hostname: 'images.unsplash.com',
>       },
>     ],
>   },
> };
> 
> module.exports = nextConfig;
> ```
> 
> #### TypeScript 配置
> 
> ```json
> // tsconfig.json
> {
>   "compilerOptions": {
>     "target": "es5",
>     "lib": ["dom", "dom.iterable", "esnext"],
>     "allowJs": true,
>     "skipLibCheck": true,
>     "strict": true,
>     "forceConsistentCasingInFileNames": true,
>     "noEmit": true,
>     "esModuleInterop": true,
>     "module": "esnext",
>     "moduleResolution": "node",
>     "resolveJsonModule": true,
>     "isolatedModules": true,
>     "jsx": "preserve",
>     "incremental": true,
>     "plugins": [
>       {
>         "name": "next"
>       }
>     ],
>     "paths": {
>       "@/*": ["./*"]
>     }
>   },
>   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
>   "exclude": ["node_modules"]
> }
> ```
> 
> #### PostCSS 配置
> 
> ```js
> // postcss.config.js
> module.exports = {
>   plugins: {
>     tailwindcss: {},
>     autoprefixer: {},
>   },
> }
> ```
> 
> #### Package.json
> 
> ```json
> // package.json
> {
>   "name": "personal-blog",
>   "version": "0.1.0",
>   "private": true,
>   "scripts": {
>     "dev": "next dev",
>     "build": "next build",
>     "start": "next start",
>     "lint": "next lint",
>     "prisma:generate": "prisma generate",
>     "prisma:migrate": "prisma migrate dev",
>     "prisma:seed": "ts-node prisma/seed.ts"
>   },
>   "dependencies": {
>     "@prisma/client": "^5.0.0",
>     "bcrypt": "^5.1.0",
>     "date-fns": "^2.30.0",
>     "next": "13.4.12",
>     "react": "18.2.0",
>     "react-dom": "18.2.0"
>   },
>   "devDependencies": {
>     "@types/bcrypt": "^5.0.0",
>     "@types/node": "20.4.5",
>     "@types/react": "18.2.16",
>     "@types/react-dom": "18.2.7",
>     "autoprefixer": "10.4.14",
>     "eslint": "8.45.0",
>     "eslint-config-next": "13.4.12",
>     "postcss": "8.4.27",
>     "prisma": "^5.0.0",
>     "ts-node": "^10.9.1",
>     "typescript": "5.1.6"
>   }
> }
> ```
> 
> #### README.md
> 
> ```markdown
> # 个人博客
> 
> 一个使用 Next.js 13 构建的现代化个人博客应用，支持文章管理、分类、标签、评论等功能，并同时支持亮色和暗色主题模式。
> 
> ## 特性
> 
> - 🚀 使用 Next.js 13 App Router
> - 💻 基于 React 和 TypeScript 的前端开发
> - 🎨 使用 TailwindCSS 和 DaisyUI 构建响应式设计
> - 📊 Prisma ORM 和 SQLite 数据库
> - 🌓 支持暗色和亮色主题模式
> - 📱 完全响应式设计，适应各种设备
> - 🔍 文章搜索功能
> - 💬 评论系统
> - 📝 Markdown 文章内容
> - 📂 分类和标签管理
> 
> ## 技术栈
> 
> - **前端**：Next.js 13, React 18, TypeScript
> - **样式**：TailwindCSS, DaisyUI
> - **后端**：Next.js API Routes
> - **数据库**：Prisma ORM, SQLite
> - **其他工具**：date-fns
> 
> ## 快速开始
> 
> ### 前提条件
> 
> - Node.js 16.8 或更高版本
> - npm 或 yarn 包管理器
> 
> ### 安装步骤
> 
> 1. 克隆仓库
> 
> ```bash
> git clone https://github.com/yourusername/personal-blog.git
> cd personal-blog
> ```
> 
> 2. 安装依赖
> 
> ```bash
> npm install
> # 或
> yarn install
> ```
> 
> 3. 设置数据库
> 
> ```bash
> # 生成 Prisma 客户端
> npm run prisma:generate
> # 或
> yarn prisma:generate
> 
> # 运行迁移
> npm run prisma:migrate
> # 或
> yarn prisma:migrate
> 
> # 填充示例数据
> npm run prisma:seed
> # 或
> yarn prisma:seed
> ```
> 
> 4. 启动开发服务器
> 
> ```bash
> npm run dev
> # 或
> yarn dev
> ```
> 
> 5. 打开浏览器访问 `http://localhost:3000`
> 
> ### 构建生产版本
> 
> ```bash
> npm run build
> # 或
> yarn build
> ```
> 
> ### 启动生产服务器
> 
> ```bash
> npm run start
> # 或
> yarn start
> ```
> 
> ## 项目结构
> 
> ```
> personal-blog/
> ├── app/                 # Next.js 应用目录
> │   ├── (admin)/         # 管理区域 (受保护路由)
> │   ├── about/           # 关于页面
> │   ├── api/             # API 路由
> │   ├── blog/            # 博客文章页面
> │   ├── categories/      # 分类页面
> │   ├── tags/            # 标签页面
> │   ├── layout.tsx       # 根布局组件
> │   ├── page.tsx         # 首页组件
> │   └── globals.css      # 全局样式
> ├── components/          # React 组件
> │   ├── common/          # 通用组件
> │   ├── posts/           # 文章相关组件
> │   └── comments/        # 评论相关组件
> ├── lib/                 # 工具库和服务
> │   └── prisma.ts        # Prisma 客户端
> ├── prisma/              # Prisma 配置和迁移
> │   ├── schema.prisma    # 数据库 schema
> │   ├── migrations/      # 数据库迁移
> │   └── seed.ts          # 种子数据脚本
> ├── public/              # 静态资源
> ├── next.config.js       # Next.js 配置
> ├── postcss.config.js    # PostCSS 配置
> ├── tailwind.config.js   # Tailwind 配置
> ├── tsconfig.json        # TypeScript 配置
> └── package.json         # 项目依赖和脚本
> ```
> 
> ## 管理员登录
> 
> 默认的管理员账户:
> 
> - 电子邮件: admin@example.com
> - 密码: admin123
> 
> ## 贡献
> 
> 欢迎提交 Pull Requests 和 Issues。
> 
> ## 许可
> 
> MIT
> ```
> 
> 现在，我们已经完成了基本项目的所有必需组件和配置文件。这个个人博客应用已经实现了以下功能：
> 
> 1. 博客文章的展示和浏览
> 2. 文章分类和标签管理
> 3. 评论系统
> 4. 搜索功能
> 5. 响应式设计，适应不同设备
> 6. 暗色/亮色主题模式切换
> 
> 这个项目展示了如何使用 Next.js 13 的 App Router、React、TypeScript、TailwindCSS、DaisyUI 和 Prisma ORM 创建一个全功能的个人博客系统。当然，这个项目还可以进一步扩展，例如添加管理后台、用户认证、更多的交互功能等。
> 
> 让我开始输出所有的文件内容，按照指定的格式。

我将为您创建一个使用Next.js+React+TypeScript+TailwindCSS+daisyUI+Prisma+SQLite的个人博客系统。我会按照您的要求设计后端和前端代码，确保代码可以直接运行，并提供完整的配置文件。让我们开始吧！

```generateInfo id=blog_system
{
"projectName":"next-personal-blog"
}
```

```{fileName:"prisma/schema.prisma",filePath:"prisma/schema.prisma"}
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String
  image         String?
  role          String    @default("USER") // 注意：SQLite不支持枚举，使用String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  posts         Post[]
}

model Post {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  content       String
  excerpt       String?
  featured      Boolean   @default(false)
  published     Boolean   @default(false)
  viewCount     Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  author        User      @relation(fields: [authorId], references: [id])
  authorId      String
  category      Category? @relation(fields: [categoryId], references: [id])
  categoryId    String?
  tags          TagsOnPosts[]
  comments      Comment[]
}

model Category {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  description   String?
  posts         Post[]
}

model Tag {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  posts         TagsOnPosts[]
}

model TagsOnPosts {
  post          Post      @relation(fields: [postId], references: [id])
  postId        String
  tag           Tag       @relation(fields: [tagId], references: [id])
  tagId         String

  @@id([postId, tagId])
}

model Comment {
  id            String    @id @default(cuid())
  content       String
  authorName    String
  authorEmail   String
  createdAt     DateTime  @default(now())
  post          Post      @relation(fields: [postId], references: [id])
  postId        String
}
```

```{fileName:"lib/prisma.ts",filePath:"lib/prisma.ts"}
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

```{fileName:"prisma/seed.ts",filePath:"prisma/seed.ts"}
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 创建管理员用户
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // 创建分类
  const technology = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: '技术',
      slug: 'technology',
      description: '技术相关文章',
    },
  });

  const lifestyle = await prisma.category.upsert({
    where: { slug: 'lifestyle' },
    update: {},
    create: {
      name: '生活方式',
      slug: 'lifestyle',
      description: '生活方式相关文章',
    },
  });

  // 创建标签
  const tagReact = await prisma.tag.upsert({
    where: { slug: 'react' },
    update: {},
    create: {
      name: 'React',
      slug: 'react',
    },
  });

  const tagNextjs = await prisma.tag.upsert({
    where: { slug: 'nextjs' },
    update: {},
    create: {
      name: 'Next.js',
      slug: 'nextjs',
    },
  });

  const tagLifestyle = await prisma.tag.upsert({
    where: { slug: 'lifestyle' },
    update: {},
    create: {
      name: '生活方式',
      slug: 'lifestyle',
    },
  });

  // 创建文章
  const post1 = await prisma.post.create({
    data: {
      title: '开始使用 Next.js 13',
      slug: 'getting-started-with-nextjs-13',
      content: `
# 开始使用 Next.js 13

Next.js 13 引入了许多令人兴奋的新特性，包括新的 App Router、React Server Components 等。

## App Router

App Router 是 Next.js 13 中最令人兴奋的新特性之一。它允许你使用文件系统路由来组织你的应用。

## React Server Components

React Server Components 允许你在服务器上渲染 React 组件，从而提高性能和用户体验。

## 结论

Next.js 13 带来了许多改进，使构建现代 Web 应用程序变得更加容易和高效。
      `,
      excerpt: 'Next.js 13 引入了许多令人兴奋的新特性，包括新的 App Router、React Server Components 等。',
      published: true,
      featured: true,
      authorId: admin.id,
      categoryId: technology.id,
    },
  });

  // 为文章添加标签
  await prisma.tagsOnPosts.create({
    data: {
      postId: post1.id,
      tagId: tagReact.id,
    },
  });

  await prisma.tagsOnPosts.create({
    data: {
      postId: post1.id,
      tagId: tagNextjs.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: '如何保持工作与生活的平衡',
      slug: 'how-to-maintain-work-life-balance',
      content: `
# 如何保持工作与生活的平衡

在当今快节奏的世界中，保持工作与生活的平衡变得越来越具有挑战性。本文将分享一些技巧，帮助你在忙碌的工作生活中找到平衡。

## 设定清晰的边界

设定工作时间和个人时间的清晰边界是保持平衡的关键。尽量避免在非工作时间处理工作事务。

## 优先考虑自我照顾

确保你有足够的时间进行自我照顾，包括锻炼、健康饮食和足够的休息。

## 学会说不

学会对不必要的承诺说不，这样你就可以专注于对你真正重要的事情。

## 结论

保持工作与生活的平衡需要有意识的努力，但这对于你的整体健康和幸福至关重要。
      `,
      excerpt: '在当今快节奏的世界中，保持工作与生活的平衡变得越来越具有挑战性。本文将分享一些技巧，帮助你在忙碌的工作生活中找到平衡。',
      published: true,
      authorId: admin.id,
      categoryId: lifestyle.id,
    },
  });

  await prisma.tagsOnPosts.create({
    data: {
      postId: post2.id,
      tagId: tagLifestyle.id,
    },
  });

  // 添加评论
  await prisma.comment.create({
    data: {
      content: '非常有用的文章，谢谢分享！',
      authorName: '张三',
      authorEmail: 'zhangsan@example.com',
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '很期待 Next.js 13 的更多功能',
      authorName: '李四',
      authorEmail: 'lisi@example.com',
      postId: post1.id,
    },
  });

  console.log('数据库初始化完成');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

```{fileName:"app/globals.css",filePath:"app/globals.css"}
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 玻璃拟态效果 */
.glass-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dark .glass-card {
  background: rgba(24, 24, 24, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 文章内容样式 */
.markdown-content h1 {
  @apply text-3xl font-bold mt-8 mb-4;
}

.markdown-content h2 {
  @apply text-2xl font-bold mt-6 mb-3;
}

.markdown-content h3 {
  @apply text-xl font-bold mt-5 mb-2;
}

.markdown-content p {
  @apply my-4;
}

.markdown-content ul, .markdown-content ol {
  @apply my-4 ml-6;
}

.markdown-content li {
  @apply mb-2;
}

.markdown-content a {
  @apply text-primary hover:underline;
}

.markdown-content blockquote {
  @apply border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4;
}

.markdown-content pre {
  @apply bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4;
}

.markdown-content code {
  @apply bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded;
}

.markdown-content pre code {
  @apply bg-transparent p-0;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

```{fileName:"app/layout.tsx",filePath:"app/layout.tsx"}
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: '个人博客',
  description: '分享技术和生活的个人空间',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/daisyui@3.5.0/dist/full.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    primary: '#5D5CDE',
                  },
                  animation: {
                    fadeIn: 'fadeIn 0.5s ease-in-out',
                  },
                  keyframes: {
                    fadeIn: {
                      '0%': { opacity: '0' },
                      '100%': { opacity: '1' },
                    }
                  }
                }
              }
            }
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            // 检查系统主题偏好
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark');
            }
            
            // 监听系统主题偏好变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
              if (event.matches) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            });
          `
        }} />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

```{fileName:"app/page.tsx",filePath:"app/page.tsx"}
import Link from 'next/link';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import PostList from '@/components/posts/PostList';

async function getFeaturedPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      featured: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
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

async function getRecentPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
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

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });
  
  return categories.map((category) => ({
    ...category,
    postCount: category._count.posts,
  }));
}

function FeaturedPostsSection({ posts }: { posts: Awaited<ReturnType<typeof getFeaturedPosts>> }) {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">精选文章</h2>
        <PostList posts={posts} />
      </div>
    </section>
  );
}

function RecentPostsSection({ posts }: { posts: Awaited<ReturnType<typeof getRecentPosts>> }) {
  return (
    <section className="py-10 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">最新文章</h2>
          <Link 
            href="/blog" 
            className="text-primary hover:underline flex items-center"
          >
            查看全部
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
        <PostList posts={posts} />
      </div>
    </section>
  );
}

function CategoriesSection({ categories }: { categories: Awaited<ReturnType<typeof getCategories>> }) {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">分类</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <div className="glass-card p-6 rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
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
      </div>
    </section>
  );
}

export default async function Home() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 md:py-20 px-4 flex items-center min-h-[50vh] bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">欢迎来到我的个人博客</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              分享技术和生活的个人空间
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/blog" className="btn btn-primary">
                浏览文章
              </Link>
              <Link href="/about" className="btn btn-outline btn-primary">
                关于我
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Suspense fallback={<div className="container mx-auto py-10 px-4">正在加载精选文章...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <FeaturedPostsSection posts={await getFeaturedPosts()} />
      </Suspense>
      
      <Suspense fallback={<div className="container mx-auto py-10 px-4 bg-gray-50 dark:bg-gray-800">正在加载最新文章...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <RecentPostsSection posts={await getRecentPosts()} />
      </Suspense>
      
      <Suspense fallback={<div className="container mx-auto py-10 px-4">正在加载分类...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <CategoriesSection categories={await getCategories()} />
      </Suspense>
    </div>
  );
}
```

```{fileName:"components/common/Header.tsx",filePath:"components/common/Header.tsx"}
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <header className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            个人博客
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/" className={`hover:text-primary transition-colors ${pathname === '/' ? 'text-primary font-medium' : ''}`}>
              首页
            </Link>
            <Link href="/blog" className={`hover:text-primary transition-colors ${pathname === '/blog' || pathname.startsWith('/blog/') ? 'text-primary font-medium' : ''}`}>
              博客
            </Link>
            <Link href="/categories" className={`hover:text-primary transition-colors ${pathname === '/categories' || pathname.startsWith('/categories/') ? 'text-primary font-medium' : ''}`}>
              分类
            </Link>
            <Link href="/tags" className={`hover:text-primary transition-colors ${pathname === '/tags' || pathname.startsWith('/tags/') ? 'text-primary font-medium' : ''}`}>
              标签
            </Link>
            <Link href="/about" className={`hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary font-medium' : ''}`}>
              关于
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <button 
              onClick={toggleMenu}
              className="md:hidden text-gray-500 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <Link href="/" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                首页
              </Link>
              <Link href="/blog" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/blog' || pathname.startsWith('/blog/') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                博客
              </Link>
              <Link href="/categories" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/categories' || pathname.startsWith('/categories/') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                分类
              </Link>
              <Link href="/tags" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/tags' || pathname.startsWith('/tags/') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                标签
              </Link>
              <Link href="/about" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/about' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''}`}>
                关于
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
```

```{fileName:"components/common/ThemeToggle.tsx",filePath:"components/common/ThemeToggle.tsx"}
'use client';

import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 初始化时检查系统主题偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // 监听系统主题偏好变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
```

```{fileName:"components/common/Footer.tsx",filePath:"components/common/Footer.tsx"}
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              个人博客
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              分享技术和生活的个人空间
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
              首页
            </Link>
            <Link href="/blog" className="text-gray-500 hover:text-primary transition-colors">
              博客
            </Link>
            <Link href="/categories" className="text-gray-500 hover:text-primary transition-colors">
              分类
            </Link>
            <Link href="/tags" className="text-gray-500 hover:text-primary transition-colors">
              标签
            </Link>
            <Link href="/about" className="text-gray-500 hover:text-primary transition-colors">
              关于
            </Link>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} 个人博客. 保留所有权利.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

```{fileName:"components/posts/PostCard.tsx",filePath:"components/posts/PostCard.tsx"}
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
```

```{fileName:"components/posts/PostList.tsx",filePath:"components/posts/PostList.tsx"}
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
```

```{fileName:"components/comments/CommentForm.tsx",filePath:"components/comments/CommentForm.tsx"}
'use client';

import { useState, FormEvent } from 'react';

interface CommentFormProps {
  postId: string;
}

const CommentForm = ({ postId }: CommentFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !content.trim()) {
      setError('所有字段都是必填的');
      return;
    }
    
    // 简单的电子邮件验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的电子邮件地址');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          authorName: name,
          authorEmail: email,
          postId,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '提交评论时出错');
      }
      
      setSuccess(true);
      setName('');
      setEmail('');
      setContent('');
      
      // 3秒后重置成功消息
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('提交评论时出错');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">发表评论</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 dark:bg-green-900/50 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
          评论已成功提交！
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              电子邮件 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            评论 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={4}
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
        >
          {isSubmitting ? '提交中...' : '提交评论'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
```

```{fileName:"components/comments/CommentList.tsx",filePath:"components/comments/CommentList.tsx"}
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
```

```{fileName:"components/common/Search.tsx",filePath:"components/common/Search.tsx"}
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchProps {
  initialValue?: string;
}

const Search = ({ initialValue = '' }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/blog');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full pl-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
          placeholder="搜索文章..."
        />
        <button type="submit" className="absolute right-2.5 bottom-2.5 btn btn-primary btn-sm">
          搜索
        </button>
      </div>
    </form>
  );
};

export default Search;
```

```{fileName:"app/blog/page.tsx",filePath:"app/blog/page.tsx"}
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
```

```{fileName:"app/blog/[slug]/page.tsx",filePath:"app/blog/[slug]/page.tsx"}
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
```

```{fileName:"app/categories/page.tsx",filePath:"app/categories/page.tsx"}
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
```

```{fileName:"app/categories/[slug]/page.tsx",filePath:"app/categories/[slug]/page.tsx"}
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
```

```{fileName:"app/tags/page.tsx",filePath:"app/tags/page.tsx"}
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
```

```{fileName:"app/tags/[slug]/page.tsx",filePath:"app/tags/[slug]/page.tsx"}
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
```

```{fileName:"app/about/page.tsx",filePath:"app/about/page.tsx"}
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
```

```{fileName:"app/api/posts/route.ts",filePath:"app/api/posts/route.ts"}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured') === 'true';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  
  try {
    const where: any = {
      published: true,
    };
    
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
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }
    
    if (featured) {
      where.featured = true;
    }
    
    const posts = await prisma.post.findMany({
      where,
      take: limit,
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
      },
    });
    
    // 格式化标签数据
    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((t) => t.tag),
    }));
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
```

```{fileName:"app/api/posts/[slug]/route.ts",filePath:"app/api/posts/[slug]/route.ts"}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { slug } = params;
  
  try {
    // 查找文章
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
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // 更新访问计数
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });
    
    // 格式化标签数据
    const formattedPost = {
      ...post,
      tags: post.tags.map((t) => t.tag),
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
```

```{fileName:"app/api/categories/route.ts",filePath:"app/api/categories/route.ts"}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
    
    // 格式化类别数据，添加文章计数
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      postCount: category._count.posts,
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
```

```{fileName:"app/api/tags/route.ts",filePath:"app/api/tags/route.ts"}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
    
    // 格式化标签数据，添加文章计数
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      postCount: tag._count.posts,
    }));
    
    return NextResponse.json(formattedTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
```

```{fileName:"app/api/comments/route.ts",filePath:"app/api/comments/route.ts"}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, authorName, authorEmail, postId } = body;
    
    // 验证输入
    if (!content || !authorName || !authorEmail || !postId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        content,
        authorName,
        authorEmail,
        postId,
      },
    });
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
```

```{fileName:"next.config.js",filePath:"next.config.js"}
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
```

```{fileName:"postcss.config.js",filePath:"postcss.config.js"}
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

```{fileName:"tsconfig.json",filePath:"tsconfig.json"}
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```{fileName:"package.json",filePath:"package.json"}
{
  "name": "next-personal-blog",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.0",
    "date-fns": "^2.30.0",
    "next": "13.4.12",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.0",
    "@types/node": "20.4.5",
    "@types/react": "18.2.16",
    "@types/react-dom": "18.2.7",
    "autoprefixer": "10.4.14",
    "eslint": "8.45.0",
    "eslint-config-next": "13.4.12",
    "postcss": "8.4.27",
    "prisma": "^5.0.0",
    "ts-node": "^10.9.1",
    "typescript": "5.1.6"
  }
}
```

```{fileName:"README.md",filePath:"README.md"}
# 个人博客

一个使用 Next.js 13 构建的现代化个人博客应用，支持文章管理、分类、标签、评论等功能，并同时支持亮色和暗色主题模式。

## 特性

- 🚀 使用 Next.js 13 App Router
- 💻 基于 React 和 TypeScript 的前端开发
- 🎨 使用 TailwindCSS 和 DaisyUI 构建响应式设计
- 📊 Prisma ORM 和 SQLite 数据库
- 🌓 支持暗色和亮色主题模式
- 📱 完全响应式设计，适应各种设备
- 🔍 文章搜索功能
- 💬 评论系统
- 📝 Markdown 文章内容
- 📂 分类和标签管理

## 技术栈

- **前端**：Next.js 13, React 18, TypeScript
- **样式**：TailwindCSS, DaisyUI
- **后端**：Next.js API Routes
- **数据库**：Prisma ORM, SQLite
- **其他工具**：date-fns

## 快速开始

### 前提条件

- Node.js 16.8 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/next-personal-blog.git
cd next-personal-blog
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 设置数据库

```bash
# 生成 Prisma 客户端
npm run prisma:generate
# 或
yarn prisma:generate

# 运行迁移
npm run prisma:migrate
# 或
yarn prisma:migrate

# 填充示例数据
npm run prisma:seed
# 或
yarn prisma:seed
```

4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

5. 打开浏览器访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 启动生产服务器

```bash
npm run start
# 或
yarn start
```

## 项目结构

```
next-personal-blog/
├── app/                 # Next.js 应用目录
│   ├── api/             # API 路由
│   ├── blog/            # 博客文章页面
│   ├── categories/      # 分类页面
│   ├── tags/            # 标签页面
│   ├── about/           # 关于页面
│   ├── layout.tsx       # 根布局组件
│   ├── page.tsx         # 首页组件
│   └── globals.css      # 全局样式
├── components/          # React 组件
│   ├── common/          # 通用组件
│   ├── posts/           # 文章相关组件
│   └── comments/        # 评论相关组件
├── lib/                 # 工具库和服务
│   └── prisma.ts        # Prisma 客户端
├── prisma/              # Prisma 配置和迁移
│   ├── schema.prisma    # 数据库 schema
│   └── seed.ts          # 种子数据脚本
├── public/              # 静态资源
├── next.config.js       # Next.js 配置
├── postcss.config.js    # PostCSS 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 项目依赖和脚本
```

## 管理员登录

默认的管理员账户:

- 电子邮件: admin@example.com
- 密码: admin123

## 许可

MIT
```

```{fileName:"generateInfo.md",filePath:"generateInfo.md"}
# 个人博客项目生成信息

## 项目简介

这是一个使用Next.js 13开发的个人博客系统，具有以下特性：

- 响应式设计：适配移动端和桌面端
- 暗色/亮色主题模式：支持自动切换和手动切换
- 博客文章管理：发布、浏览
- 分类和标签系统：文章分类和标签聚合
- 评论系统：允许读者进行互动
- 搜索功能：快速查找感兴趣的内容
- 现代UI设计：采用玻璃拟态等视觉效果

## 技术栈

- **前端框架**：Next.js 13 + React 18 + TypeScript
- **UI框架**：TailwindCSS + daisyUI
- **ORM**：Prisma
- **数据库**：SQLite
- **其他库**：date-fns (日期格式化)

## 项目结构

主要文件结构说明：

- `app/`: Next.js 13 App Router 页面组件
- `components/`: 可复用的React组件
- `lib/`: 工具函数和服务
- `prisma/`: 数据库模型和种子数据
- `public/`: 静态资源
- 配置文件：next.config.js, tsconfig.json等

## 主要功能

1. 首页：展示精选和最新文章
2. 博客列表页：所有文章的列表，支持搜索和过滤
3. 文章详情页：展示文章内容和评论功能
4. 分类页：按分类浏览文章
5. 标签页：按标签浏览文章
6. 关于页：博主个人介绍

## 开始使用

请参照README.md中的安装说明运行项目。默认管理员账户为admin@example.com，密码为admin123。
```