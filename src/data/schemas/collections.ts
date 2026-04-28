// -----------------------------------------------------------------------------
// Core-4 Firestore Collection Schemas
// -----------------------------------------------------------------------------

/**
 * Collection: `universities`
 * Security: READ: public (authenticated), WRITE: admin only
 * Purpose: Global read-only reference store.
 */
export interface University {
  university_id: string; // e.g., 'DU_2024'
  exam_pattern: Record<string, number>; // structured JSON of weightage per topic
  topper_ids: string[]; // references to answer-sheet docs in Cloud Storage
  pattern_vector: number[]; // 768-dim embedding float array for semantic similarity
}

/**
 * Sub-Collection: `university_patterns` (Nested under universities)
 * Security: READ: authenticated, WRITE: admin only
 */
export interface UniversityPattern {
  patternId: string;
  weightage_map: Record<string, unknown>;
  marking_scheme: unknown;
}

/**
 * Collection: `pyq_database`
 * Security: READ: authenticated, WRITE: admin only
 * Important: The critical field is `embedding` which Vertex AI Vector Search indexes.
 */
export interface PYQDocument {
  question_id: string;      // Keyed by {university_id}_{subject}_{year}_{q_number}
  embedding: number[];      // 768-dimensional Gemini embedding vector
  subject: string;
  year: number | string;
  answer_pdf_url: string;   // Signed Cloud Storage URL for topper answer PDF
}

/**
 * Collection: `user_progress`
 * Security: READ: owner/admin, CREATE/UPDATE: owner, DELETE: admin
 * Security Exceptions: Updates cannot affect 'verified_score' or 'admin_notes'
 */
export interface UserProgress {
  uid: string;              // Direct mapping to Firebase Auth uid
  score_history: Record<string, number>;
  verified_score?: number;  // Only writable by Admin backend systems
  admin_notes?: string;     // Only writable by Admin backend systems
}

/**
 * Sub-Collection: `sessions` (Nested under user_progress)
 * Security: Owner/Admin Full Access
 */
export interface SessionRecord {
  sessionId: string;
  timestamp: string;
  active_duration: number;
}

/**
 * Sub-Collection: `weak_topics` (Nested under user_progress)
 * Security: Owner/Admin Full Access
 */
export interface WeakTopic {
  topic_name: string;
  severity: number;    // E.g., scale of 1-10
  last_evaluated: string;
}
