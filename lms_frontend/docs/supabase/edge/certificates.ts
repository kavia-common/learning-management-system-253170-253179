import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

/**
 * PUBLIC_INTERFACE
 * Edge Function: certificates
 * Stub for generating certificate PDFs for course completions.
 * This function should validate the JWT, check completion status,
 * and return a generated PDF (application/pdf) or a signed URL.
 *
 * Deployment:
 *   supabase functions deploy certificates --project-ref <project-ref>
 *
 * Environment:
 *   Uses service role (on server) or user JWT for auth context.
 */
serve(async (req) => {
  try {
    // TODO: Validate token from Authorization header, parse input payload
    const { user_id, course_id } = await req.json();

    if (!user_id || !course_id) {
      return new Response(JSON.stringify({ error: 'Missing user_id or course_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Check completion state from DB and generate certificate
    // Placeholder response for now
    return new Response(
      JSON.stringify({ status: 'ok', message: 'Certificate generation stub', user_id, course_id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (_e) {
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
