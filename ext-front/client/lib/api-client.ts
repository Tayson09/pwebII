export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiErrorBody = {
  mensagem?: string;
  message?: string;
  error?: string;
  msg?: string;
};

type ApiRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  authenticated?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { authenticated = true, headers: requestHeaders, ...requestOptions } =
    options;
  const headers = new Headers(requestHeaders);
  const isFormData =
    typeof FormData !== "undefined" && requestOptions.body instanceof FormData;

  if (requestOptions.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated && typeof window !== "undefined") {
    const token = sessionStorage.getItem("deppi.token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`/api/${path.replace(/^\/+/, "")}`, {
    ...requestOptions,
    headers,
    cache: "no-store",
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (
      typeof window !== "undefined" &&
      (response.status === 401 || response.status === 403)
    ) {
      window.dispatchEvent(
        new CustomEvent("deppi:api-error", {
          detail: { status: response.status },
        }),
      );
    }

    const errorBody =
      body && typeof body === "object" ? (body as ApiErrorBody) : undefined;
    const message =
      errorBody?.mensagem ??
      errorBody?.message ??
      errorBody?.error ??
      errorBody?.msg ??
      "Ocorreu um erro ao comunicar com o servidor.";

    throw new ApiError(message, response.status);
  }

  return body as T;
}
