export const apiClient = fetch;

export const parseJson = async <T>(response: Response): Promise<Result<T>> => {
  try {
    const data = await response.json();

    if (response.ok) {
      return {
        ok: true,
        data,
      };
    }

    return {
      ok: false,
      error: data?.title,
      detail: data?.detail,
    };
  } catch {
    return {
      ok: false,
      error: response.status.toString(),
    };
  }
};

export interface Result<T> {
  ok: boolean;
  data?: T;
  error?: string;
  detail?: string;
}

export const jsonHeaders = {
  "Content-Type": "application/json",
};

export const postInit = {
  method: "POST",
  headers: jsonHeaders,
};

export const patchInit = {
  method: "PATCH",
  headers: jsonHeaders,
};
