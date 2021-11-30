import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

export type DbConfig = {
    type: 'postgres',
    port: number,
    database: string,
    host: string,
    username: string,
    password: string,
    synchronize: boolean,
}

const {
    type, 
    port, 
    database, 
    host, 
    username, 
    password, 
    synchronize
} = config.get<DbConfig>('db');

export const typeORMConfig : TypeOrmModuleOptions  = {
    type,
    host,
    port,
    username,
    password,
    database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize,
}