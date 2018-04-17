import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { RpcOperationStatus, IPubSubRpcOperation } from "./util";
import { UserRecord } from 'firebase-functions/lib/providers/auth';

export interface ICreateUserRpc {
  status: RpcOperationStatus;
  executionId: string;
  user: IPubSubRpcOperation;
  email: IPubSubRpcOperation;
}
export interface ICreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone: string | null;
}

export async function createUser(request: ICreateUserRequest): Promise<UserRecord> {
  try {
    return await admin.auth().createUser({
      email: request.email,
      emailVerified: false,
      password: request.password,
      displayName: request.name,
      disabled: false
    });
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      const userRecord = await admin.auth().getUserByEmail(request.email);
      return admin.auth().updateUser(userRecord.uid, {
        email: request.email,
        emailVerified: false,
        password: request.password,
        displayName: request.name,
        disabled: false
      });
    }

    throw err;
  }
  // auth/email-already-exists
}

export const userCreate = functions.auth.user()
  .onCreate((user, context) => {
    const db = admin.firestore();
    return db.runTransaction(async (transaction) => {
      const userId = db.doc(`user/${user.uid}`);
      transaction.set(userId, {
        displayName: user.displayName,
        email: user.email,
        phone: user.phoneNumber || ''
      });

      const uacId = db.doc(`user_access_control/${user.uid}`);
      transaction.set(uacId, {
        permissions: {}
      });

      return {
        userId,
        uacId
      };
    });
  });
export const userDelete = functions.auth.user()
  .onDelete((user, context) => {
    const db = admin.firestore();
    return db.runTransaction(async (transaction) => {
      const userId = db.doc(`user/${user.uid}`);
      transaction.delete(userId);

      const uacId = db.doc(`user_access_control/${user.uid}`);
      transaction.delete(uacId);

      return {
        userId,
        uacId
      };
    });
  });
