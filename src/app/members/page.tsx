import type { Metadata } from "next";
import { MemberCheckPage } from "../../views/members/member-check-page";

export const metadata: Metadata = { title: "회원 확인" };

export default function Page() {
  return <MemberCheckPage />;
}
