import { useAuthStore } from "@/app/lib/store/authStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ("PEGAWAI" | "DIVISI_SDM" | "ADMIN")[];
}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user && !allowedRoles.includes(user.role)) {
      router.replace("/unauthorized");
    }
  }, [mounted, user, allowedRoles, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}