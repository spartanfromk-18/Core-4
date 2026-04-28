import { useState, useEffect } from 'react';
import { getUserProgress, updateUserProgress } from '../firebase/firestore';
import type { UserProgress } from '../data/schemas/collections';

export const useProgress = (uid: string | undefined) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    let isMounted = true;
    getUserProgress(uid).then((data) => {
      if (isMounted && data) {
        setProgress(data as UserProgress);
      }
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [uid]);

  const updateProgress = async (newData: Partial<UserProgress>) => {
    if (!uid) return;
    await updateUserProgress(uid, newData);
    setProgress((prev) => prev ? { ...prev, ...newData } : null);
  };

  return { progress, loading, updateProgress };
};
