import { db } from "@/app/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore";
import { MutationOptions } from "@/app/types/mutation-types";
import { queryKeys } from "@/lib/react-query/query-keys";

interface CreateOptionsAnswerQuestionsProps{
  answer_option_id: string;
  questionId: string;
}

export function useCreateOptionsAnswerQuestions(options?: MutationOptions<void>) {
  async function handleCreateRelation({
    answer_option_id,
    questionId,
  }: CreateOptionsAnswerQuestionsProps) {
    await addDoc(collection(db, "opcoes_resposta_pergunta"), {
      id: crypto.randomUUID(),
      id_opcao_resposta: answer_option_id,
      id_pergunta: questionId,
    });
  }

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: handleCreateRelation,
    onSuccess: () => {
      if (options?.onSuccess) {
        options.onSuccess();
        queryClient.invalidateQueries({
          queryKey: [queryKeys.fetchQuestionsKey],
        });
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(options.errorMessage || "Erro ao criar vínculo.");
        console.error(error);
      }
    },
  });

  return {
    create: mutate,
    isLoading: isPending,
  };
}
