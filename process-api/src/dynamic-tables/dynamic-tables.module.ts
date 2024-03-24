import { Module } from '@nestjs/common';
import { DynamicTablesController } from './dynamic-tables.controller';
import { DynamicTablesService } from './dynamic-tables.service';

@Module({
  imports: [],
  controllers: [DynamicTablesController],
  providers: [DynamicTablesService],
})
export class DynamicTablesApp {}
