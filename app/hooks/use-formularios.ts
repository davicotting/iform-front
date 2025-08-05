import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

export interface Formulario {
  id: string;
  title: string;
  descricao: string;
  ordem: number;
}

export function useForms() {
  const [forms, setForms] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); 

  useEffect(() => {
    const formQuery = query(
      collection(db, "formularios"),
      orderBy("ordem")
    );

    const unsubscribe = onSnapshot(
      formQuery,
      (snapshot) => {
        const data: Formulario[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Formulario, "id">),
        }));

        setForms(data);
        setLoading(false);
      },
      (err) => {
        console.error("Erro no snapshot:", err);
        setError(err); 
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { forms, loading, error };
}
