import { NextRequest, NextResponse } from "next/server";
import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inputText = body.inputText;

    if (!inputText) {
      return NextResponse.json({ error: "Missing inputText" }, { status: 400 });
    }

    const client = new SageMakerRuntimeClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const payload = {
      text: inputText,
    };

    const command = new InvokeEndpointCommand({
      EndpointName: process.env.SAGEMAKER_ENDPOINT!,
      ContentType: "application/json",
      Body: Buffer.from(JSON.stringify(payload)),
    });

    const response = await client.send(command);
    const raw = await response.Body.transformToString(); // SDK v3
    const prediction = JSON.parse(raw);

    return NextResponse.json({ prediction });
  } catch (err: any) {
    console.error("SageMaker error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
