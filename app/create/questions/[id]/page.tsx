"use client";
import { useCreateFormUseCase } from "@/app/hooks/use-cases/use-create-form-use-case";
import { useCreateQuestionsUseCase } from "@/app/hooks/use-cases/user-create-questions-use-case";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller } from "react-hook-form";

export default function Questions() {
  const params = useParams();
  const [isCreating, setIsCreating] = useState(false);

  const idForm = params.id as string;

  const {
    register,
    errors,
    handleCreateQuestion,
    handleSubmit,
    isLoading,
    control,
  } = useCreateQuestionsUseCase({
    idForm,
  });

  function handleUserInitQuestionCreation() {
    setIsCreating(true);
    console.log(isCreating);
  }

  return (
    <section className="h-screen w-full flex justify-center lg:items-center">
      <Card className="w-full lg:w-[400px] h-max border-0 shadow-none lg:shadow lg:border">
        <CardHeader>
          <CardTitle className="text-xl">Criar nova Pergunta</CardTitle>
          <CardDescription>
            Adicione um anova pergunta ao formulário.
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(handleCreateQuestion)}>
          <CardContent className="flex flex-col gap-2">
            <section className="border px-4 py-2 rounded-xl flex items-center justify-between">
              Nova pergunta
              <Button onClick={handleUserInitQuestionCreation}>
                <ClipboardPlus />
              </Button>
            </section>
            {isCreating && (
              <section className="border px-4 py-2 rounded-xl flex  flex-col">
                <div className="flex flex-col gap-2">
                  <Label>Título</Label>
                  <Input
                    {...register("title")}
                    placeholder="Ex: Pesquisa de Satisfação"
                  />
                  <InputErrorMessage message={errors.title?.message} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>É um campo obrigatório</Label>
                  <Controller
                    control={control}
                    name="isRequired"
                    render={({ field: { onChange, value } }) => (
                      <Checkbox checked={value} onChange={onChange} />
                    )}
                  />

                  <InputErrorMessage message={errors.isRequired?.message} />
                </div>
              </section>
            )}
            mapear perguntas ja criadas
          </CardContent>
          <CardFooter className="mt-2.5 flex w-full justify-end">
            <Button disabled={isLoading}>Pronto</Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
