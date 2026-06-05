import { Lecture } from '@/types';
import fs from 'fs';
import path from 'path';

export function getLecture(subjectSlug: string, lectureSlug: string): Lecture | null {
  try {
    const filePath = path.join(
      process.cwd(),
      'content',
      'subjects',
      subjectSlug,
      'lectures',
      `${lectureSlug}.json`
    );
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Lecture;
  } catch {
    return null;
  }
}

export function getAllLectureSlugs(): { subject: string; lecture: string }[] {
  const contentDir = path.join(process.cwd(), 'content', 'subjects');
  const params: { subject: string; lecture: string }[] = [];

  try {
    const subjects = fs.readdirSync(contentDir);
    for (const subject of subjects) {
      const lecturesDir = path.join(contentDir, subject, 'lectures');
      if (fs.existsSync(lecturesDir)) {
        const files = fs.readdirSync(lecturesDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            params.push({ subject, lecture: file.replace('.json', '') });
          }
        }
      }
    }
  } catch {
    // return empty if content dir doesn't exist
  }

  return params;
}
