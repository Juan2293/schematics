import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

export class PostgresService {
    
  static async executeQuery<T>(query: string, params: string[] = []): Promise<T[]> {
    this.loadEnvVariables();
    const client = new Client({
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });

    try {
      await client.connect();
      const response = await client.query(query, params);
      return response.rows as T[]; 
    } catch (error) {
      throw error;
    } finally {
      await client.end(); // Cierra la conexión independientemente del resultado
    }
  }


   static loadEnvVariables(){
    const envPath = path.join(process.cwd(), '.env');
    dotenv.config({ path: envPath });
  }
}