"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { divisions } from "@/lib/mock/fixtures/locations";
import type { Location } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  value?: Partial<Location>;
  onChange?: (location: Partial<Location>) => void;
  className?: string;
  disabled?: boolean;
}

export function LocationPicker({
  value,
  onChange,
  className,
  disabled,
}: LocationPickerProps) {
  const t = useTranslations("common");

  const selectedDivision = divisions.find((d) => d.id === value?.divisionId);
  const districts = selectedDivision?.districts ?? [];
  const selectedDistrict = districts.find((d) => d.id === value?.districtId);
  const neighborhoods = selectedDistrict?.neighborhoods ?? [];

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      <Select
        value={value?.divisionId ?? ""}
        onValueChange={(divisionId) => {
          if (!divisionId) return;
          onChange?.({ divisionId, districtId: undefined, neighborhoodId: undefined });
        }}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={t("search")} />
        </SelectTrigger>
        <SelectContent>
          {divisions.map((div) => (
            <SelectItem key={div.id} value={div.id}>
              {div.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value?.districtId ?? ""}
        onValueChange={(districtId) => {
          if (!districtId) return;
          onChange?.({ ...value, districtId, neighborhoodId: undefined });
        }}
        disabled={disabled || !value?.divisionId}
      >
        <SelectTrigger>
          <SelectValue placeholder="District" />
        </SelectTrigger>
        <SelectContent>
          {districts.map((dist) => (
            <SelectItem key={dist.id} value={dist.id}>
              {dist.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {neighborhoods.length > 0 && (
        <Select
          value={value?.neighborhoodId ?? ""}
          onValueChange={(neighborhoodId) => {
            if (!neighborhoodId) return;
            onChange?.({ ...value, neighborhoodId });
          }}
          disabled={disabled || !value?.districtId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent>
            {neighborhoods.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
