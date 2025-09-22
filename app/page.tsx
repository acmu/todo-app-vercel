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