import { CertificadoDto } from "@/certificado/dto/certificado.dto";

export class InscricaoDto {
    numero?: string;
    usuarioId: number;
    eventoId: number;
    certificado: CertificadoDto;
}