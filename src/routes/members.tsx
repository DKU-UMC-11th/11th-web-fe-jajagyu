import { createFileRoute } from "@tanstack/react-router";
import { MemberCheckPage } from "../pages/members/member-check-page";

export const Route = createFileRoute("/members")({
  component: MemberCheckPage,
});
