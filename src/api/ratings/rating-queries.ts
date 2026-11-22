import { queryOptions, skipToken } from "@tanstack/react-query";
import { getMemberRatings } from "../members/get-member-ratings";

export const ratingQueries = {
  // memberId를 아직 모르면(로그인 전) skipToken으로 요청을 보내지 않는다.
  byMember: (memberId: number | null) =>
    queryOptions({
      queryKey: ["ratings", "member", memberId] as const,
      queryFn: memberId === null ? skipToken : () => getMemberRatings(memberId),
    }),
};
