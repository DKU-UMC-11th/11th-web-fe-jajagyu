// 6주차부터 서버가 성공/실패를 같은 틀로 감싸서 내려준다.
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
