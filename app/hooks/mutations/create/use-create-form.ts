import { db } from "@/app/lib/firebase";
import { MutationOptions } from "@/app/types/mutation-types";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

interface FormProps {
  title: string;
  description: string;
}

export function useCreateForm(options?: MutationOptions<void>) {
  const queryClient = useQueryClient();

  async function getNextFormOrder(): Promise<number> {
    const q = query(collection(db, "formularios"), orderBy("order", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 1;
    }

    const maxOrder = snapshot.docs[0].data().order;
    return maxOrder + 1;
  }

  async function handleCreateForm({ description, title }: FormProps) {
    const nextOrder = await getNextFormOrder();
    await addDoc(collection(db, "formularios"), {
      description,
      title,
      order: nextOrder,
      id: crypto.randomUUID(),
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
        options.onError(options.errorMessage || "Ocorreu um erro.");
      }
      console.log(error);
    },
  });

  return {
    create: mutate,
    isLoading: isPending,
  };
}
