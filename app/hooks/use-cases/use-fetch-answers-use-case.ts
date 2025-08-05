import { useFetchAnswerOptions } from "../query/answer/use-fetch-answers";
import { useFetchQuestionsUseCase } from "./use-fetch-questions-by-id";

export function useFetchAnswersOptionsUseCase(formId: string) {
  const { questions, loading: loadingQuestions } = useFetchQuestionsUseCase({ idForm: formId });
  const { answerOptions, isLoading: loadingAnswers } = useFetchAnswerOptions();

  const questionIds = questions.map((q) => q.id);

  const filteredAnswerOptions = answerOptions?.filter((option) =>
    questionIds.includes(option.question_id)
  ) ?? [];

  return {
    answerOptions: filteredAnswerOptions,
    loading: loadingQuestions || loadingAnswers,
  };
}
