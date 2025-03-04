`使用https://poe.com/App-Creator，claude3.7 支持单次200k输出。每日3000积分限时24积分一次，建议每次最多追问一次，长上下文积分另算。`
------
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
