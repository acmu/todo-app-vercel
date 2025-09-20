好的，完全没问题！使用 Next.js + Vercel 全家桶来构建一个带登录和数据存储的 Todo List 应用是一个非常现代且高效的方案。Vercel 提供的 Vercel Postgres (数据库) 和 NextAuth.js (认证) 能与 Next.js 完美集成。

下面我将为你提供一个详细的、分步的指南，从零开始构建这个应用。

---

### **技术栈选择**

*   **框架**: Next.js (使用 App Router)
*   **部署/托管**: Vercel
*   **数据库**: Vercel Postgres (基于 Serverless PostgreSQL)
*   **ORM**: Prisma (用于方便地操作数据库，提供类型安全)
*   **认证**: NextAuth.js (v5, 也叫 Auth.js)，轻松集成登录功能
*   **样式**: Tailwind CSS (create-next-app 自带，方便快速开发)

---

### **第一步：项目初始化和环境准备**

1.  **创建 Next.js 项目**
    打开你的终端，运行以下命令：
    ```bash
    npx create-next-app@latest todo-app-vercel
    ```
    在弹出的选项中，请确保选择：
    *   `Would you like to use TypeScript?` **Yes**
    *   `Would you like to use Tailwind CSS?` **Yes**
    *   `Would you like to use App Router?` **Yes** (这是关键)
    *   其他选项可以根据你的喜好选择。

2.  **安装必要的依赖**
    进入项目目录，并安装 Prisma 和 NextAuth.js 相关的库。
    ```bash
    cd todo-app-vercel
    npm install prisma @prisma/client next-auth@beta @auth/prisma-adapter
    npm install -D @types/node # prisma 需要
    ```
    > **注意**: `next-auth@beta` 是指 v5 版本，它与 Next.js App Router 和中间件集成得更好。

3.  **初始化 Prisma**
    ```bash
    npx prisma init
    ```
    这个命令会创建一个 `prisma` 文件夹，里面有一个 `schema.prisma` 文件，以及一个 `.env` 文件用于存放数据库连接字符串。

---

### **第二步：设置 Vercel 和 Vercel Postgres 数据库**

