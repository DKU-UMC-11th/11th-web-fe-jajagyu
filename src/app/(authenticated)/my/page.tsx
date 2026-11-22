import type { Metadata } from "next";
import { MyInfoPage } from "../../../views/my/my-info-page";

export const metadata: Metadata = { title: "마이페이지" };

export default function Page() {
  return <MyInfoPage />;
}
