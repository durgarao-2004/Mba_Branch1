'use client';

import { useEffect } from 'react';
import { useRecentlyViewed, RecentItem } from '@/hooks/useRecentlyViewed';

type Props = Omit<RecentItem, 'viewedAt'>;

/**
 * Drop this invisible component anywhere inside a lecture/subject page
 * to automatically record it in the Continue Learning tracker.
 *
 * Example (inside a lecture page):
 *   <TrackPageView
 *     type="lecture"
 *     title={lecture.title}
 *     href={`/subjects/${subjectSlug}/${lectureSlug}`}
 *     subjectName={subject.name}
 *     subjectIcon={subject.icon}
 *   />
 */
export default function TrackPageView(props: Props) {
  const { addItem } = useRecentlyViewed();

  useEffect(() => {
    addItem(props);
    // Only re-track when the URL changes, not on every re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.href]);

  return null;
}
