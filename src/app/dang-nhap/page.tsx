import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import AuthForm from "@/components/AuthForm";
import { googleEnabled } from "@/lib/auth";

export default async function DangNhap({ searchParams }: { searchParams: Promise<{ tiep?: string }> }) {
  const { tiep } = await searchParams;
  const next = tiep?.startsWith("/") && !tiep.startsWith("//") ? tiep : "/";

  return (
    <AuthCard
      heading="Chào mừng trở lại"
      sub="Đăng nhập bằng email để vào sổ nhận xét của bạn."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="font-semibold text-sage-700 hover:underline">
            Đăng ký
          </Link>
        </>
      }
    >
      <AuthForm mode="signin" next={next} google={googleEnabled} />
    </AuthCard>
  );
}
