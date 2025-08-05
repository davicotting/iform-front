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
import { Textarea } from "@/components/ui/textarea";
import { useCreateFormUseCase } from "@/app/hooks/use-cases/use-create-form-use-case";

export default function Home() {
  const { handleCreateForm, handleSubmit, register, errors, isLoading } =
    useCreateFormUseCase();

  return (
    <section className="h-screen w-full flex justify-center lg:items-center">
      <Card className="w-full lg:w-[400px] h-max border-0 shadow-none lg:shadow lg:border">
        <CardHeader>
          <CardTitle className="text-xl">Criar novo formulário</CardTitle>
          <CardDescription>
            Defina título e descrição para iniciar a configuração do seu
            formulário.
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(handleCreateForm)}>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label>Título</Label>
              <Input
                {...register("title")}
                placeholder="Ex: Pesquisa de Satisfação"
              />
              <InputErrorMessage message={errors.title?.message} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Descrição</Label>
              <Textarea
                className="resize-none"
                placeholder="Ex: Informe aqui o propósito ou instruções do formulário."
                {...register("description")}
              />
            </div>
            <InputErrorMessage message={errors.description?.message} />
          </CardContent>
          <CardFooter className="mt-2.5 flex w-full justify-end">
            <Button disabled={isLoading}>Pronto</Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
