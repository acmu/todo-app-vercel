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