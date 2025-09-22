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