import { Controller } from '@nestjs/common';
import { ParticipanteService } from './participante.service';

@Controller('participante')
export class ParticipanteController {
  constructor(private readonly participanteService: ParticipanteService) {}
}
