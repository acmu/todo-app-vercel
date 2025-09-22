This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## 要解决的问题

1. 使用 npmrc 配置仓库源，不要使用内部源
2. Prisma 自动生成目录，必须要在 eslint 省略，否则部署失败

连接数据库使用 postgresql  使用 neon 数据库

PostgreSQL: The world's most advanced open source database

https://console.neon.tech/app/projects/weathered-queen-39324162

neon

https://console.neon.tech/

https://neon.com/


POSTGRES_URL_NONPOOLING 变量的获取

案例 A：如果你使用的是 Neon (最常见的情况)
一个 Neon 的带连接池的 URL 看起来会像这样：
postgres://user:password@ep-ancient-sound-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname
请注意中间那个 -pooler 的部分。
✅ 你的操作：
非常简单，只需要把主机名里的 -pooler 删除掉，就得到了直连 URL！
原来的 (带连接池):
...-a1b2c3d4-pooler.us-east-2.aws.neon.tech/...
修改后的 (直连):
...-a1b2c3d4.us-east-2.aws.neon.tech/...


所以，你需要：
复制 POSTGRES_URL 的完整值。
粘贴到一个文本编辑器里。
找到并删除 -pooler 这个部分。
这个新的 URL 就是你的 POSTGRES_URL_NONPOOLING 的值。