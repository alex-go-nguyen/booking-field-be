export interface SuccessResponse {
  status: string;
  code: number;
  message: string;
  data: object | Array<any> | any;
  request: {
    url: string;
    method: string;
  };
}

export type ErrorResponse = {
  status: string;
  code: number;
  message: string;
  error: object | Array<any> | any;
  request: {
    url: string;
    method: string;
  };
};
