// app/api/auth/[...nextauth]/route.ts (✅ 正确的写法)

import { handlers } from "@/auth";
export const { GET, POST } = handlers;