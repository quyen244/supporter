import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import AuthForm from "@/components/AuthForm";
import { googleEnabled } from "@/lib/auth";

export default function DangKy() {
  return (
    <AuthCard
      heading="Tạo tài khoản giáo viên"
      sub="Mỗi giáo viên có sổ riêng, không ai thấy học viên của người khác."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-semibold text-sage-700 hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      <AuthForm mode="signup" next="/" google={googleEnabled} />
    </AuthCard>
  );
}
