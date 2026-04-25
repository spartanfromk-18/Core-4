# Product Requirements Document (PRD)

## Project Name
**Unsmart: A Professional Way of Smart Study**

## 1. Executive Summary
Unsmart is an advanced academic intelligence platform designed to reverse-engineer examination patterns. By aggregating Past Year Questions (PYQs) and integrating Vertex AI semantic searches alongside Gemini 1.5 Pro, the system grades answers and generates "Topper-style" study strategies tailored to specific university syllabi.

## 2. Core Objectives
1. **Syllabus Integration (AKTU Focus)**
   - Strict mapping to DB schemas matching APJ Abdul Kalam Technical University (AKTU) marking schemes.
   - Dynamic weightage distribution for chapters based on historical frequency.
2. **Gemini 1.5 Logic Tracing**
   - Provide highly contextualized gap analysis on student answer sheets using Gemini 1.5 Pro.
   - Trace logical errors vs factual errors in student engineering submissions.
3. **Topper-Style Answer Generation**
   - Synthesize perfectly written, maximum-score mock answers adhering to the exact rubric of the targeted university.
   - Emphasize formatting (bullet points, diagram markers, 32-page horizontal continuity).

## 3. Scope & Milestones
*   **Phase 1:** Environment Scaffolding & Security Architecture (Firestore Rules).
*   **Phase 2:** Vertex AI & Embeddings Integration (Cloud Run hooks).
*   **Phase 3:** React Interface & Glassmorphism Dashboard routing.
*   **Phase 4:** Live System Validation & CodeRabbit Review Cycle.
