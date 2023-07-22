import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "HelloHandler",
      {
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        entry: "lambda/hello.ts",
        handler: "handler",
      }
    );

    new cdk.aws_apigateway.LambdaRestApi(this, "Endpoint", {
      handler: hello,
    });
  }
}
