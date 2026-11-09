import { backendClient } from "../backend-client";
import type { MemberRating } from "./models";

function getMemberRatings(memberId: number) {
  return backendClient.get(`members/${memberId}/ratings`).json<MemberRating[]>();
}

export { getMemberRatings };
