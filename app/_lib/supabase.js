import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://heuqlmqcfusnwzqbjrbe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldXFsbXFjZnVzbnd6cWJqcmJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTg5OTk0NCwiZXhwIjoyMDM3NDc1OTQ0fQ.fgU1C8bWJVBtz17djoK85XyEW409BTWgmp6n7aLNmvw"
);

export default supabase;
