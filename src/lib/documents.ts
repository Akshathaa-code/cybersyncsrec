import { supabase } from "@/integrations/supabase/client";

export type DocStatus = "uploading" | "ready" | "analyzing" | "analyzed" | "error";
export type DocRow = {
  id: string;
  filename: string;
  file_type: string;
  size_bytes: number | null;
  storage_path: string;
  status: DocStatus;
  created_at: string;
};

export const BUCKET = "study-documents";

export async function listDocuments(): Promise<DocRow[]> {
  const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DocRow[];
}

export async function setStatus(id: string, status: DocStatus) {
  const { error } = await supabase.from("documents").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function uploadPdf(file: File, onRow: (row: DocRow) => void): Promise<DocRow> {
  const safe = file.name.replace(/[^\w.\- ]+/g, "_");
  const path = `${crypto.randomUUID()}/${safe}`;
  const { data, error } = await supabase
    .from("documents")
    .insert({ filename: file.name, file_type: file.type || "application/pdf", size_bytes: file.size, storage_path: path, status: "uploading" })
    .select()
    .single();
  if (error) throw error;
  const row = data as DocRow;
  onRow(row);
  const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: "application/pdf" });
  const status: DocStatus = up.error ? "error" : "ready";
  await setStatus(row.id, status);
  if (up.error) throw up.error;
  return { ...row, status };
}
