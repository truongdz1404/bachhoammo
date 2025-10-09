export const apiClient = fetch;

export const parseJson = async <T>(response: Response): Promise<Result<T>> => {
  try {
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      error: data?.title,
    };
  } catch {
    return {
      success: false,
      error: response.status.toString(),
    };
  }
};

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}
