import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Lambda } from "@aws-sdk/client-lambda";
import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("request:", JSON.stringify(event, undefined, 2));

  const dynamo = new DynamoDB({});
  const lambda = new Lambda({});

  await dynamo.updateItem({
    TableName: process.env.HITS_TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: "ADD hits :incr",
    ExpressionAttributeValues: { ":incr": { N: "1" } },
  });

  const resp = await lambda.invoke({
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
    Payload: JSON.stringify(event),
  });

  console.log("downstream response:", JSON.stringify(resp, undefined, 2));

  if (!resp.Payload) {
    throw new Error("No Payload!");
  }
  return JSON.parse(new TextDecoder("utf-8").decode(resp.Payload));
};
