import { Status } from "@prisma/client";

export class EventoDto {
    nome: string;
    descricao: string
    dataInicio: Date
    dataFim: Date
    quantidateHoras: number
    quantidadeVagas: number
    local: string
    status: Status
    imagem: string
}