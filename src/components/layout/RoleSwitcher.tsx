"use client";

import { useTranslations } from "next-intl";
import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import type { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const roles: UserRole[] = ["public", "candidate", "recruiter", "admin"];

export function RoleSwitcher() {
  const t = useTranslations("roles");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const { role, user, isAuthenticated, setRole, logout } = useDemoAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
        <UserCircle className="h-4 w-4" />
        <span className="hidden max-w-[160px] truncate sm:inline">
          {isAuthenticated && user ? `${user.name} · ${t(role)}` : t(role)}
        </span>
        <Badge variant="secondary" className="ml-1 hidden text-xs md:inline-flex">
          Demo
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("switchRole")}</DropdownMenuLabel>
          {roles.map((r) => (
            <DropdownMenuItem
              key={r}
              onClick={() => setRole(r)}
              className={role === r ? "bg-accent" : ""}
            >
              {t(r)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal text-muted-foreground">
                {user.name}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
          </>
        )}
        {isAuthenticated && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4" />
                {tNav("logout")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
