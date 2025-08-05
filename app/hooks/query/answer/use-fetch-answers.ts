import { db } from "@/app/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { queryKeys } from "@/lib/react-query/query-keys";

export interface AnswerOption {
  id: string; 
  firebaseId: string; 
  answer: string;
  is_open_answer: boolean;
  order: number;
  question_id: string;
}

export function useFetchAnswerOptions() {
  async function fetchAnswerOptions(): Promise<AnswerOption[]> {
    const answerOptionsRef = query(
      collection(db, "answer_options"),
      orderBy("order")
    );

    const snapshot = await getDocs(answerOptionsRef);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        firebaseId: doc.id,
        id: data.id,
        answer: data.answer,
        is_open_answer: data.is_open_answer,
        order: data.order,
        question_id: data.question_id,
      } as AnswerOption;
    });
  }

  const { data, isPending } = useQuery<AnswerOption[], Error>({
    queryKey: [queryKeys.fetchAnswerOptionsKey],
    queryFn: fetchAnswerOptions,
    staleTime: 1000 * 30, // 30 segundos
  });

  return {
    answerOptions: data,
    isLoading: isPending,
  };
}
