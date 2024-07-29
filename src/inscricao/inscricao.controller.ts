import { Controller } from '@nestjs/common';
import { InscricaoService } from './inscricao.service';

@Controller('inscricao')
export class InscricaoController {
  constructor(private readonly inscricaoService: InscricaoService) {}
}
