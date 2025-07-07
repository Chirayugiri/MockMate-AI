import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return new Response(JSON.stringify({}), { status: 401 });
  }
  return new Response(JSON.stringify(user), { status: 200 });
}