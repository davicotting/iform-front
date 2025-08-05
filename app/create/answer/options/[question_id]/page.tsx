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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useCreateAnswerOptionsUseCase } from "@/app/hooks/use-cases/use-create-answer-options";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller } from "react-hook-form";

export default function AnswerOptions() {
  const params = useParams();

  const question_id = params.question_id as string;

  console.log(question_id);

  const {
    handleCreateAnswerOptions,
    handleSubmit,
    register,
    errors,
    isLoading,
    control,
  } = useCreateAnswerOptionsUseCase({ question_id });

  return (
    <section className="h-screen w-full flex justify-center lg:items-center">
      <Card className="w-full lg:w-[400px] h-max lg:shadow lg:border">
        <CardHeader>
          <CardTitle className="text-xl">Criar novo formulário</CardTitle>
          <CardDescription>
            Defina título e descrição para iniciar a configuração do seu
            formulário.
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(handleCreateAnswerOptions)}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Resposta</Label>
              <Input
                {...register("answer")}
                placeholder="Ex: Muito satisfeito"
              />
              <InputErrorMessage message={errors.answer?.message} />
            </div>

            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="is_open_answer"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    id="is_open_answer"
                    checked={value}
                    onCheckedChange={onChange}
                  />
                )}
              />
              <Label htmlFor="is_open_answer">É uma pergunta aberta?</Label>
            </div>
          </CardContent>
          <CardFooter className="mt-2.5 flex w-full justify-end">
            <Button disabled={isLoading}>Adicionar</Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
