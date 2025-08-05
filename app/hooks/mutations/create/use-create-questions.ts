import { db } from "@/app/lib/firebase";
import { useMutation } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { MutationOptions } from "@/app/types/mutation-types";
enum QuestionType {
  YES_OR_NO = "Sim_Não",
  MULTIPLE_CHOICE = "multipla_escolha",
  SINGLE_CHOICE = "unica_escolha",
  TEXT = "texto_livre",
  INTEGER = "Inteiro",
  DECIMAL = "Numero com duas casa decimais",
}
interface QuestionProps {
  idForm: string;
  title: string;
  orientationAnswer: string;
  isRequired: boolean;
  questionType: QuestionType;
  subQuestion: boolean;
  code: string;
}

export function useCreateQuestions(options?: MutationOptions<void>) {
  async function getNextFormOrder(idForm: string): Promise<number> {
    const q = query(
      collection(db, "perguntas"),
      where("idForm", "==", idForm),
      orderBy("order", "desc")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 1;
    }

    const maxOrder = snapshot.docs[0].data().order;
    return maxOrder + 1;
  }

  async function handleCreateForm({
    code,
    idForm,
    isRequired,
    orientationAnswer,
    questionType,
    subQuestion,
    title,
  }: QuestionProps) {
    const nextOrder = await getNextFormOrder(idForm);
    const normalizeCode = code.trim().toUpperCase();
    await addDoc(collection(db, "perguntas"), {
      id: crypto.randomUUID(),
      code: normalizeCode,
      idForm,
      isRequired,
      order: nextOrder,
      orientationAnswer,
      questionType,
      subQuestion,
      title,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleCreateForm,
    onSuccess: () => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: () => {
      if (options?.onError) {
        options.onError(options.errorMessage || "Ocorreu um erro.");
      }
    },
  });

  return {
    create: mutate,
    isLoading: isPending,
  };
}
