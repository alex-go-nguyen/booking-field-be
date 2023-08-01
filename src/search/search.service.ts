import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  index<T>(index: string, body: T) {
    return this.elasticsearchService.index<T>({
      index,
      body,
    });
  }

  async search<T extends { id: string }>(index: string, query: string, fields: Array<Extract<keyof T, string>>) {
    const data = await this.elasticsearchService.search<T>({
      index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });

    const hits = data.hits.hits;
    return hits.map((item) => item._source.id);
  }
}
