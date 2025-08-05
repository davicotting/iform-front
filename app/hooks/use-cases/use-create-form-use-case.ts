import { db } from "@/app/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as zod from "zod";
import { useCreateForm } from "../mutations/create/use-create-form";
export function useCreateFormUseCase() {
  const router = useRouter();
  const formSchema = zod.object({
    title: zod
      .string()
      .min(3, "O título deve ter no mínimo 3 caracteres.")
      .max(100, "O título deve ter no máximo 100 caracteres."),
    description: zod
      .string()
      .min(10, "A descrição deve ter no mínimo 10 caracteres.")
      .max(500, "A descrição deve ter no máximo 500 caracteres."),
  });

  type schemaType = zod.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<schemaType>({
    resolver: zodResolver(formSchema),
  });

  const { create, isLoading } = useCreateForm({
    onSuccess: () => {
      reset();
      toast.success("Fórmulário criado com sucesso!");
      router.push("/");
    },
    onError: () => {
      toast.error("Erro ao criar formulario.");
    },
  });

  async function handleCreateForm({ title, description }: schemaType) {
    create({
      description,
      title,
    });
  }
  return {
    handleCreateForm,
    handleSubmit,
    register,
    errors,
    isLoading
  };
}
