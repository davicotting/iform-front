import { db } from "@/app/lib/firebase";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

enum QuestionType {
  YES_OR_NO = "Sim_Não",
  MULTIPLE_CHOICE = "multipla_escolha",
  SINGLE_CHOICE = "unica_escolha",
  TEXT = "texto_livre",
  INTEGER = "Inteiro",
  DECIMAL = "Numero com duas casa decimais",
}

export interface Question {
  code: string;
  id: string;
  idForm: string;
  isRequired: boolean;
  order: number;
  orientationAnswer: string;
  questionType: QuestionType;
  subQuestion: boolean;
  title: string;
}

export function useFetchQuestions(idForm: string) {
  async function fetchQuestions(): Promise<Question[]> {
    const formQuery = query(
      collection(db, "perguntas"),
      where("idForm", "==", idForm),
      orderBy("order", "asc")
    );

    const snapshot = await getDocs(formQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Question, "id">),
    }));
  }

  const { data, isPending } = useQuery<Question[], Error>({
    queryFn: fetchQuestions,
    queryKey: [queryKeys.fetchQuestionsKey, idForm],
    staleTime: 1000 * 30, // 30 seconds
  });

  return {
    data,
    isPending,
  };
}
