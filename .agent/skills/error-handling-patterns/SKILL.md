---
name: error-handling-and-security
description: Enforces strict security protocols, input validation, and safe error management. Use whenever writing Supabase Edge Functions, RLS Policies, or Client-side Services to prevent data leaks and hacking attempts.
---

# Security & Error Handling Constitution (Vite + Supabase)

**Core Philosophy:** "Trust No One."
In a Client-Side App (SPA), the browser is hostile territory. We prioritize **Data Integrity** and **RLS (Row Level Security)** over everything else.

## 1. The "Sanity Check" Protocol (Mandatory)
Before any data touches the database, it must pass the "Sanity Check."

### **Layer 1: Input Validation (Zod)**
* **Rule:** Never use `any`. All inputs (Client or Edge Function) must be parsed against a strict Zod schema.
* **Action:** If validation fails, throw a specific error that the UI can catch.
    ```typescript
    // ✅ DO THIS
    const schema = z.object({
      patientId: z.string().uuid(),
      symptoms: z.string().max(1000).transform(sanitizeHtml), // Strip XSS tags
    });
    ```

### **Layer 2: Authentication (Supabase Auth)**
* **Rule:** Never rely on the client to send the `user_id` in the body.
* **Action:** Always derive the User ID from the JWT (JSON Web Token) in the session.
    * *Attack Vector:* Client sends `{ "user_id": "admin_id" }`.
    * *Defense:* Supabase RLS policies use `auth.uid()` to verify identity automatically.

### **Layer 3: Authorization (Row Level Security - RLS)**
* **Rule:** The Database is the final firewall. Logic in the frontend is for UX, not Security.
* **Action:** Every table MUST have RLS enabled.
    * **Policy:** `create policy "Patients view own data" on "patients" for select using (auth.uid() = user_id);`
    * **Pharmacist Access:** Use a strictly defined `get_my_claims()` function or `profiles.role` check within the RLS policy.

---

## 2. Anti-Hacking Patterns

### **A. Rate Limiting (The "DDoS" Shield)**
* **Requirement:** Critical actions (Auth, Sending Emails) must run via **Supabase Edge Functions**, not the Client.
* **Standard:** Implement Rate Limiting inside the Edge Function (using Upstash Redis or Supabase limits).

### **B. Generic Error Responses (The "Poker Face")**
* **Rule:** Never leak Database Error Codes (e.g., `23505`) to the UI.
* **Scenario:** Unique constraint violation (Email already exists).
* **Response:**
    * **Log (Internal):** `[CRITICAL] DB Error: Unique violation on users_email_key.`
    * **User sees:** `"This email is unavailable or invalid."`

### **C. Audit Trails (The "Black Box")**
* **Requirement:** Sensitive Clinical Actions (e.g., "Pharmacist Approved Prescription") must trigger an insert into `audit_logs`.
* **Mechanism:** Use a Postgres **Trigger** to auto-log these changes so the client cannot bypass it.

---

## 3. Implementation Patterns (Edge Functions)

When writing backend logic (e.g., `supabase/functions/analyze-blood/index.ts`), follow this `safeServe` pattern:

```typescript
// Example: Safe Edge Function Handler
serve(async (req) => {
  try {
    // 1. Sanity Check: Auth
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (!user || error) return new Response("Unauthorized", { status: 401 });

    // 2. Sanity Check: Validation
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
    }

    // 3. Execute Secure Logic
    const data = await performLogic(result.data, user.id);

    return new Response(JSON.stringify(data), { headers: { ...corsHeaders } });

  } catch (error) {
    // 4. Safe Error Handling
    console.error("[EDGE FUNCTION ERROR]", error); // Log internal details
    return new Response(JSON.stringify({ error: "Processing failed." }), { status: 500 });
  }
});