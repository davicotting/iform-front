import { db } from "@/app/lib/firebase";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

export interface Form {
  id: string;
  title: string;
  descricao: string;
  ordem: number;
}

export function useFetchForms() {
  async function fetchForms(): Promise<Form[]> {
    const formQuery = query(collection(db, "formularios"), orderBy("ordem"));
    const snapshot = await getDocs(formQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Form, "id">),
    }));
  }

  const { data, isPending } = useQuery<Form[], Error>({
    queryFn: fetchForms,
    queryKey: [queryKeys.fetchFormsKey],
    staleTime: 1000 * 30, // 30 seconds
  });

  return {
    data,
    isPending,
  }
}
