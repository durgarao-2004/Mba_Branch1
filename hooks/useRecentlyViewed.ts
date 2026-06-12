'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RecentItem {
  type: 'lecture' | 'subject' | 'case-study';
  title: string;
  href: string;
  subjectName?: string;
  subjectIcon?: string;
  viewedAt: number;
}

const STORAGE_KEY = 'mba_recently_viewed';
const MAX_ITEMS   = 5;

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  // Read from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as RecentItem[]);
    } catch {
      // ignore parse errors
    }
  }, []);

  const addItem = useCallback((item: Omit<RecentItem, 'viewedAt'>) => {
    setItems((prev) => {
      // De-duplicate by href, put newest first
      const deduped  = prev.filter((i) => i.href !== item.href);
      const updated  = [{ ...item, viewedAt: Date.now() }, ...deduped].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore quota errors
      }
      return updated;
    });
  }, []);

  return { items, addItem };
}
