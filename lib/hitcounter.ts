import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface HitCounterProps {
  downstream: cdk.aws_lambda.IFunction;
}

export class HitCounter extends Construct {
  public readonly handler: cdk.aws_lambda.Function;
  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const table = new cdk.aws_dynamodb.Table(this, "Hits", {
      partitionKey: {
        name: "path",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.handler = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "HitCounterHandler",
      {
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        entry: "lambda/hitcounter.ts",
        handler: "handler",
        environment: {
          DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
          HITS_TABLE_NAME: table.tableName,
        },
      }
    );
    table.grantReadWriteData(this.handler);
  }
}
