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