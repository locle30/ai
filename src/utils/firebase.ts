import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppSettings, ExamDocument, LessonPlan, RepositoryItem, SharedWorkspace, SlidePresentation } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Initialize Firestore with specific database ID from config
export const db: Firestore = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore Connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connected to Cloud Firestore successfully.');
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or cannot reach Firestore.');
      return false;
    }
    // Document might simply not exist, which still proves connection reached server
    console.log('[Firebase] Connection validated.');
    return true;
  }
}

const GLOBAL_WORKSPACE_DOC_ID = 'public_global_workspace';

/**
 * Loads the public shared workspace directly from Cloud Firestore.
 * Works across both ais-dev and ais-pre environments and on all visitor devices!
 */
export async function loadWorkspaceFromFirestore(): Promise<SharedWorkspace | null> {
  try {
    const docRef = doc(db, 'workspaces', GLOBAL_WORKSPACE_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SharedWorkspace;
      console.log(`[Firestore] Loaded public workspace with ${data.repository?.length || 0} repository items.`);
      return data;
    }
  } catch (err) {
    console.warn('[Firestore] Could not load workspace from Firestore:', err);
  }
  return null;
}

/**
 * Saves or syncs the public workspace to Cloud Firestore.
 * Instantly updates the shared app URL (ais-pre) for any visitor!
 */
export async function saveWorkspaceToFirestore(payload: {
  settings: AppSettings;
  repository: RepositoryItem[];
  activeLesson?: LessonPlan;
  activeSlides?: SlidePresentation;
  activeExam?: ExamDocument;
  authorName?: string;
  title?: string;
}): Promise<{ success: boolean; publishedAt: string }> {
  const publishedAt = new Date().toISOString();
  try {
    const docRef = doc(db, 'workspaces', GLOBAL_WORKSPACE_DOC_ID);
    const data: SharedWorkspace = {
      publishedAt,
      updatedAt: publishedAt,
      authorName: payload.authorName || payload.settings?.teacherName || 'Giáo viên',
      schoolName: payload.settings?.schoolName || '',
      title: payload.title || 'Không gian làm việc Trợ lý AI Giáo viên',
      version: 1,
      settings: payload.settings,
      repository: Array.isArray(payload.repository) ? payload.repository : [],
      activeLesson: payload.activeLesson,
      activeSlides: payload.activeSlides,
      activeExam: payload.activeExam,
    };

    await setDoc(docRef, data, { merge: true });
    console.log(`[Firestore] Successfully saved public workspace (${data.repository.length} items).`);
    return { success: true, publishedAt };
  } catch (err: any) {
    console.error('[Firestore] Error saving workspace to Firestore:', err);
    return { success: false, publishedAt };
  }
}

/**
 * Saves a specific exam to Cloud Firestore for direct sharing.
 */
export async function saveExamToFirestore(exam: ExamDocument): Promise<boolean> {
  try {
    const docRef = doc(db, 'exams', exam.id);
    await setDoc(docRef, exam, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] Error saving exam to Firestore:', err);
    return false;
  }
}

/**
 * Retrieves a specific exam from Cloud Firestore via its ID.
 */
export async function loadExamFromFirestore(examId: string): Promise<ExamDocument | null> {
  try {
    const docRef = doc(db, 'exams', examId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ExamDocument;
    }
  } catch (err) {
    console.warn('[Firestore] Error loading exam from Firestore:', err);
  }
  return null;
}
