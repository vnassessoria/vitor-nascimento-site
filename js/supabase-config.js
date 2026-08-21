/* ============================================================
   Configuração do Supabase
   Depois de criar seu projeto em https://supabase.com, vá em
   "Project Settings" → "API" e cole aqui:
   - "Project URL"       → SUPABASE_URL
   - "anon public" key   → SUPABASE_ANON_KEY
   (é seguro expor esses dois valores no código do site — o
   acesso de verdade é controlado pelas regras RLS do banco)
   ============================================================ */
const SUPABASE_URL = "https://mbpmwjrfzacwpraqrakx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icG13anJmemFjd3ByYXFyYWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMzgxNjEsImV4cCI6MjEwMjkxNDE2MX0.kjiisCNO3QtB0zgy1TgTrCNntl9P2UnplNx4QoKq41k";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