1.  **注册并登录 Vercel**
    如果你还没有 Vercel 账号，请先去 [Vercel官网](https://vercel.com) 注册一个，建议使用 GitHub 账号关联。

2.  **创建 Vercel 项目并连接数据库**
    *   将你的本地代码推送到一个 GitHub 仓库。
    *   在 Vercel Dashboard 中，点击 "Add New... -> Project"。
    *   选择你刚刚创建的 GitHub 仓库并导入。
    *   在配置项目页面，找到 **Storage** 选项卡。
    *   点击 "Connect Store"，选择 **Postgres**，然后点击 "Create New"。
    *   给你的数据库起个名字，选择区域，然后点击 "Create"。

3.  **获取数据库连接信息**
    *   创建成功后，Vercel 会显示数据库的连接信息。找到 `.env.local` 选项卡。
    *   复制 Vercel 提供的所有环境变量（特别是 `POSTGRES_URL_NONPOOLING`，Prisma 迁移时需要非连接池的 URL）。
    *   将这些信息粘贴到你本地项目根目录下的 `.env` 文件中。你的 `.env` 文件看起来会像这样：

    ```env
    # .env
    # Vercel 提供的环境变量
    POSTGRES_URL="postgres://..."
    POSTGRES_PRISMA_URL="prisma://..."
    POSTGRES_URL_NONPOOLING="postgres://..." # Prisma migrate 需要这个
    # ... 其他 Vercel 提供的变量

    # 我们要告诉 Prisma 使用哪个 URL
    DATABASE_URL=$POSTGRES_PRISMA_URL
    ```

---

### **第三步：配置 Prisma 和数据模型**

1.  **编辑 `schema.prisma`**
    打开 `prisma/schema.prisma` 文件，定义我们的数据模型。我们需要 `User` 模型来存储用户信息，`Todo` 模型来存储待办事项，以及 NextAuth.js 需要的 `Account`, `Session` 等模型。使用 `@auth/prisma-adapter` 可以很方便地生成这些模型。

    ```prisma
    // prisma/schema.prisma

    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider  = "postgresql"
      url       = env("DATABASE_URL")
      directUrl = env("POSTGRES_URL_NONPOOLING") // 用于 Prisma Migrate
    }

    model Todo {
      id        String   @id @default(cuid())
      text      String
      completed Boolean  @default(false)
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
      userId    String
      user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    }

    // NextAuth.js (Auth.js) Models
    // 这些是 @auth/prisma-adapter 要求的标准模型
    model User {
      id            String    @id @default(cuid())
      name          String?
      email         String?   @unique
      emailVerified DateTime?
      image         String?
      accounts      Account[]
      sessions      Session[]
      todos         Todo[] // 反向关联到 Todo
    }

    model Account {
      id                String  @id @default(cuid())
      userId            String
      type              String
      provider          String
      providerAccountId String
      refresh_token     String?
      access_token      String?
      expires_at        Int?
      token_type        String?
      scope             String?
      id_token          String?
      session_state     String?

      user User @relation(fields: [userId], references: [id], onDelete: Cascade)

      @@unique([provider, providerAccountId])
    }

    model Session {
      id           String   @id @default(cuid())
      sessionToken String   @unique
      userId       String
      expires      DateTime
      user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    }

    model VerificationToken {
      identifier String
      token      String   @unique
      expires    DateTime

      @@unique([identifier, token])
    }
    ```

2.  **将数据模型同步到数据库**
    运行以下命令，Prisma 会读取你的 `schema.prisma` 文件，并在 Vercel Postgres 数据库中创建对应的表。
    ```bash
    npx prisma db push
    ```
    如果一切顺利，你会看到成功信息。

---

### **第四步：实现登录功能 (NextAuth.js)**

1.  **设置 GitHub OAuth App**
    *   登录 GitHub，进入 `Settings -> Developer settings -> OAuth Apps -> New OAuth App`。
    *   `Application name`: 任意填写，如 "My Todo App"。
    *   `Homepage URL`: `http://localhost:3000` (开发时)
    *   `Authorization callback URL`: `http://localhost:3000/api/auth/callback/github`
    *   创建后，你会得到一个 **Client ID** 和一个 **Client Secret**。

2.  **添加认证环境变量**
    将 Client ID 和 Secret 添加到你的 `.env` 文件中。同时，你需要一个 `AUTH_SECRET` 用于加密 session。
    ```bash
    # .env
    # ... 数据库变量

    # Auth.js / NextAuth.js
    AUTH_SECRET="your-super-secret-key-here" # 运行 `openssl rand -hex 32` 生成一个
    AUTH_GITHUB_ID="your-github-client-id"
    AUTH_GITHUB_SECRET="your-github-client-secret"
    ```
    > **重要**: 部署到 Vercel 时，需要将这些环境变量添加到 Vercel 项目的 "Environment Variables" 设置中。

3.  **创建 Auth.js 配置文件**
    在项目根目录创建一个 `auth.ts` 文件。
    ```typescript
    // auth.ts
    import NextAuth from "next-auth";
    import GitHub from "next-auth/providers/github";
    import { PrismaAdapter } from "@auth/prisma-adapter";
    import { PrismaClient } from "@prisma/client";

    const prisma = new PrismaClient();

    export const { handlers, auth, signIn, signOut } = NextAuth({
      adapter: PrismaAdapter(prisma),
      providers: [
        GitHub({
          clientId: process.env.AUTH_GITHUB_ID,
          clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
      ],
      callbacks: {
        session({ session, user }) {
          // 将用户 ID 添加到 session 中，方便后端 API 使用
          if (session.user) {
            session.user.id = user.id;
          }
          return session;
        },
      },
    });
    ```
    > 这里我们使用了 `PrismaAdapter`，它会自动处理用户登录、注册时对数据库的操作（创建用户、session等）。

4.  **创建 API 路由**
    创建文件 `app/api/auth/[...nextauth]/route.ts` 来处理所有认证请求。
    ```typescript
    // app/api/auth/[...nextauth]/route.ts
    export { handlers as GET, handlers as POST } from "@/auth";
    ```

5.  **创建 Session Provider**
    为了在客户端组件中获取 session 信息，我们需要一个 Provider。
    创建一个文件 `app/providers.tsx`：
    ```tsx
    // app/providers.tsx
    "use client";
    import { SessionProvider } from "next-auth/react";

    export default function Providers({ children }: { children: React.ReactNode }) {
      return <SessionProvider>{children}</SessionProvider>;
    }
    ```
    然后在主布局文件中使用它 `app/layout.tsx`:
    ```tsx
    // app/layout.tsx
    import Providers from "./providers";

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body>
            <Providers>{children}</Providers>
          </body>
        </html>
      );
    }
    ```

---

### **第五步：构建 Todo List 的 API 和前端**

1.  **创建 Todo API Routes**
    我们将使用 Next.js 的 Route Handlers 来创建增删改查的 API。

    *   **获取 Todos (`GET`) 和创建 Todo (`POST`)**
        创建文件 `app/api/todos/route.ts`:
        ```typescript
        // app/api/todos/route.ts
        import { NextResponse } from "next/server";
        import { auth } from "@/auth";
        import { PrismaClient } from "@prisma/client";

        const prisma = new PrismaClient();

        // 获取当前用户的 todos
        export async function GET() {
          const session = await auth();
          if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }

          const todos = await prisma.todo.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
          });

          return NextResponse.json(todos);
        }

        // 创建一个新的 todo
        export async function POST(request: Request) {
          const session = await auth();
          if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }

          const { text } = await request.json();
          if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
          }

          const newTodo = await prisma.todo.create({
            data: {
              text,
              userId: session.user.id,
            },
          });

          return NextResponse.json(newTodo, { status: 201 });
        }
        ```
    *   **更新和删除 Todo (`PUT`, `DELETE`)**
        创建文件 `app/api/todos/[id]/route.ts`:
        ```typescript
        // app/api/todos/[id]/route.ts
        import { NextResponse } from "next/server";
        import { auth } from "@/auth";
        import { PrismaClient } from "@prisma/client";

        const prisma = new PrismaClient();

        // 更新 todo (例如：切换完成状态)
        export async function PUT(
          request: Request,
          { params }: { params: { id: string } }
        ) {
          const session = await auth();
          if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }

          const { completed } = await request.json();
          const updatedTodo = await prisma.todo.updateMany({
            where: { id: params.id, userId: session.user.id }, // 确保只能更新自己的 todo
            data: { completed },
          });

          return NextResponse.json(updatedTodo);
        }

        // 删除 todo
        export async function DELETE(
          request: Request,
          { params }: { params: { id: string } }
        ) {
          const session = await auth();
          if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }

          await prisma.todo.deleteMany({
            where: { id: params.id, userId: session.user.id }, // 确保只能删除自己的 todo
          });

          return new NextResponse(null, { status: 204 });
        }
        ```

2.  **构建前端界面**
    修改 `app/page.tsx` 来展示登录按钮和 Todo List。

    ```tsx
    // app/page.tsx
    import { auth, signIn, signOut } from "@/auth";
    import TodoList from "./components/TodoList";

    // 登录/登出按钮组件
    async function AuthButton() {
      const session = await auth();

      return session?.user ? (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <p>Signed in as {session.user.email}</p>
          <button type="submit" className="bg-red-500 text-white p-2 rounded">
            Sign out
          </button>
        </form>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Sign in with GitHub
          </button>
        </form>
      );
    }

    export default async function Home() {
      const session = await auth();

      return (
        <main className="container mx-auto p-4">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Todo List</h1>
            <AuthButton />
          </header>
          {session?.user ? (
            <TodoList />
          ) : (
            <p>Please sign in to manage your todos.</p>
          )}
        </main>
      );
    }
    ```

3.  **创建 TodoList 客户端组件**
    创建一个 `app/components/TodoList.tsx` 文件。这个组件将处理所有与 Todo 相关的交互。

    ```tsx
    // app/components/TodoList.tsx
    "use client";

    import { useState, useEffect } from "react";

    interface Todo {
      id: string;
      text: string;
      completed: boolean;
    }

    export default function TodoList() {
      const [todos, setTodos] = useState<Todo[]>([]);
      const [newTodoText, setNewTodoText] = useState("");
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        fetch("/api/todos")
          .then((res) => res.json())
          .then((data) => {
            setTodos(data);
            setLoading(false);
          });
      }, []);

      const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoText.trim()) return;

        const res = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newTodoText }),
        });
        const newTodo = await res.json();
        setTodos([newTodo, ...todos]);
        setNewTodoText("");
      };

      const handleToggleTodo = async (id: string, completed: boolean) => {
        await fetch(`/api/todos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !completed }),
        });
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo
          )
        );
      };

      const handleDeleteTodo = async (id: string) => {
        await fetch(`/api/todos/${id}`, { method: "DELETE" });
        setTodos(todos.filter((todo) => todo.id !== id));
      };

      if (loading) return <p>Loading...</p>;

      return (
        <div>
          <form onSubmit={handleAddTodo} className="mb-4 flex gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new todo"
              className="border p-2 rounded flex-grow"
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded">
              Add
            </button>
          </form>
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-2 border-b"
              >
                <span
                  onClick={() => handleToggleTodo(todo.id, todo.completed)}
                  className={`cursor-pointer ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    ```

---

### **第六步：部署到 Vercel**

1.  **添加生产环境变量**
    *   回到你的 Vercel 项目 Dashboard。
    *   进入 `Settings -> Environment Variables`。
    *   添加 `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` 这三个变量。数据库相关的变量应该在你连接数据库时已经自动添加了。
    *   **重要**: 更新你的 GitHub OAuth App 的 `Authorization callback URL` 为你的 Vercel 生产环境 URL，例如 `https://your-project-name.vercel.app/api/auth/callback/github`。

2.  **部署**
    *   将你所有的代码 `git push` 到你的 GitHub 仓库主分支。
    *   Vercel 会自动检测到新的提交并开始构建和部署。
    *   等待部署完成，然后访问你的 Vercel URL，你的 Todo List 应用就上线了！

### **总结**

你已经成功地使用 Next.js、Vercel Postgres、Prisma 和 NextAuth.js 构建了一个功能完整的 Todo List 应用。这个流程涵盖了从项目初始化、数据库设置、用户认证到 API 开发、前端实现和最终部署的全过程，是一个非常典型的现代 Web 应用开发模式。