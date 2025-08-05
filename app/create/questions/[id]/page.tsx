"use client";
import {
  Question,
  useFetchQuestions,
} from "@/app/hooks/query/questions/use-fetch-questions-by-id";
import { useCreateQuestionsUseCase } from "@/app/hooks/use-cases/use-create-questions-use-case";
import { useFetchQuestionsUseCase } from "@/app/hooks/use-cases/use-fetch-questions-by-id";
import { db } from "@/app/lib/firebase";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Check, ClipboardPlus, CloudCheck, Smile } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

export default function Questions() {
  const params = useParams();

  const idForm = params.id as string;

  const {
    register,
    errors,
    handleCreateQuestion,
    handleSubmit,
    isLoading,
    control,
    isSubmitted,
    handleUserInitQuestionCreation,
    isCreating,
  } = useCreateQuestionsUseCase({
    idForm,
  });

  const { questions, loading } = useFetchQuestionsUseCase({ idForm });

  console.log(questions);

  return (
    <section className="h-screen w-full flex items-center justify-center">
      <main className="flex gap-2 flex-col lg:flex-row w-full items-start justify-center">
        <Card className="w-full lg:w-[400px] h-max shadow-none ">
          <CardHeader>
            <CardTitle className="text-xl">Criar nova Pergunta</CardTitle>
            <CardDescription>
              Adicione um anova pergunta ao formulário.
            </CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <form onSubmit={handleSubmit(handleCreateQuestion)}>
            <CardContent className="flex flex-col gap-2">
              <section className="border lg:px-4 py-2 px-1 rounded-xl flex items-center justify-between text-xs lg:text-base ">
                Nova pergunta
                <Button
                  onClick={handleUserInitQuestionCreation}
                  disabled={isCreating}
                >
                  <ClipboardPlus />
                </Button>
              </section>
              {isCreating && (
                <section className="border px-4 py-2 rounded-xl flex flex-col">
                  <div className="flex flex-col gap-2">
                    <Label>Título</Label>
                    <Input
                      {...register("title")}
                      placeholder="Ex: Pesquisa de Satisfação"
                    />
                    <InputErrorMessage
                      message={isSubmitted ? errors.title?.message : ""}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>É um campo obrigatório?</Label>
                    <Controller
                      control={control}
                      name="isRequired"
                      render={({ field: { onChange, value } }) => (
                        <Checkbox checked={value} onCheckedChange={onChange} />
                      )}
                    />

                    <InputErrorMessage
                      message={isSubmitted ? errors.isRequired?.message : ""}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Orientação de resposta</Label>
                    <Input
                      {...register("orientationAnswer")}
                      placeholder="Ex: Responda de acordo com..."
                    />
                    <InputErrorMessage
                      message={
                        isSubmitted ? errors.orientationAnswer?.message : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Tipo de pergunta</Label>
                    <Controller
                      control={control}
                      name="questionType"
                      render={({ field: { value, onChange } }) => (
                        <Select onValueChange={onChange} value={value}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecione o tipo de pergunta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sim_Não">Sim / Não</SelectItem>
                            <SelectItem value="multipla_escolha">
                              Múltipla Escolha
                            </SelectItem>
                            <SelectItem value="unica_escolha">
                              Única Escolha
                            </SelectItem>
                            <SelectItem value="texto_livre">
                              Texto Livre
                            </SelectItem>
                            <SelectItem value="Inteiro">
                              Número Inteiro
                            </SelectItem>
                            <SelectItem value="Numero com duas casa decimais">
                              Número com duas casas decimais
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <InputErrorMessage
                      message={isSubmitted ? errors.questionType?.message : ""}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Código</Label>
                    <Input {...register("code")} placeholder="Ex: Q1" />
                    <InputErrorMessage
                      message={isSubmitted ? errors.code?.message : ""}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>É uma sub-pergunta?</Label>
                    <Controller
                      control={control}
                      name="subQuestion"
                      render={({ field: { onChange, value } }) => (
                        <Checkbox checked={value} onCheckedChange={onChange} />
                      )}
                    />

                    <InputErrorMessage
                      message={isSubmitted ? errors.subQuestion?.message : ""}
                    />
                  </div>
                </section>
              )}
            </CardContent>
            <CardFooter className="mt-2.5 flex w-full justify-end">
              <Button disabled={isLoading} type={"submit"}>
                Pronto
              </Button>
            </CardFooter>
          </form>
        </Card>
        <aside className="flex flex-col lg:h-[300px] lg:overflow-y-auto w-full lg:w-[400px] gap-2">
          {questions && questions.length > 0 ? (
            questions.map((question) => (
              <Link
                href={`/create/answer/options/${question.id}`}
                key={question.id}
              >
                <Card className="">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>{question.title}</CardTitle>
                    <Check className="text-green-500" />
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <Card>
              <CardHeader className="flex items-center justify-between">
                <h1>Crie pergutas e elas aparecerao aqui</h1>
                <Smile className="text-yellow-500"/>
              </CardHeader>
            </Card>
          )}
        </aside>
      </main>
    </section>
  );
}
