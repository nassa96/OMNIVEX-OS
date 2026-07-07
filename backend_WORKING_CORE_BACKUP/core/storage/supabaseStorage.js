import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const BUCKET = "atlas-checkpoints";

export async function saveCheckpointFile(data) {
  const fileName = `checkpoint-${Date.now()}.json`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, JSON.stringify(data), {
      contentType: "application/json"
    });

  if (error) {
    console.log("[STORAGE ERROR]", error.message);
    return false;
  }

  console.log("[CHECKPOINT STORED]", fileName);
  return true;
}
