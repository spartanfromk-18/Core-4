import { 
  doc, 
  getDoc, 
  setDoc
} from 'firebase/firestore';
import { collections } from './config';
import type { UserProgress } from '../data/schemas/collections';

// User Progress Handlers
export const getUserProgress = async (uid: string) => {
  const docRef = doc(collections.user_progress, uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
};

export const initUserProgress = async (uid: string) => {
  const docRef = doc(collections.user_progress, uid);
  const defaultProgress: UserProgress = {
    uid,
    score_history: {}
  };
  await setDoc(docRef, defaultProgress);
};

export const updateUserProgress = async (uid: string, data: Partial<UserProgress>) => {
  const docRef = doc(collections.user_progress, uid);
  // Remember: firestore rules block updating 'verified_score' and 'admin_notes'
  await setDoc(docRef, data, { merge: true });
};
