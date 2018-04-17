import 'mocha';
import * as should from 'should';
import * as admin from 'firebase-admin';
import * as faker from 'faker';
import { getTestService, cleanupDocuments } from './util';
import { UserRecord } from 'firebase-functions/lib/providers/auth';

describe('FirebaseAuthUser', () => {
  let test, myFunctions;
  const createdDocuments = [];
  const expectedCreatedDocumentsCount = 2;

  before(async () => {
    myFunctions = require('../src/index');
    test = await getTestService();
  });

  after(async () => {
    await cleanupDocuments(createdDocuments);
    test.cleanup();
  });

  describe('onCreate', () => {
    it('should create firestore user documents', async () => {
      const fakeUser = faker.helpers.userCard();
      const userInfo: UserRecord = test.auth.exampleUserRecord();
      userInfo.metadata.lastSignInTime = null;
      userInfo.displayName = fakeUser.name;
      userInfo.email = fakeUser.email;
      userInfo.disabled = false;
      userInfo.emailVerified = false;

      const wrapped = test.wrap(myFunctions.userCreate);

      const result = await wrapped(userInfo);

      const { userId, uacId } = result;
      createdDocuments.push(userId, uacId);


      const user = await userId.get();
      should(user.data()).have.properties({
        email: userInfo.email,
        phone: userInfo.phoneNumber || '',
        displayName: userInfo.displayName,
      });

      const uac = await uacId.get();
      should(uac.data()).have.properties({
        permissions: {}
      });
    });
  });

  describe('verify results', function () {
    it('created all expected docs', async () => {
      should(createdDocuments.length).be.Number().equal(expectedCreatedDocumentsCount);
    });
  });
});
