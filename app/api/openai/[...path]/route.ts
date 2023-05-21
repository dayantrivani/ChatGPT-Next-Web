import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth";
import { requestOpenai } from "../../common";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[OpenAI Route] params ", params);
  const reqA = req.clone();
  let reqBody;
  if (reqA.body) {
    reqBody = await reqA.json();
  }  
  console.log("[reqBody] \n", JSON.stringify(reqBody, null, 2));

  const authResult = auth(req);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    const response = await requestOpenai(req);
    return Promise.all([logResponse(response), response]);
  } catch (e) {
    console.error("[OpenAI] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

async function logResponse(response: any) {
  let resBody;
  if (response) {
    resBody = await response.clone().text();
  }
  console.log("[resBody] \n", resBody);
}
export const GET = handle;
export const POST = handle;

export const runtime = "edge";
