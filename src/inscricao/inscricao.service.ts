import { CertificadoService } from '@/certificado/certificado.service';
import { EventoService } from '@/evento/evento.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsuarioService } from '@/usuario/usuario.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from "crypto";
import { InscricaoDto } from './dto/inscricao.dto';

@Injectable()
export class InscricaoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usuarioService: UsuarioService,
        private readonly eventoService: EventoService,
        private readonly certificadoService: CertificadoService,
    ) { }


    async create(inscricaoDto: InscricaoDto) {
        const { usuarioId, eventoId } = inscricaoDto;

        await this.usuarioService.exists(usuarioId);
        await this.eventoService.exists(eventoId);

        const numero = usuarioId + crypto.randomBytes(6).toString('hex') + eventoId;

        try {
            const inscricao = await this.prisma.inscricao.create({
                data: {
                    usuarioId,
                    eventoId,
                    numero,
                },
            });


            await this.certificadoService.create(inscricao.id, null);

            return inscricao;

            
        } catch (error) {
            console.error('Erro ao criar inscrição:', error);
            throw new HttpException('Erro ao criar inscrição', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async findByid (id: number) {
        await this.exists(id);
        
        const inscricao = await this.prisma.inscricao.findUnique({
            where: {
                id,
            },
        });

        return inscricao;
    }

    async findInscriptionsByUser (usuarioId: number, take: number, skip: number, orderBy: 'asc' | 'desc') {
        await this.usuarioService.exists(usuarioId);

        const inscricoes = await this.prisma.inscricao.findMany({
            take: take || undefined,
            skip: skip || undefined,
            where: {
                usuarioId,
            },
            orderBy: {
                id: orderBy,
            }
        });

        return inscricoes;
    }

    async findInscriptionsByEvent (eventoId: number, take: number, skip: number, orderBy: 'asc' | 'desc') {
        await this.eventoService.exists(eventoId);

        const inscricoes = await this.prisma.inscricao.findMany({
            take: take || undefined,
            skip: skip || undefined,
            where: {
                eventoId,
            },
            orderBy: {
                id: orderBy,
            }
        });

        return inscricoes;
    }



    async exists(id: number) {
        if (!
            (
                await this.prisma.inscricao.count({
                    where: {
                        id,
                    },
                })
        )
        ) {
            throw new HttpException(`A inscricao ${id} não existe.`, HttpStatus.NOT_FOUND);
        }
    }




}