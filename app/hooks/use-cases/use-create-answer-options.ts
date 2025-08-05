import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as zod from "zod";
import { useCreateAnswerOptions } from "../mutations/create/use-create-answer-options";
import { useState } from "react";
interface UseCreateAnswerOptionsUseCaseProps {
  question_id: string;
}
export function useCreateAnswerOptionsUseCase({
  question_id,
}: UseCreateAnswerOptionsUseCaseProps) {
  const router = useRouter();
  const formSchema = zod.object({
    answer: zod
      .string()
      .transform((val) => val.trim())
      .refine((val) => val === "" || val.length > 0, {
        message: "A resposta deve conter pelo menos 1 caractere se preenchida.",
      })
      .optional(),
    is_open_answer: zod.boolean(),
  });

  type schemaType = zod.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<schemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_open_answer: false,
    },
  });

  const { create, isLoading } = useCreateAnswerOptions({
    onSuccess: () => {
      reset();
      toast.success("Resposta criado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar resposta.");
    },
  });

  async function handleCreateAnswerOptions({
    answer,
    is_open_answer,
  }: schemaType) {
    const trimmedAnswer = answer?.trim() ?? "";

    if (is_open_answer && trimmedAnswer !== "") {
      toast.warning(
        "Se a resposta for preenchida, ela deve ser do tipo fechada."
      );
      return;
    }

    if (!is_open_answer && trimmedAnswer === "") {
      toast.warning("Respostas fechadas precisam de um valor.");
      return;
    }

    create({
      answer: answer ?? "",
      is_open_answer,
      question_id,
    });
  }
  return {
    handleCreateAnswerOptions,
    handleSubmit,
    register,
    errors,
    isLoading,
    control,
  };
}
