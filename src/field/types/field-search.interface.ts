export interface FieldSearchBody {
  id: string;
  name: string;
  description: string;
  province: string;
  district: string;
}

export interface FieldSearchResult {
  hits: {
    total: number;
    hits: Array<{ _source: FieldSearchBody }>;
  };
}
