import { CertificadoDto } from "@/certificado/dto/certificado.dto";

export class InscricaoDto {
    numeroInscricao?: string;
    usuarioId: number;
    eventoId: number;
    certificado: CertificadoDto;
}