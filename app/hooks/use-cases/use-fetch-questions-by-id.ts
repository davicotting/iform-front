import { useFetchQuestions } from "../query/questions/use-fetch-questions-by-id";

interface useFetchFormsUseCaseProps {
  idForm: string;
}

export function useFetchQuestionsUseCase({ idForm }: useFetchFormsUseCaseProps) {
  const { data, isPending } = useFetchQuestions(idForm);

  return { questions: data || [], loading: isPending };
}
