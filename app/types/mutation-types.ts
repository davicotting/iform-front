
export interface MutationOptions<T> {
    onSuccess?: (data?: T) => void;
    onError?: (message?: string) => void;
    errorMessage?: string;
}