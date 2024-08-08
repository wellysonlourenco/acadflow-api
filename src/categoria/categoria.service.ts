import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriaService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(descricao: string) {
        return await this.prisma.categoria.create({
            data: {
                descricao
            }
        })
    }

}
