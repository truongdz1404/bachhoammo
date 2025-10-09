import { auth } from "@/auth";
import { proxyRouteHandler } from "@/lib/api-proxy";

async function proxyRequest(req: Request) {
  const session = await auth();
  const accessToken = session?.accessToken;

  const url = new URL(req.url);
  const target = `${process.env.API_BASE_URL}${url.pathname}${url.search}`;

  return proxyRouteHandler(req, {
    requestUrl: target,
    bearerToken: accessToken,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
