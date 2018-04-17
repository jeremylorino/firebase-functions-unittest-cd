import * as PubSub from '@google-cloud/pubsub';
import { createUser, ICreateUserRpc } from '../firebaseUser';

const pubsub = PubSub();

export enum RpcOperationStatus {
  pending = 'pending',
  processing = 'processing',
  complete = 'complete'
}
export interface IPubSubRpcOperation {
  data: any;
  status: RpcOperationStatus;
}

export class PubsubHandler {
  topicName: string;
  topic: PubSub.Topic;
  publisher: PubSub.Publisher;

  constructor(topicName: string) {
    this.topicName = topicName;
    this.topic = pubsub.topic(this.topicName);
    this.publisher = this.topic.publisher({
      batching: {
        maxMilliseconds: 100,
      }
    });
  }

  publish(data: any, attributes: { [key: string]: string }) {
    return this.publisher.publish(new Buffer(JSON.stringify(data)), attributes);
  }

  static async createUser(request: ICreateUserRpc) {
    const userInfo = await createUser(request.user.data);
    request.email.data.password = request.user.data.password;
    request.user.data = userInfo.toJSON();
    request.user.status = RpcOperationStatus.complete;
    request.status = RpcOperationStatus.processing;

    // await updateInvite(request.executionId, request);

    return request;
  }
}
