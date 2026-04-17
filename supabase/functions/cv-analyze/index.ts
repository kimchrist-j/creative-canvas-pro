// Edge function: AI CV analyzer — rates the CV out of 20 and returns detailed feedback
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resume, language = "en" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const systemPrompt = `You are a senior recruiter and career coach. Analyze the candidate's CV and return a strict JSON object with this exact shape (no markdown, no preamble):
{
  "score": <integer 0-20>,
  "summary": "<one-paragraph spoken-style overview, conversational>",
  "strengths": ["...","..."],
  "weaknesses": ["...","..."],
  "improvements": ["...","..."],
  "speech": "<150-220 word natural spoken script that a real recruiter would say out loud, mentioning the score, what works, what doesn't, and concrete suggestions. Friendly, professional tone.>"
}
Reply in language: ${language}.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this CV (JSON):\n${JSON.stringify(resume)}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_analysis",
            description: "Submit CV analysis",
            parameters: {
              type: "object",
              properties: {
                score: { type: "integer", minimum: 0, maximum: 20 },
                summary: { type: "string" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                improvements: { type: "array", items: { type: "string" } },
                speech: { type: "string" },
              },
              required: ["score", "summary", "strengths", "weaknesses", "improvements", "speech"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_analysis" } },
      }),
    });

    if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limited. Please retry." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall ? JSON.parse(toolCall.function.arguments) : null;
    if (!args) throw new Error("Invalid AI response");

    return new Response(JSON.stringify(args), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("cv-analyze error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
