import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  // Check database connection
  let dbStatus = "error";
  let startTime = Date.now();

  try {
    // Perform simple query to check DB connection
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (e) {
    console.error("Health check - Database connection error:", e);
    dbStatus = "error";
  }

  const dbResponseTime = Date.now() - startTime;

  // Get memory usage
  const memoryUsage = process.memoryUsage();

  // Response with system status
  const healthData = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      responseTime: `${dbResponseTime}ms`,
    },
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    },
    environment: process.env.NODE_ENV,
  };

  // If the database isn't connected, return a 503 status
  if (dbStatus === "error") {
    return NextResponse.json(
      { ...healthData, status: "error", message: "Database connection failed" },
      { status: 503 }
    );
  }

  return NextResponse.json(healthData);
}