import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartCard } from "@/features/analytics/components/charts/chart-card"
import {
  ANALYTICS_SERIES_COLORS,
  ANALYTICS_TOOLTIP_CONTENT_STYLE,
} from "@/features/analytics/constants"
import type { GenreShare } from "../../../types"

const GENRE_COLORS = [
  ANALYTICS_SERIES_COLORS.primary,
  ANALYTICS_SERIES_COLORS.amber,
]

interface StreamerGenreShareChartProps {
  data: GenreShare[]
}

export function StreamerGenreShareChart({
  data,
}: StreamerGenreShareChartProps) {
  return (
    <ChartCard title="Favorite genres" subtitle="Share of watch time">
      <div className="flex flex-col items-center gap-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={ANALYTICS_TOOLTIP_CONTENT_STYLE}
                formatter={(value) => [`${Number(value ?? 0)}%`, "Share"]}
              />
              <Pie
                data={data}
                dataKey="share"
                nameKey="genre"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.genre}
                    fill={GENRE_COLORS[index % GENRE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {data.map((entry, index) => (
            <div
              key={entry.genre}
              className="flex items-center gap-2 text-muted-foreground text-sm"
            >
              <span
                className="size-2.5 rounded-full"
                style={{
                  backgroundColor: GENRE_COLORS[index % GENRE_COLORS.length],
                }}
                aria-hidden
              />
              {entry.genre}
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  )
}
