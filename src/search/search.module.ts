import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTIC_NODE'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService],
  exports: [ElasticsearchModule, SearchService],
})
export class SearchModule {}
