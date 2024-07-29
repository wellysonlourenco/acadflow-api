import { CertificadoModule } from '@/certificado/certificado.module';
import { CertificadoService } from '@/certificado/certificado.service';
import { EventoService } from '@/evento/evento.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsuarioService } from '@/usuario/usuario.service';
import { Module } from '@nestjs/common';
import { InscricaoController } from './inscricao.controller';
import { InscricaoService } from './inscricao.service';

@Module({
  imports: [CertificadoModule],
  controllers: [InscricaoController],
  providers: [InscricaoService,UsuarioService, EventoService ,CertificadoService, PrismaService ],
})
export class InscricaoModule {}
