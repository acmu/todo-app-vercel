// app/api/todos/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 更新 todo (例如：切换完成状态)
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { completed } = await request.json();
  // 等待 params Promise 解析
  const { id } = await context.params;
  const updatedTodo = await prisma.todo.updateMany({
    where: { id, userId: session.user.id }, // 确保只能更新自己的 todo
    data: { completed },
  });

  return NextResponse.json(updatedTodo);
}

// 删除 todo
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 等待 params Promise 解析
  const { id } = await context.params;
  await prisma.todo.deleteMany({
    where: { id, userId: session.user.id }, // 确保只能删除自己的 todo
  });

  return new NextResponse(null, { status: 204 });
}