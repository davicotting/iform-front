import { useFetchForms } from "../query/home/use-fetch-forms";

export function useFetchFormsUseCase() {
  const { data, isPending } = useFetchForms()

  console.log(data)
  
  return { forms: data || [], loading: isPending  };
}
