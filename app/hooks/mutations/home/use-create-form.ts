import { db } from "@/app/lib/firebase";
import { MutationOptions } from "@/app/types/mutation-types";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore";

interface FormProps {
  title: string;
  description: string;
}

export function useCreateForm(options?: MutationOptions<void>) {
  const queryClient = useQueryClient();

  async function handleCreateForm({ description, title }: FormProps) {
    await addDoc(collection(db, "formularios"), {
      description,
      title,
      ordem: Math.floor(Math.random() * 1000),
    });
  }

  const { mutate, isPending } = useMutation<void, Error, FormProps>({
    mutationFn: handleCreateForm,
    onSuccess: () => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
      queryClient.invalidateQueries({
        queryKey: [queryKeys.fetchFormsKey],
      });
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(options.errorMessage || "Ocorreu um erro");
      }
      console.log(error);
    },
  });

  return {
    create: mutate,
    isLoading: isPending,
  };
}
