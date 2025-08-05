"use client";
import { InputErrorMessage } from "@/components/input-errror-message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { Controller } from "react-hook-form";

import { useCreateOptionsAnswerQuestionsUseCase } from "@/app/hooks/use-cases/use-create-options-answer-questions-use-case";
import { useFetchQuestionsUseCase } from "@/app/hooks/use-cases/use-fetch-questions-by-id";
import { useFetchAnswersOptionsUseCase } from "@/app/hooks/use-cases/use-fetch-answers-use-case";

export default function AnswerOptionsLink() {
  const params = useParams();
  const idForm = params.idForm as string;

  const {
    errors,
    handleCreateOptionsAnswerQuestions,
    handleSubmit,
    isLoading,
    control,
  } = useCreateOptionsAnswerQuestionsUseCase();

  const { questions } = useFetchQuestionsUseCase({ idForm });
  const { answerOptions } = useFetchAnswersOptionsUseCase(idForm);

  return (
    <section className="h-screen w-full flex justify-center lg:items-center">
      <Card className="w-full lg:w-[400px] h-max lg:shadow lg:border">
        <CardHeader>
          <CardTitle className="text-xl">
            Vincular resposta a uma pergunta
          </CardTitle>
          <CardDescription>
            Escolha a resposta e a subpergunta que será exibida ao selecioná-la.
          </CardDescription>
          <CardAction />
        </CardHeader>

        <form onSubmit={handleSubmit(handleCreateOptionsAnswerQuestions)}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label>Escolha a pergunta que será exibida</Label>
              <Controller
                control={control}
                name="questionId"
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a subpergunta" />
                    </SelectTrigger>
                    <SelectContent>
                      {questions.map((question) => (
                        <SelectItem key={question.id} value={question.id}>
                          {question.title || "Sem título"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <InputErrorMessage message={errors.questionId?.message} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Escolha a resposta que dispara a pergunta</Label>
              <Controller
                control={control}
                name="answer_option_id"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a resposta" />
                    </SelectTrigger>
                    <SelectContent>
                      {answerOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.answer || "Sem texto"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <InputErrorMessage message={errors.answer_option_id?.message} />
            </div>
          </CardContent>

          <CardFooter className="mt-2.5 flex w-full justify-end">
            <Button type="submit" disabled={isLoading}>
              Pronto
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
