/**
 * Best-effort in-memory rate limiting for /api/contact.
 *
 * This is per-instance state: on Vercel's Fluid Compute, warm instances are
 * reused across requests (so this is effective against a sustained flood
 * from one warm instance), but a cold start or a request routed to a
 * different instance gets a fresh counter. That's an accepted tradeoff for
 * this endpoint's traffic profile rather than a reason to add an external
 * store (Redis/Upstash) purely for a low-volume contact form. It stops
 * casual scripted abuse and single-source flooding without adding an
 * external dependency; it is not a substitute for platform-level DDoS
 * protection (Vercel's firewall already sits in front of this).
 */

const PER_IP_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const PER_IP_MAX_REQUESTS = 5;

const GLOBAL_WINDOW_MS = 60 * 1000; // 1 minute
const GLOBAL_MAX_REQUESTS = 20;

type Bucket = { count: number; windowStart: number };

const perIpBuckets = new Map<string, Bucket>();
const globalBucket: Bucket = { count: 0, windowStart: Date.now() };

// Prevent unbounded growth of perIpBuckets under a distributed flood.
const MAX_TRACKED_IPS = 5_000;

function hit(bucket: Bucket, now: number, windowMs: number, max: number) {
  if (now - bucket.windowStart >= windowMs) {
    bucket.count = 0;
    bucket.windowStart = now;
  }
  bucket.count += 1;
  const allowed = bucket.count <= max;
  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.windowStart + windowMs - now) / 1000));
  return { allowed, retryAfterSeconds };
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();

  const globalResult = hit(globalBucket, now, GLOBAL_WINDOW_MS, GLOBAL_MAX_REQUESTS);
  if (!globalResult.allowed) return globalResult;

  if (perIpBuckets.size >= MAX_TRACKED_IPS && !perIpBuckets.has(ip)) {
    perIpBuckets.clear();
  }

  const bucket = perIpBuckets.get(ip) ?? { count: 0, windowStart: now };
  const result = hit(bucket, now, PER_IP_WINDOW_MS, PER_IP_MAX_REQUESTS);
  perIpBuckets.set(ip, bucket);

  return result;
}
