import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth";
import { requestOpenai } from "../../common";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[OpenAI Route] params ", params);

  // log Request content
  req.clone().json()
    .then((reqBody: any) => {
      console.log("[reqBody]\n", JSON.stringify(reqBody));
    })
    .catch((error: any) => {
      console.error("Error occurred while parsing request body: ", error);
    });

  const authResult = auth(req);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    return await requestOpenai(req);
  } catch (e) {
    console.error("[OpenAI] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
