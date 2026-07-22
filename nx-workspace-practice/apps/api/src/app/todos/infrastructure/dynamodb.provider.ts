import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DYNAMODB_CLIENT } from '../todos.constants';

/** Nest provider for the shared DynamoDBDocumentClient instance. */
export const documentClientFactory = {
  provide: DYNAMODB_CLIENT,
  useFactory: (): DynamoDBDocumentClient => {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION ?? 'local',
      endpoint: process.env.DYNAMODB_ENDPOINT ?? 'http://localhost:8000',
      // DynamoDB Local ignores these, but the SDK refuses to start without something set.
      credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local',
      },
    });

    // Todo items omit `description`/`deadline` when absent — without this the
    // doc client throws on `undefined` instead of just skipping the attribute.
    return DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
  },
};
