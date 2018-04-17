import 'mocha';
import * as should from 'should';
import * as faker from 'faker';
import * as admin from 'firebase-admin';
import { RpcOperationStatus } from '../src/util';
import { getTestService } from './util';

describe('PubSub', () => {
  const userData = {
    "data": {
      "name": `user name ${new Date().toJSON()}`,
      "email": `func-unittest-${new Date().getTime()}@test.com`,
      "phone": "",
      "password": faker.internet.password()
    },
    "status": RpcOperationStatus.pending
  };
  const emailData = {
    "data": {
      "email": userData.data.email,
      "name": userData.data.name,
      "invitedBy": "user/SystemAdministrator",
      "continueUrl": "http://localhost:4200"
    },
    "status": RpcOperationStatus.pending
  };
  const messageData = {
    "executionId": "invite/b4gYtTiDyCoRJjT6sWpz",
    "status": RpcOperationStatus.processing,
    "user": userData,
    "email": emailData
  };
  let test, db, myFunctions;

  before(async () => {
    myFunctions = require('../src/index');
    test = await getTestService();
    db = admin.firestore();
  });

  after(() => {
    test.cleanup();
  });

  describe('onPublish', () => {
    describe('createUser', () => {
      let message, wrapped, createdUser;

      beforeEach(() => {
        message = test.pubsub.makeMessage(messageData, { method: 'createUser' });
        wrapped = test.wrap(myFunctions.processPubsubMessage);
      });

      after(async () => {
        await admin.auth().deleteUser(createdUser.uid);
      });

      it('should fail to create firebase user', async () => {
        const data = { ...message.json };
        data.user.data.password = "";
        message = test.pubsub.makeMessage(data, { method: 'createUser' });
        should(wrapped(message)).rejectedWith('The password must be a string with at least 6 characters.');
        should(admin.auth().getUserByEmail(data.user.data.email)).rejectedWith({ code: 'auth/user-not-found' });
      }).timeout(5 * 1000);

      it('should create firebase user', async () => {
        const result = await wrapped(message);

        should(result).have.propertyByPath(...'user.status'.split('.')).be.equal(RpcOperationStatus.complete);
        [
          'user.data',
          'user.data.uid',
          'user.data.email',
          'user.data.emailVerified',
          'user.data.disabled',
          'user.data.metadata',
          'user.data.passwordHash',
          'user.data.providerData'
        ]
          .map(p => p.split('.'))
          .forEach(p => should(result).have.propertyByPath(...p));
        [
          'email.data',
          'email.data.email',
          'email.data.name',
          'email.data.invitedBy',
          'email.data.continueUrl',
          'email.data.password'
        ]
          .map(p => p.split('.'))
          .forEach(p => should(result).have.propertyByPath(...p));
        should(result).have.propertyByPath(...'email.data.password'.split('.'))
          .and.equals(messageData.user.data.password);

        createdUser = await admin.auth().getUserByEmail(message.json.user.data.email);
        should(createdUser).have.properties({
          email: message.json.user.data.email,
          emailVerified: false,
          disabled: false
        });
      }).timeout(10 * 1000);

      it('should update existing firebase user', async () => {
        const data = { ...message.json };
        data.user.data.name = faker.helpers.userCard().name;
        message = test.pubsub.makeMessage(data, { method: 'createUser' });
        const result = await wrapped(message);

        should(result).have.propertyByPath(...'user.status'.split('.')).be.equal(RpcOperationStatus.complete);
        should(result).have.propertyByPath(...'email.data.password'.split('.'))
          .and.equals(messageData.user.data.password);

        const userInfo = await admin.auth().getUserByEmail(message.json.user.data.email);
        should(userInfo).have.properties({
          uid: createdUser.uid,
          metadata: createdUser.metadata,
          displayName: data.user.data.name
        });
      }).timeout(10 * 1000);
    });
  });
});