import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";
import type { MemberRating } from "../members/models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

// 요청 어디에도 memberId가 없다. 서버가 토큰에서 누구인지 알아낸다.
export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<ApiResponse<MemberRating>>();
}

export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<MemberRating>>();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
