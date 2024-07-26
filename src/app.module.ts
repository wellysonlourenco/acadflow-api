import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envSchema } from './env';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { EventoModule } from './evento/evento.module';
import { CertificadoModule } from './certificado/certificado.module';
import { ParticipanteModule } from './participante/participante.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/assets/uploads/avatar'),
    }),
    MailerModule.forRoot({
      transport: {
        host: envSchema.parse(process.env).MAIL_HOST,
        port: envSchema.parse(process.env).MAIL_PORT,
        secure: false,
        auth: {
          user: envSchema.parse(process.env).MAIL_USER,
          pass: envSchema.parse(process.env).MAIL_PASSWORD,
        }
      },
      defaults: {
        from: envSchema.parse(process.env).DEFAULT_MAIL_FROM,
      },
      template: {
        dir: join(__dirname, '..', '/templates/mail'),
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    PrismaModule,
    UsuarioModule,
    AuthModule,
    EventoModule,
    CertificadoModule,
    ParticipanteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
