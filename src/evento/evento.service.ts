import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import * as fs from 'fs/promises';
import { EventoDto } from './dto/evento.dto';

@Injectable()
export class EventoService {
    constructor (
        private readonly prisma: PrismaService,
    ) {}


    async create(eventoDto: EventoDto) {
        const {
            nome,
            descricao,
            local,
            status,
            imagem
        } = eventoDto;

        const quantidateHoras = parseInt(eventoDto.quantidateHoras.toString())
        const quantidadeVagas = parseInt(eventoDto.quantidadeVagas.toString())
        const dataInicio = new Date(eventoDto.dataInicio)
        const dataFim = new Date(eventoDto.dataFim)

        return await this.prisma.evento.create({
            data: {
                dataInicio,
                dataFim,
                nome,
                descricao,
                quantidateHoras, 
                quantidadeVagas, 
                local, 
                status: Status[status],
                imagem,
            }
        })
    }



    async getEventos(take: number, skip: number, searchString: string, orderBy: 'asc' | 'desc') {

        const eventos = await this.prisma.evento.findMany({
            take: take || undefined,
            skip: skip || undefined,
            where: {

            },
            orderBy: {
                nome: orderBy
            }
        });

        if (eventos.length > 0) {



            eventos.map(evento => {
                if (evento.imagem) {
                    evento.imagem = `${process.env.APP_URL}/${evento.imagem}`;
                }
            });
        }

        return eventos;
    }

    async getEventoById(id: number) {
        await this.exists(id);

        const evento = await this.prisma.evento.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                nome: true,
                descricao: true,
                dataInicio: true,
                dataFim: true,
                imagem: true,
                local: true,
            }
        })

        if(evento.imagem){
            evento.imagem = `${process.env.APP_URL}/${evento.imagem}`;
        } else {
            // await this.prisma.evento.update({
            //     where: {
            //         id
            //     },
            //     data: {
            //         imagem: null
            //     }
            // })

            evento.imagem = null;
        }

        return evento;
    }

    async getEventosCount() {
        return await this.prisma.evento.count()
    }

    async updateEvento(id: number, eventoDto: EventoDto) {
        await this.exists(id);

        const dataInicio = new Date(eventoDto.dataInicio)
        const dataFim = new Date(eventoDto.dataFim)

        return await this.prisma.evento.update({
            where: {
                id
            },
            data: {
                dataInicio,
                dataFim,
                ...eventoDto
            }
        })
    }

    async updateImagem(id: number, imagem: string) {
        await this.exists(id);

        return await this.prisma.evento.update({
            where: {
                id
            },
            data: {
                imagem
            }
        })
    }

    async deleteEvento(id: number) {
        const evento = await this.prisma.evento.findFirst({
            where: {
                id
            }
        })

        if(evento.imagem){
            try {
                await fs.unlink(`./assets/uploads/${evento.imagem}`)
            } catch (error) {
                throw new HttpException('Erro ao deletar arquivo', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        await this.prisma.evento.delete({
            where: {
                id
            }
        })

        return true;
    }


    async exists(id: number) {
        if (!
            (
                await this.prisma.evento.count({
                    where: {
                        id,
                    },
                })
        )
        ) {
            throw new HttpException(`O evento ${id} não existe.`, HttpStatus.NOT_FOUND);
        }
    }
}
