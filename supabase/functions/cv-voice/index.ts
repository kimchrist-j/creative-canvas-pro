// Edge function: ElevenLabs TTS — returns MP3 audio of CV analysis spoken by male/female voice
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VOICES: Record<string, string> = {
  female: "EXAVITQu4vr4xnSDxMaL", // Sarah
  male: "JBFqnCBsd6RMkjVDRZzb",   // George
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, voice = "female" } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY missing");
    if (!text) throw new Error("text required");

    const voiceId = VOICES[voice] || VOICES.female;
    const trimmed = String(text).slice(0, 4500);

    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
        }),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("ElevenLabs error:", resp.status, errText);
      return new Response(JSON.stringify({ error: `TTS failed: ${resp.status}` }), { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const audio = await resp.arrayBuffer();
    return new Response(audio, { headers: { ...corsHeaders, "Content-Type": "audio/mpeg" } });
  } catch (err) {
    console.error("cv-voice error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
