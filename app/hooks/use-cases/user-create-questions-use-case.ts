import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateQuestions } from "../mutations/create/use-create-questions";
import { toast } from "sonner";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

enum QuestionType {
  YES_OR_NO = "Sim_Não",
  MULTIPLE_CHOICE = "multipla_escolha",
  SINGLE_CHOICE = "unica_escolha",
  TEXT = "texto_livre",
  INTEGER = "Inteiro",
  DECIMAL = "Numero com duas casa decimais",
}

interface useCreateQuestionsUseCaseProps {
  idForm: string;
}

export function useCreateQuestionsUseCase({
  idForm,
}: useCreateQuestionsUseCaseProps) {
  const formSchema = zod.object({
    title: zod
      .string()
      .min(3, "O título deve ter no mínimo 3 caracteres.")
      .max(100, "O título deve ter no máximo 100 caracteres."),
    orientationAnswer: zod
      .string()
      .min(10, "A descrição deve ter no mínimo 10 caracteres.")
      .max(500, "A descrição deve ter no máximo 500 caracteres."),
    isRequired: zod.boolean(),
    questionType: zod.enum(QuestionType),
    subQuestion: zod.boolean(),
    code: zod
      .string()
      .min(3, "O código deve ter no mínimo 3 caracteres.")
      .max(50, "O código deve ter no máximo 50 caracteres.")
      .regex(/^[A-Z0-9_]+$/, "Use letras maiúsculas, números e underscores."),
  });

  type schemaType = zod.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<schemaType>({
    resolver: zodResolver(formSchema),
  });

  const { create, isLoading } = useCreateQuestions({
    onSuccess: () => {
      reset();
      toast.success("Pergunta criado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar pergunta.");
    },
  });

  async function isCodeDuplicate(
    code: string,
    idForm: string
  ): Promise<boolean> {
    const q = query(
      collection(db, "perguntas"),
      where("idForm", "==", idForm),
      where("code", "==", code)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  async function handleCreateQuestion({
    title,
    orientationAnswer,
    isRequired,
    questionType,
    subQuestion,
    code,
  }: schemaType) {
    const exists = await isCodeDuplicate(code, idForm);

    if (exists) {
      toast.error("Já existe uma pergunta com esse código neste formulário.");
      return;
    }

    create({
      title,
      orientationAnswer,
      isRequired,
      questionType,
      idForm,
      subQuestion,
      code,
    });
  }
  return {
    handleCreateQuestion,
    handleSubmit,
    register,
    errors,
    isLoading,
    control
  };
}
