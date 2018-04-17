import * as functions from 'firebase-functions';
import { PubsubHandler } from './util';

const PUBSUB_QUEUE_TOPIC_NAME = 'message-queue';

export const processPubsubMessage = functions.pubsub.topic(PUBSUB_QUEUE_TOPIC_NAME)
  .onPublish(async (message, context) => {
    const attributes = message.attributes;
    let data;

    try {
      data = message.json;
    }
    catch (e) {
      console.error('PubSub message was not JSON', e);
      return Promise.resolve();
    }

    return PubsubHandler[attributes.method](data, attributes);
  });
