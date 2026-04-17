// Edge function: AI PowerPoint generator — generates outline via Lovable AI, builds .pptx with PptxGenJS
import PptxGenJS from "npm:pptxgenjs@3.12.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Template = "midnight" | "coral" | "forest" | "minimal";

const THEMES: Record<Template, { bg: string; titleBg: string; primary: string; accent: string; text: string; subtext: string; titleFont: string; bodyFont: string }> = {
  midnight: { bg: "0F1735", titleBg: "1E2761", primary: "CADCFC", accent: "F96167", text: "FFFFFF", subtext: "B8C4E0", titleFont: "Georgia", bodyFont: "Calibri" },
  coral:    { bg: "FFFBF5", titleBg: "F96167", primary: "2F3C7E", accent: "F9E795", text: "1A1A2E", subtext: "555555", titleFont: "Trebuchet MS", bodyFont: "Calibri" },
  forest:   { bg: "F5F7F0", titleBg: "2C5F2D", primary: "97BC62", accent: "FFFFFF", text: "1A2810", subtext: "4A5C3A", titleFont: "Cambria", bodyFont: "Calibri" },
  minimal:  { bg: "FFFFFF", titleBg: "212121", primary: "36454F", accent: "F2F2F2", text: "212121", subtext: "707070", titleFont: "Arial", bodyFont: "Arial" },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, slideCount = 6, template = "midnight", language = "en" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!topic) throw new Error("topic required");

    // 1. Generate outline with AI
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `You craft compelling presentations. Generate ${slideCount} slides in ${language}. First slide is title. Last slide is conclusion. Each content slide has 3-5 concise bullets (max 12 words each). Reply only via tool call.` },
          { role: "user", content: `Topic: ${topic}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "build_deck",
            description: "Build slide deck",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                subtitle: { type: "string" },
                slides: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      heading: { type: "string" },
                      bullets: { type: "array", items: { type: "string" } },
                    },
                    required: ["heading", "bullets"],
                  },
                },
              },
              required: ["title", "subtitle", "slides"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "build_deck" } },
      }),
    });

    if (aiResp.status === 429) return new Response(JSON.stringify({ error: "Rate limited." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (aiResp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const aiData = await aiResp.json();
    const deck = JSON.parse(aiData.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments || "{}");

    // 2. Build PPTX
    const theme = THEMES[(template as Template)] || THEMES.midnight;
    const pres = new PptxGenJS();
    pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5

    // Title slide
    const titleSlide = pres.addSlide();
    titleSlide.background = { color: theme.titleBg };
    titleSlide.addShape("rect", { x: 0, y: 6.0, w: 13.333, h: 0.08, fill: { color: theme.accent } });
    titleSlide.addText(deck.title || topic, {
      x: 0.7, y: 2.5, w: 12, h: 1.5, fontSize: 54, bold: true, color: theme.text, fontFace: theme.titleFont,
    });
    titleSlide.addText(deck.subtitle || "", {
      x: 0.7, y: 4.1, w: 12, h: 0.8, fontSize: 22, color: theme.primary, fontFace: theme.bodyFont, italic: true,
    });

    // Content slides
    (deck.slides || []).forEach((s: any, idx: number) => {
      const slide = pres.addSlide();
      slide.background = { color: theme.bg };

      // Sidebar accent
      slide.addShape("rect", { x: 0, y: 0, w: 0.25, h: 7.5, fill: { color: theme.accent } });

      // Slide number
      slide.addText(String(idx + 1).padStart(2, "0"), {
        x: 11.8, y: 0.4, w: 1.2, h: 0.6, fontSize: 14, color: theme.subtext, fontFace: theme.bodyFont, align: "right",
      });

      // Heading
      slide.addText(s.heading, {
        x: 0.7, y: 0.5, w: 11, h: 1.0, fontSize: 36, bold: true, color: theme.text, fontFace: theme.titleFont,
      });

      // Divider
      slide.addShape("rect", { x: 0.7, y: 1.6, w: 1.5, h: 0.06, fill: { color: theme.accent } });

      // Bullets
      const bullets = (s.bullets || []).map((b: string) => ({ text: b, options: { bullet: { code: "25CF" }, color: theme.text, fontFace: theme.bodyFont } }));
      slide.addText(bullets, {
        x: 0.7, y: 2.0, w: 11.5, h: 4.5, fontSize: 18, color: theme.text, paraSpaceAfter: 12, valign: "top",
      });

      // Footer
      slide.addText(deck.title || topic, {
        x: 0.7, y: 6.9, w: 11, h: 0.4, fontSize: 10, color: theme.subtext, fontFace: theme.bodyFont,
      });
    });

    const buf = await pres.write({ outputType: "uint8array" }) as Uint8Array;
    return new Response(buf, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${(deck.title || topic).replace(/[^a-z0-9]/gi, "_").slice(0, 40)}.pptx"`,
      },
    });
  } catch (err) {
    console.error("pptx-generate error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
