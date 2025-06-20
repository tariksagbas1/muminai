import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
serve(async ()=>{
  await supabase.rpc("refresh_everything");
  const { data: tokens } = await supabase.from("device_tokens").select("token");
  const messages = tokens.map((t)=>({
      to: t.token,
      sound: "default",
      title: "Your daily picks are ready!",
      body: "Tap to open the app."
    }));
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages
    })
  });
  return new Response(null, {
    status: 204
  });
});
