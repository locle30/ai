import { AppSettings, ExamDocument, LessonPlan, RepositoryItem, SharedWorkspace, SlidePresentation } from '../types';

/**
 * Encodes workspace data into a shareable URL hash string.
 * Allows instant, 100% reliable direct sharing without relying on any server container!
 */
export function encodeWorkspaceToHash(data: {
  settings: AppSettings;
  repository: RepositoryItem[];
  activeExam?: ExamDocument;
  activeLesson?: LessonPlan;
  activeSlides?: SlidePresentation;
}): string {
  try {
    const minified = {
      v: 1,
      s: data.settings,
      r: data.repository,
      e: data.activeExam,
      l: data.activeLesson,
      sl: data.activeSlides,
      t: Date.now(),
    };
    const jsonStr = JSON.stringify(minified);
    const b64 = btoa(encodeURIComponent(jsonStr));
    return b64;
  } catch (err) {
    console.error('Failed to encode workspace to hash', err);
    return '';
  }
}

/**
 * Decodes workspace data from a URL hash string.
 */
export function decodeWorkspaceFromHash(hashStr: string): Partial<SharedWorkspace> | null {
  try {
    const clean = hashStr.replace(/^#data=/, '').replace(/^#/, '');
    if (!clean) return null;
    const jsonStr = decodeURIComponent(atob(clean));
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.v) {
      return {
        publishedAt: new Date(parsed.t || Date.now()).toISOString(),
        settings: parsed.s,
        repository: parsed.r || [],
        activeExam: parsed.e,
        activeLesson: parsed.l,
        activeSlides: parsed.sl,
        version: parsed.v,
      };
    }
  } catch (err) {
    console.warn('Could not decode workspace from hash:', err);
  }
  return null;
}

/**
 * Exports the complete teacher workspace to a downloadable .json file.
 */
export function exportWorkspaceToFile(data: {
  settings: AppSettings;
  repository: RepositoryItem[];
  activeExam?: ExamDocument;
  activeLesson?: LessonPlan;
  activeSlides?: SlidePresentation;
}): void {
  const backup = {
    appName: 'TroLyAIGiaoVien',
    exportDate: new Date().toISOString(),
    teacher: data.settings.teacherName || 'Giáo viên',
    school: data.settings.schoolName || '',
    settings: data.settings,
    repository: data.repository,
    activeExam: data.activeExam,
    activeLesson: data.activeLesson,
    activeSlides: data.activeSlides,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (data.settings.teacherName || 'GiaoVien').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
  a.href = url;
  a.download = `Du_Lieu_Tro_Ly_GV_${safeName}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
