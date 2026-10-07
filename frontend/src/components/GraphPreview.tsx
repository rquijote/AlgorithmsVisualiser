import type { GraphCreatorResult } from "../utils/graphCreator";

interface GraphPreviewProps {
  graphState: GraphCreatorResult;
  highlight?: number[];
  alertHighlight?: number[];
  bgHighlight?: number[];
}

function GraphPreview({ graphState, highlight, alertHighlight, bgHighlight }: GraphPreviewProps) {
  const previewHeight =
    graphState.levelCount > 0 ? Math.max(180, 116 + (graphState.levelCount - 1) * 92) : 180;

  return (
    <div className="graph-preview" aria-label="Graph preview">
      <svg width="700" height={previewHeight} viewBox={`0 0 700 ${previewHeight}`}>
        {Object.entries(graphState.graph).map(([from, toList]) => {
          const fromPos = graphState.positions[Number(from)];
          if (!fromPos) {
            return null;
          }

          return toList.map((to) => {
            const toPos = graphState.positions[to];
            if (!toPos) {
              return null;
            }

            return (
              <line
                key={`${from}-${to}`}
                x1={fromPos.x}
                y1={fromPos.y + 28}
                x2={toPos.x}
                y2={toPos.y - 28}
                stroke="#94a3b8"
                strokeWidth={2}
              />
            );
          });
        })}
        {Object.entries(graphState.positions).map(([node, pos]) => {
          const isHighlighted = alertHighlight?.includes(Number(node)) || highlight?.includes(Number(node));

          return (
            <g key={node}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={34}
                className={
                  alertHighlight?.includes(Number(node))
                    ? "alert-highlight-node"
                    : highlight?.includes(Number(node))
                    ? "highlight-node"
                    : bgHighlight?.includes(Number(node))
                    ? "bg-highlight-node"
                    : "graph-node"
                }
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isHighlighted ? "white" : "#0f172a"}
                fontSize={20}
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default GraphPreview;
