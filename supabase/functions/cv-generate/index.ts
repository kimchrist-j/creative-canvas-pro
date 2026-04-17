// Edge function: AI CV generator — builds a full ResumeData JSON from a freeform description
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { description, language = "en" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const systemPrompt = `You are a professional CV writer. Based on the user's description, generate a complete, polished resume in ${language}. Use realistic, professional phrasing. If details are missing, infer reasonable values. Return only via the tool call.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: description },
        ],
        tools: [{
          type: "function",
          function: {
            name: "build_resume",
            description: "Build a structured resume",
            parameters: {
              type: "object",
              properties: {
                personalInfo: {
                  type: "object",
                  properties: {
                    firstName: { type: "string" }, lastName: { type: "string" }, title: { type: "string" },
                    email: { type: "string" }, phone: { type: "string" }, city: { type: "string" },
                  },
                  required: ["firstName", "lastName", "title", "email", "phone", "city"],
                },
                profile: { type: "string" },
                experience: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { startYear: { type: "string" }, endYear: { type: "string" }, jobTitle: { type: "string" }, company: { type: "string" }, description: { type: "string" } },
                    required: ["startYear", "endYear", "jobTitle", "company", "description"],
                  },
                },
                education: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { startYear: { type: "string" }, endYear: { type: "string" }, degree: { type: "string" }, institution: { type: "string" } },
                    required: ["startYear", "endYear", "degree", "institution"],
                  },
                },
                skills: { type: "array", items: { type: "string" } },
                hobbies: { type: "array", items: { type: "string" } },
              },
              required: ["personalInfo", "profile", "experience", "education", "skills", "hobbies"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "build_resume" } },
      }),
    });

    if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limited." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const data = await resp.json();
    const args = JSON.parse(data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments || "{}");

    // Add IDs and convert skills to objects
    const resume = {
      personalInfo: { ...args.personalInfo, photo: "" },
      profile: args.profile,
      experience: (args.experience || []).map((e: any, i: number) => ({ ...e, id: String(i + 1) })),
      education: (args.education || []).map((e: any, i: number) => ({ ...e, id: String(i + 1) })),
      skills: (args.skills || []).map((s: string) => ({ name: s })),
      hobbies: args.hobbies || [],
      websites: [],
      references: [],
      cvFormat: "international",
    };

    return new Response(JSON.stringify(resume), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("cv-generate error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
