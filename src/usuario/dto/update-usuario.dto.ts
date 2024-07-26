import { Perfil } from "@prisma/client";

export class UpdateUsuarioDto{
    nome: string;
    email: string;
    perfil: Perfil
    senha: string;
}