# DeepFlow Engineering & Design Constitution

## 1. The "Immutable Base" Rule (Project Reality)
**STATUS: BROWNFIELD / EXISTING CODEBASE**
We are working on a live, functioning **Vite + React** application.
* **The Codebase is Truth:** Check `src/` before suggesting new libraries.
* **Consistency:** Use existing patterns (e.g., `FloatingInput` for forms, `SlickMotion` for animations).
* **SEO Mandate:** Since this is an SPA (Single Page App), every public page **MUST** use `<Helmet>` to inject meta tags.

---

## 2. The Tech Stack (Strict Constraints)
**Based on the actual `src/` directory:**

### **Core Architecture**
* **Framework:** Vite + React 18 (SPA).
* **Language:** TypeScript (`.tsx` / `.ts`).
* **Routing:** `react-router-dom` (Client-Side).
* **Build Tool:** Vite (Fast HMR).

### **Data & State**
* **Server State:** TanStack Query (`@tanstack/react-query`) - *Use for all API/Supabase calls.*
* **Global UI State:** React Context (e.g., `BookingModalContext`).
* **Form State:** `react-hook-form` + `zod` (Validation schemas are mandatory).

### **SEO & Performance (Critical)**
* **Meta Tags:** `react-helmet-async`.
* **Strategy:** Every page component (e.g., `WeightLossPage.tsx`) must return a `<Helmet>` block with `title`, `description`, and `canonical` tags.
* **Loading:** Use `React.lazy()` and `Suspense` for dashboard routes to keep the landing page bundle small.

### **Backend & Security**
* **Client:** `@supabase/supabase-js`.
* **Auth:** Supabase Auth (Phone/Email).
* **Security Rule:** **NEVER TRUST THE CLIENT.**
    * Logic like "Is User a Pharmacist?" must be enforced by **Postgres RLS Policies**, not just UI hiding.
    * Use Edge Functions for sensitive operations (e.g., sending emails via Resend).

---

## 3. Visual & UX Standards ("AntiGravity")

### **A. Physics-Based Motion**
* **Engine:** `framer-motion`.
* **The "DeepFlow" Feel:** Spring physics (stiffness: 300, damping: 30). No linear animations.
* **Pattern:** Use the custom `<SlickMotion>` wrapper where possible.

### **B. Glassmorphism & Theme**
* **Palette:** "Deep Eucalyptus" (Variables in `index.css`).
* **Surface:** `backdrop-blur-md` + `border-white/20`.
* **Interaction:** All cards must have hover lift (`scale: 1.02`) and shadow deepening.

---

## 4. Forbidden Patterns (The "Anti-Hallucination" List)
* **❌ NO Next.js:** Do not use `next/image`, `next/link`, `getServerSideProps`, or `use server`.
* **❌ NO Raw CSS:** Always use Tailwind utility classes.
* **❌ NO Process.env:** Use `import.meta.env.VITE_...` for environment variables.
* **❌ NO Unprotected Writes:** Never write to the database without an authenticated user session.