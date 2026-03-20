import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Autonomous Metrics Recording Service
 * Records AI-level critical reasoning metrics for autonomous handover capability
 * 
 * NOTE: This demo implementation uses in-memory storage.
 * For production use, consider integrating with:
 * - Vercel KV (Redis-based key-value store)
 * - Vercel Postgres (SQL database)
 * - External database services (MongoDB, PostgreSQL, etc.)
 * 
 * Current in-memory storage will be lost on serverless function cold starts.
 */

interface MetricData {
  metric_type: string;
  value: any;
  timestamp: number;
  source: string;
  metadata?: Record<string, any>;
}

interface MetricsPayload {
  metrics: MetricData[];
  service: string;
  version?: string;
}

// In-memory storage for demo (production would use database)
const metricsStore: MetricData[] = [];
const MAX_METRICS = 10000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // POST - Record metrics
    if (req.method === "POST") {
      const payload: MetricsPayload = req.body;

      if (!payload.metrics || !Array.isArray(payload.metrics)) {
        return res.status(400).json({
          error: "Invalid payload",
          message: "Metrics must be an array"
        });
      }

      // Validate and store metrics
      const validMetrics: MetricData[] = [];
      for (const metric of payload.metrics) {
        if (!metric.metric_type || metric.value === undefined) {
          continue; // Skip invalid metrics
        }

        const validatedMetric: MetricData = {
          metric_type: metric.metric_type,
          value: metric.value,
          timestamp: metric.timestamp || Date.now(),
          source: metric.source || payload.service || "unknown",
          metadata: metric.metadata || {}
        };

        validMetrics.push(validatedMetric);
        metricsStore.push(validatedMetric);
      }

      // Keep only recent metrics
      if (metricsStore.length > MAX_METRICS) {
        metricsStore.splice(0, metricsStore.length - MAX_METRICS);
      }

      return res.status(200).json({
        status: "success",
        recorded: validMetrics.length,
        total_metrics: metricsStore.length,
        timestamp: Date.now()
      });
    }

    // GET - Retrieve metrics
    if (req.method === "GET") {
      const { metric_type, source, limit = "100" } = req.query;
      
      let filtered = [...metricsStore];

      // Filter by metric type
      if (metric_type && typeof metric_type === "string") {
        filtered = filtered.filter(m => m.metric_type === metric_type);
      }

      // Filter by source
      if (source && typeof source === "string") {
        filtered = filtered.filter(m => m.source === source);
      }

      // Apply limit
      const limitNum = parseInt(limit as string, 10);
      const limitedResults = filtered.slice(-limitNum);

      // Calculate statistics
      const stats = {
        total: metricsStore.length,
        filtered: filtered.length,
        returned: limitedResults.length,
        by_type: {} as Record<string, number>,
        by_source: {} as Record<string, number>
      };

      // Count by type and source
      for (const metric of metricsStore) {
        stats.by_type[metric.metric_type] = (stats.by_type[metric.metric_type] || 0) + 1;
        stats.by_source[metric.source] = (stats.by_source[metric.source] || 0) + 1;
      }

      return res.status(200).json({
        metrics: limitedResults,
        stats,
        timestamp: Date.now()
      });
    }

    // Method not allowed
    return res.status(405).json({
      error: "Method not allowed",
      allowed: ["GET", "POST", "OPTIONS"]
    });

  } catch (err) {
    console.error("Autonomous metrics error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err instanceof Error ? err.message : "Unknown error"
    });
  }
}
