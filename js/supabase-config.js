/* ============================================================
   Configuração do Supabase
   Depois de criar seu projeto em https://supabase.com, vá em
   "Project Settings" → "API" e cole aqui:
   - "Project URL"       → SUPABASE_URL
   - "anon public" key   → SUPABASE_ANON_KEY
   (é seguro expor esses dois valores no código do site — o
   acesso de verdade é controlado pelas regras RLS do banco)
   ============================================================ */
const SUPABASE_URL = "COLE_AQUI_A_URL_DO_SEU_PROJETO";
const SUPABASE_ANON_KEY = "COLE_AQUI_A_ANON_KEY_DO_SEU_PROJETO";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
