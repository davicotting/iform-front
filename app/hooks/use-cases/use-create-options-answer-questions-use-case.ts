import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as zod from "zod";
import { useCreateOptionsAnswerQuestions } from "../mutations/create/use-create-options-answer-questions";
export function useCreateOptionsAnswerQuestionsUseCase() {
  const formSchema = zod.object({
    answer_option_id: zod.uuid(),
    questionId: zod.uuid(),
  });

  type schemaType = zod.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<schemaType>({
    resolver: zodResolver(formSchema),
  });

  const { create, isLoading } = useCreateOptionsAnswerQuestions({
    onSuccess: () => {
      reset();
      toast.success("Link entre pergunta e resposta criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao linkar.");
    },
  });

  async function handleCreateOptionsAnswerQuestions({
    answer_option_id,
    questionId,
  }: schemaType) {
    create({
      answer_option_id,
      questionId,
    });
  }
  return {
    handleCreateOptionsAnswerQuestions,
    handleSubmit,
    register,
    errors,
    isLoading,
    control
  };
}
