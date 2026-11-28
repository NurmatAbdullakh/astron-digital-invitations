import { checkDatabaseConnection } from "@/server/db/pool";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await checkDatabaseConnection();
    return Response.json({ status: "ready", dependencies: { database: "ok" } });
  } catch {
    return Response.json(
      { status: "not_ready", dependencies: { database: "unavailable" } },
      { status: 503 },
    );
  }
}
