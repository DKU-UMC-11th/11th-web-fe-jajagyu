import type { Metadata } from "next";
import { MyInfoEditPage } from "../../../../views/my/my-info-edit-page";

export const metadata: Metadata = { title: "내 정보 수정" };

export default function Page() {
  return <MyInfoEditPage />;
}
