type Props = {
  score?: number | null;
  color?: string | null;
  hex?: string | null;
  compact?: boolean;
};

export default function OscEvaluationBadge({ score = 0, hex = "#6B7280", compact = false }: Props) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border bg-white ${compact ? "px-2.5 py-1" : "px-3 py-1.5"}`}
      style={{ borderColor: hex || "#6B7280" }}
      title={`Autoévaluation : ${score ?? 0}/20`}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hex || "#6B7280" }} />
      <span className="text-xs font-bold text-gray-800">{score ?? 0}/20</span>
    </div>
  );
}
