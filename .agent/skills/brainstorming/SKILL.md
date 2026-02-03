---
name: brainstorming
description: Facilitates a Socratic design refinement process for the "Pharmacy" Dual-User System (Patient + Pharmacist). Enforces Brownfield constraints and Clinical Safety.
---
# Brainstorming & Planning (DeepFlow v3.0)

**Source:** [Superpowers Framework](https://github.com/obra/superpowers) enhanced for DeepFlow Clinical Intelligence.

This skill enforces a "Research-First, Code-Second" methodology. You must act as a Senior Clinical Product Lead, balancing **Patient UX**  with **Pharmacist Efficiency** (Kanban-style), while respecting the **Existing Codebase**.

## When to Use This Skill
- The user mentions building a new feature or add content (e.g., "Add Travel Clinic").
- The user asks to "optimize" or "improve" an existing flow.
- Trigger keywords: "plan", "spec", "architecture", "think", "competitor".

## The Workflow

### Phase 1: Context & Constraint Check (Crucial)
**Goal:** Understand the "Brownfield" reality before speaking.
1.  **Scan the Codebase:** Look at `src/` first. Does a component already exist? Do not reinvent `FloatingInput` or `Button`.
2.  **Verify the "Immutable Foundation":** Consult `.agent/knowledge/project-master-vision.md` (Section 0). Ensure you are NOT proposing to rewrite working Auth or Dashboard logic.
3.  **Tech Check:** Confirm the solution fits **Vite + React + Supabase**. (No Next.js/Server Actions).

### Phase 2: The "Dual-User" Interview
**Goal:** Tease out the spec for *both* sides of the equation.
1.  **Stop.** Do not write code yet.
2.  **Ask "The Mirror Question":**
    * *Patient Side:* "How does the patient submit this data effortlessly?"
    * *Pharmacist Side:* "**Who receives this?** How does the Pharmacist approve it? Does it need a new card in the 'Clinical Queue'?"
3.  **Clinical Triage:** "If the patient answers 'Yes' to a risk factor (e.g., Heart Disease), what happens? Auto-reject or Flag for Pharmacist?"

### Phase 3: The Spec & Architecture (Validation)
**Goal:** Present a design that covers the full data lifecycle.
1.  **The UI Wireframe:**
    * *Patient View:* Glassmorphism, Framer Motion.
    * *Pharmacist View:* High-density, utilitarian, "Cockpit" style.
2.  **The Data Flow (Supabase):**
    * Which table stores this? (`profiles`, `biomarkers`, `orders`).
    * **Security:** Define the RLS Policy (e.g., `pharmacist_role` can UPDATE, `patient` can only READ).

### Phase 4: The Artifact
**Goal:** Create a "Source of Truth" for the coder.
1.  Save to `specs/current-task.md`.
2.  Include:
    * **User Story** (Both Patient & Pharmacist).
    * **Database Schema Changes** (SQL).
    * **RLS Policies** (Security).
    * **Component Tree** (Where does it fit in `src/`?).

## Instructions for the Agent
* **Respect the Base:** If a feature exists in `src/pages/DashboardPage.tsx`, extend it. Do not create `src/pages/NewDashboard.tsx`.
* **Think Security:** Since we are Client-Side (Vite), always specify *how* Supabase RLS protects the data.
* **Be Skeptical:** If a flow seems clinically unsafe (e.g., auto-dispensing meds without approval), flag it immediately.