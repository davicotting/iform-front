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
  where,
} from "firebase/firestore";

interface OpcaoRespostaProps {
  question_id: string;
  answer: string;
  is_open_answer: boolean;
}

export function useCreateAnswerOptions(options?: MutationOptions<void>) {
  const queryClient = useQueryClient();

  async function getNextAnswerOptionOrder(
    question_id: string
  ): Promise<number> {
    const q = query(
      collection(db, "answer_options"),
      where("question_id", "==", question_id),
      orderBy("order", "desc")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 1;
    }

    const maxOrder = snapshot.docs[0].data().order;
    return maxOrder + 1;
  }

  async function handleCreateAnswerOptions({
    answer,
    is_open_answer,
    question_id,
  }: OpcaoRespostaProps) {
    const nextOrder = await getNextAnswerOptionOrder(question_id);
    await addDoc(collection(db, "answer_options"), {
      answer,
      is_open_answer,
      order: nextOrder,
      question_id,
      id: crypto.randomUUID(),
    });
  }

  const { mutate, isPending } = useMutation<void, Error, OpcaoRespostaProps>({
    mutationFn: handleCreateAnswerOptions,
    onSuccess: () => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
      queryClient.invalidateQueries({
        queryKey: [queryKeys.fetchAnswerOptionsKey],
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
