import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { DynamicTablesService } from './dynamic-tables.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('dynamic-tables')
export class DynamicTablesController {
  constructor(private readonly dynamicTablesService: DynamicTablesService) {}

  @Post('create')
  async createTable(
    @Body()
    {
      table_name,
      columns,
      ownerId,
    }: {
      table_name: string;
      ownerId: string;
      columns: { name: string; type: string }[];
    },
  ): Promise<string> {
    return await this.dynamicTablesService.createTable(
      table_name,
      columns,
      ownerId,
    );
  }

  @Post('drop/:tableName')
  async dropTable(@Param('tableName') tableName: string): Promise<string> {
    return await this.dynamicTablesService.dropTable(tableName);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTables(): Promise<any[]> {
    return this.dynamicTablesService.getAllTables();
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all/:ownerId')
  async getTablesByOwnerId(@Param('ownerId') ownerId: string): Promise<any[]> {
    return this.dynamicTablesService.getTablesByOwnerId(ownerId);
  }

  @Get(':tableName')
  async getTableRows(@Param('tableName') tableName: string): Promise<any> {
    return this.dynamicTablesService.getTable(tableName);
  }

  @Post('insert/:tableName')
  async insertRow(
    @Param('tableName') tableName: string,
    @Body()
    {
      entry,
    }: {
      entry: any;
    },
  ): Promise<string | void> {
    return await this.dynamicTablesService.insertRow(tableName, entry);
  }
  //   @Post('insert/:tableName')
  //   async insertRow(
  //     @Param('tableName') tableName: string,
  //     @Body() rowData: any,
  //   ): Promise<void> {
  //     await this.dynamicTablesService.insertRow(tableName, rowData);
  //   }

  //   @Get(':tableName')
  //   async getTableData(@Param('tableName') tableName: string): Promise<any[]> {
  //     return this.dynamicTablesService.getTableData(tableName);
  //   }
}
