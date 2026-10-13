const apiBaseUrl =
  process.env.DEPPI_API_URL ?? "https://deppi-api-3i98.onrender.com";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function forwardToApi(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  const targetUrl = `${apiBaseUrl.replace(/\/+$/, "")}/${encodedPath}${incomingUrl.search}`;
  const headers = new Headers();

  for (const headerName of ["accept", "authorization", "content-type"]) {
    const value = request.headers.get(headerName);
    if (value) headers.set(headerName, value);
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : await request.arrayBuffer(),
      cache: "no-store",
    });
    const responseHeaders = new Headers();

    for (const headerName of ["content-type", "content-disposition"]) {
      const value = upstream.headers.get(headerName);
      if (value) responseHeaders.set(headerName, value);
    }

    responseHeaders.set("Cache-Control", "no-store");

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Falha ao encaminhar ${request.method} /${encodedPath}:`, error);
    return Response.json(
      { mensagem: "Não foi possível conectar à API. Tente novamente." },
      { status: 502 },
    );
  }
}

export const GET = forwardToApi;
export const POST = forwardToApi;
export const PUT = forwardToApi;
export const PATCH = forwardToApi;
export const DELETE = forwardToApi;
export const HEAD = forwardToApi;
