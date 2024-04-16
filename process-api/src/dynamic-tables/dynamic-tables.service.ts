import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';

import { uniqBy } from 'lodash';
const DIRECTORY_PATH = './tables';

@Injectable()
export class DynamicTablesService {
  async createTable(
    table_name: string,
    columns: { name: string; type: string }[],
    ownerId: string,
  ) {
    const tablePath = `${DIRECTORY_PATH}/db_${table_name}.json`;

    if (fs.existsSync(tablePath)) {
      throw new InternalServerErrorException(
        `Table with name ${table_name} already exists!`,
      );
    }

    if (uniqBy(columns, 'name').length !== columns.length) {
      throw new InternalServerErrorException(
        `Cannot insert multiple columns with the same name`,
      );
    }
    const db = {
      schema: {
        table_name,
        ownerId,
        columns,
      },
      data: [],
    };

    try {
      fs.writeFileSync(tablePath, JSON.stringify(db));

      console.log(`Table '${table_name}' created successfully.`);
    } catch (e) {
      console.error(e);
    }

    return table_name;
  }

  async dropTable(tableName: string): Promise<string> {
    const tablePath = `${DIRECTORY_PATH}/db_${tableName}.json`;

    if (!fs.existsSync(tablePath)) {
      throw new InternalServerErrorException(
        `No table with the name ${tableName} exists.`,
      );
    }

    fs.rmSync(tablePath);

    return 'tablePath';
  }

  async getAllTables(): Promise<any[]> {
    const files = fs.readdirSync('./tables');

    return files.map((file) => {
      const buffer = fs.readFileSync(`${DIRECTORY_PATH}/${file}`, 'utf-8');

      const data = JSON.parse(buffer);

      return data;
    });
  }

  async getTablesByOwnerId(ownerId: string): Promise<any[]> {
    console.log('ownerId: ', ownerId);
    const files = fs.readdirSync('./tables');

    console.log(files);

    return files
      .filter((file) => file !== 'db_users.json')
      .map((file) => {
        const buffer = fs.readFileSync(`${DIRECTORY_PATH}/${file}`, 'utf-8');

        const data = JSON.parse(buffer);

        return data;
      })
      .filter((data) => data['schema']['ownerId'] === ownerId);
  }

  async getTable(tableName: string): Promise<any> {
    try {
      const tablePath = `${DIRECTORY_PATH}/db_${tableName}.json`;

      if (!fs.existsSync(tablePath)) {
        throw new NotFoundException(
          `Table with name ${tableName} does not exist.`,
        );
      }

      return await fs.readFileSync(tablePath, 'utf-8');
    } catch (error) {
      console.error('Error reading or parsing file:', error);
      return [];
    }
  }

  async insertRow(tableName: string, row: any): Promise<string> {
    try {
      const tablePath = `${DIRECTORY_PATH}/db_${tableName}.json`;

      if (!fs.existsSync(tablePath)) {
        throw new NotFoundException(
          `No table with the name ${tableName} exists.`,
        );
      }

      const fileData = await fs.readFileSync(tablePath, 'utf-8');
      const jsonData = JSON.parse(fileData);

      if (!jsonData) {
        throw new NotFoundException(
          `No table with the name ${tableName} exists.`,
        );
      }

      jsonData.data.push(row);

      fs.writeFileSync(tablePath, JSON.stringify(jsonData));

      console.log('Row successfully inserted');

      return 'success';
    } catch (error) {
      throw new Error(`Error reading or parsing file: ${error}`);
    }
  }
}
