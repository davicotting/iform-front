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

import { ListOrdered, PlusSquare } from "lucide-react";
import Link from "next/link";

import { useForms } from "./hooks/use-formularios";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { forms } = useForms();

  

  return (
    <section className="h-screen w-full flex  flex-col">
      <header className="mb-3">
        <h1 className="text-4xl font-bold tracking-tighter">
          Meus Formulários
        </h1>
      </header>

      <main className="grid lg:grid-cols-4 gap-6">
        <Link
          href="/create/form"
          className="w-full flex flex-col border items-center justify-center p-6 rounded-xl hover:bg-muted-foreground/10 font-semibold "
        >
          <PlusSquare className="text-blue-500" />
          <p>Criar Formulário</p>
        </Link>

        {forms.map((form) => (
          <Card className="w-full h-max shadow-none " key={form.id}>
            <CardHeader>
              <div>
                <Badge>
                  <ListOrdered />
                  {form.ordem}
                </Badge>
              </div>
              <CardTitle className="text-xl">{form.title}</CardTitle>
              <CardDescription className="truncate">
                {form.descricao}
              </CardDescription>
              <CardAction></CardAction>
            </CardHeader>

            <CardFooter className="mt-2.5 flex w-full justify-end gap-2">
              <Button variant={"secondary"}>Criar campos</Button>
              <Button>Link do fomulário</Button>
            </CardFooter>
          </Card>
        ))}
      </main>
    </section>
  );
}
