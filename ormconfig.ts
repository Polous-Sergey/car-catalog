import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [
        'src/modules/**/*.entity{.ts,.js}',
    ],
    migrations: [
        'src/migrations/*{.ts,.js}',
    ],
};
