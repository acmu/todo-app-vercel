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


### 如果 auth 报这样的错，是你的网络环境的问题，导致 auth 不能连接数据库，你可以部署了之后再去试一下，不要在本地试了，本地就是不能连接数据库

```
 POST / 303 in 40ms
[auth][error] AdapterError: Read more at https://errors.authjs.dev#adaptererror
[auth][cause]: PrismaClientInitializationError: 
Invalid `p.account.findUnique()` invocation in
/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_f8e86f47._.js:4383:45

  4380         }
  4381     }),
  4382 async getUserByAccount (provider_providerAccountId) {
→ 4383     const account = await p.account.findUnique(
Can't reach database server at `ep-old-lab-adla1z5z-pooler.c-2.us-east-1.aws.neon.tech:5432`

Please make sure your database server is running at `ep-old-lab-adla1z5z-pooler.c-2.us-east-1.aws.neon.tech:5432`.
    at ei.handleRequestError (/Users/max/cdemo/todo-app-vercel/node_modules/@prisma/client/runtime/library.js:121:7568)
    at ei.handleAndLogRequestError (/Users/max/cdemo/todo-app-vercel/node_modules/@prisma/client/runtime/library.js:121:6593)
    at ei.request (/Users/max/cdemo/todo-app-vercel/node_modules/@prisma/client/runtime/library.js:121:6300)
    at async a (/Users/max/cdemo/todo-app-vercel/node_modules/@prisma/client/runtime/library.js:130:9551)
    at async getUserByAccount (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_f8e86f47._.js:4383:29)
    at async acc.<computed> (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_@auth_core_92fae0ab._.js:1621:24)
    at async Module.callback (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_@auth_core_92fae0ab._.js:4109:33)
    at async AuthInternal (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_@auth_core_92fae0ab._.js:5123:24)
    at async Auth (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_@auth_core_92fae0ab._.js:5370:34)
    at async AppRouteRouteModule.do (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:38696)
    at async AppRouteRouteModule.handle (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:45978)
    at async responseGenerator (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_next_eecfae77._.js:16315:38)
    at async AppRouteRouteModule.handleResponse (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:1:187643)
    at async handleResponse (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_next_eecfae77._.js:16377:32)
    at async handler (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_next_eecfae77._.js:16429:13)
    at async DevServer.renderToResponseWithComponentsImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:1422:9)
    at async DevServer.renderPageComponent (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:1474:24)
    at async DevServer.renderToResponseImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:1514:32)
    at async DevServer.pipeImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:1025:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/next-server.js:393:17)
    at async DevServer.handleRequestImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:916:17)
    at async /Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/dev/next-dev-server.js:399:20
    at async Span.traceAsyncFn (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/trace/trace.js:157:20)
    at async DevServer.handleRequest (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/dev/next-dev-server.js:395:24)
    at async invokeRender (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/lib/router-server.js:240:21)
    at async handleRequest (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/lib/router-server.js:437:24)
    at async requestHandlerImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/lib/router-server.js:485:13)
    at async Server.requestListener (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/lib/start-server.js:226:13)
[auth][details]: {}
[auth][error] AdapterError: Read more at https://errors.authjs.dev#adaptererror
[auth][cause]: PrismaClientInitializationError: 
Invalid `p.account.findUnique()` invocation in
/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_f8e86f47._.js:4383:45

  4380         }
  4381     }),
  4382 async getUserByAccount (provider_providerAccountId) {
→ 4383     const account = await p.account.findUnique(
Can't reach database server at `ep-old-lab-adla1z5z-pooler.c-2.us-east-1.aws.neon.tech:5432`

Please make sure your database server is running at `ep-old-lab-adla1z5z-pooler.c-2.us-east-1.aws.neon.tech:5432`.
    at ei.handleRequestError (/Users/max/cdemo/todo-app-vercel/node_modules/@prisma/client/runtime/library.js:121:7568)
    at ei.handleAndLogRequestError (/Users/max/cdemo/todo-app-vercel/node_modules/@prisma/client/runtime/library.js:121:6593)
    at ei.request (/Users/max/cdemo/todo-app-vercel/node_modules/@prisma/client/runtime/library.js:121:6300)
    at async a (/Users/max/cdemo/todo-app-vercel/node_modules/@prisma/client/runtime/library.js:130:9551)
    at async getUserByAccount (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_f8e86f47._.js:4383:29)
    at async acc.<computed> (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_@auth_core_92fae0ab._.js:1621:24)
    at async Module.callback (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_@auth_core_92fae0ab._.js:4109:33)
    at async AuthInternal (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_@auth_core_92fae0ab._.js:5123:24)
    at async Auth (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_@auth_core_92fae0ab._.js:5370:34)
    at async AppRouteRouteModule.do (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:38696)
    at async AppRouteRouteModule.handle (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:5:45978)
    at async responseGenerator (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_next_eecfae77._.js:16315:38)
    at async AppRouteRouteModule.handleResponse (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:1:187643)
    at async handleResponse (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_next_eecfae77._.js:16377:32)
    at async handler (/Users/max/cdemo/todo-app-vercel/.next/server/chunks/node_modules_next_eecfae77._.js:16429:13)
    at async DevServer.renderToResponseWithComponentsImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:1422:9)
    at async DevServer.renderPageComponent (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:1474:24)
    at async DevServer.renderToResponseImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:1514:32)
    at async DevServer.pipeImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:1025:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/next-server.js:393:17)
    at async DevServer.handleRequestImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/base-server.js:916:17)
    at async /Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/dev/next-dev-server.js:399:20
    at async Span.traceAsyncFn (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/trace/trace.js:157:20)
    at async DevServer.handleRequest (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/dev/next-dev-server.js:395:24)
    at async invokeRender (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/lib/router-server.js:240:21)
    at async handleRequest (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/lib/router-server.js:437:24)
    at async requestHandlerImpl (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/lib/router-server.js:485:13)
    at async Server.requestListener (/Users/max/cdemo/todo-app-vercel/node_modules/next/dist/server/lib/start-server.js:226:13)
[auth][details]: {}
 GET /api/auth/callback/github?code=e468d3b3f9caba3a2381 302 in 7226ms
 GET /api/auth/error?error=Configuration 500 in 247ms
```