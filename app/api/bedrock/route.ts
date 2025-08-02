import { bedrockClient } from "@/lib/awsClient";
import { BedrockRuntimeClient,InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  const { prompt } = await req.json() as { prompt: string };
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
  const input = {
    modelId: process.env.BEDROCK_MODEL_ID!,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: `Human: ${prompt}\n\nAssistant:`,
      max_tokens_to_sample: 100,
    }),
  };

  try {
    const command = new InvokeModelCommand({
  modelId: process.env.BEDROCK_MODEL_ID!, // Must be passed like this
  contentType: "application/json",
  accept: "application/json",
  body: JSON.stringify({
    prompt: `Human: ${prompt}\n\nAssistant:`,
    max_tokens_to_sample: 100,
  }),
});

const response = await client.send(command);
const raw = await response.body.transformToString();
  const responseBody = await response.body.transformToString();
    const parsed = JSON.parse(responseBody);
    return NextResponse.json({ output: parsed.completion });
  } catch (error) {
    // Type-safe error handling
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
