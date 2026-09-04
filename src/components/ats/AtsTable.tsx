"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICATION_STAGES } from "@/lib/mock/services/employer";
import { updateApplicationStage } from "@/lib/mock/services/applications";
import { getCandidateByIdAsync } from "@/lib/mock/services/candidates";
import type { Application, ApplicationStage } from "@/lib/types";

interface AtsTableProps {
  jobId: string;
  applications: Application[];
  locale: string;
  onRefresh: () => void;
}

interface TableRowData {
  id: string;
  name: string;
  stage: ApplicationStage;
  overlap: number;
  dimensions: number;
  appliedAt: string;
}

export function AtsTable({ jobId, applications, onRefresh }: AtsTableProps) {
  const t = useTranslations("employer.ats");
  const [rows, setRows] = useState<TableRowData[]>([]);

  useEffect(() => {
    async function buildRows() {
      const built: TableRowData[] = [];
      for (const app of applications) {
        let name = app.guestInfo?.name ?? "...";
        if (app.candidateId) {
          const cand = await getCandidateByIdAsync(app.candidateId);
          if (cand) name = cand.name;
        }
        built.push({
          id: app.id,
          name,
          stage: app.stage,
          overlap: app.matchScore,
          dimensions: app.matchDimensions.length,
          appliedAt: app.appliedAt,
        });
      }
      setRows(built);
    }
    buildRows();
  }, [applications]);

  const handleStageUpdate = async (appId: string, stage: ApplicationStage) => {
    await updateApplicationStage(appId, stage);
    onRefresh();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.name")}</TableHead>
            <TableHead>{t("columns.stage")}</TableHead>
            <TableHead>{t("columns.overlap")}</TableHead>
            <TableHead>{t("columns.dimensions")}</TableHead>
            <TableHead>{t("columns.applied")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                {t("noApplicants")}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    href={`/employer/jobs/${jobId}/applicants/${row.id}`}
                    className="font-medium hover:underline"
                  >
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Select
                    value={row.stage}
                    onValueChange={(v) => handleStageUpdate(row.id, v as ApplicationStage)}
                  >
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {t(`stages.${stage}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {row.overlap > 0 ? (
                    <Badge variant="outline">{t("overlap", { percent: row.overlap })}</Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{row.dimensions}</TableCell>
                <TableCell>{new Date(row.appliedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
