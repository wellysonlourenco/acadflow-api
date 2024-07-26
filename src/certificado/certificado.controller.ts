import { Controller } from '@nestjs/common';
import { CertificadoService } from './certificado.service';

@Controller('certificado')
export class CertificadoController {
  constructor(private readonly certificadoService: CertificadoService) {}
}
