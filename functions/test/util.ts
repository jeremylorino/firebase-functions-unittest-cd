import * as admin from 'firebase-admin';

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const projectConfig = {
  projectId: serviceAccount.project_id,
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
};
process.env.FIREBASE_CONFIG = JSON.stringify(projectConfig);
process.env.GCLOUD_PROJECT = JSON.parse(process.env.FIREBASE_CONFIG).projectId;

export async function cleanupDocuments(objs: string[]) {
  if (objs.length === 0) {
    return true;
  }

  try {
    console.debug(`documents to cleanup: ${objs.length}`);
    if (admin.apps.length === 0) {
      admin.initializeApp();
    }
    const firestore = admin.firestore();
    const batch = firestore.batch();

    objs.map((doc) => batch.delete(doc));

    await batch.commit();

    console.debug(`successfully deleted: ${objs.length}`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getTestService() {
  const firebaseTestHarness = await require('firebase-functions-test')(projectConfig, process.env.GOOGLE_APPLICATION_CREDENTIALS);
  firebaseTestHarness._cleanup = firebaseTestHarness.cleanup;
  firebaseTestHarness.cleanup = function () {
    if (admin.apps.find(a => a.name === '[DEFAULT]')) {
      admin.app().delete();
    }
    return this._cleanup();
  };
  if (!admin.apps.find(a => a.name === '[DEFAULT]')) {
    admin.initializeApp(projectConfig);
  }
  return firebaseTestHarness;
}
