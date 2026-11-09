interface CheckResponse {
  available: boolean;
}

interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

// 6주차 서버의 공통 응답 형식
interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

export type { CheckResponse, MemberRating, SignupRequest, SignupResponse };
