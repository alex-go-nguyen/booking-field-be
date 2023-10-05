import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let elasticsearchService: ElasticsearchService;

  const mockIndex = jest.fn();
  const mockSearch = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: ElasticsearchService,
          useValue: {
            index: mockIndex,
            search: mockSearch,
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    elasticsearchService = module.get<ElasticsearchService>(ElasticsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('index', () => {
    it('should call ElasticsearchService index method with the provided parameters', async () => {
      const index = 'test-index';
      const body = { id: 1, name: 'Test Document' };

      await service.index(index, body);

      expect(elasticsearchService.index).toHaveBeenCalledWith({
        index,
        body,
      });
    });
  });

  describe('search', () => {
    it('should call ElasticsearchService search method with the provided parameters and return IDs', async () => {
      const index = 'test-index';
      const query = 'test query';
      const fields: 'id'[] = ['id'];
      const searchResult = {
        hits: {
          hits: [{ _source: { id: 1 } }, { _source: { id: 2 } }, { _source: { id: 3 } }],
        },
      };

      mockSearch.mockResolvedValue(searchResult);

      const result = await service.search(index, query, fields);

      expect(elasticsearchService.search).toHaveBeenCalledWith({
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

      expect(result).toEqual([1, 2, 3]);
    });
  });
});
