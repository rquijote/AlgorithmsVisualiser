import { useEffect, useMemo, useState } from "react";
import { buildGraphFromRows, type GraphCreatorRow } from "../utils/graphCreator";

interface GraphCreatorProps {
  onChange: (result: ReturnType<typeof buildGraphFromRows>) => void;
  title?: string;
}

const defaultRows: GraphCreatorRow[] = [
  { node: "1", neighbors: "2, 7" },
  { node: "2", neighbors: "3, 4, 5" },
  { node: "3", neighbors: "" },
  { node: "4", neighbors: "" },
  { node: "5", neighbors: "6" },
  { node: "6", neighbors: "" },
  { node: "7", neighbors: "8" },
  { node: "8", neighbors: "9" },
  { node: "9", neighbors: "" },
];

function GraphCreator({
  onChange,
  title = "Graph Creator",
}: GraphCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [root, setRoot] = useState("1");
  const [rows, setRows] = useState<GraphCreatorRow[]>(defaultRows);

  const result = useMemo(() => buildGraphFromRows(rows, root), [rows, root]);
  const rootValue = root.trim();
  const isRootInvalid =
    rootValue === "" || !/^-?\d+$/.test(rootValue) || result.error === "Root must match a node in the graph.";

  useEffect(() => {
    onChange(result);
  }, [onChange, result]);

  function updateRow(index: number, field: keyof GraphCreatorRow, value: string) {
    setRows((currentRows) =>
      currentRows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row))
    );
  }

  function addRow() {
    setRows((currentRows) => [...currentRows, { node: "", neighbors: "" }]);
  }

  return (
    <section className="graph-creator-panel" aria-label="Graph Creator">
      <div className="graph-creator-header">
        <div className="graph-creator-title-block">
          <div>
            <h2>{title}</h2>
            <p>Build a one-way graph with a root node and up to 4 levels.</p>
          </div>
          <button
            className="controlpanel-btn-secondary graph-toggle-button"
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-controls="graph-creator-body"
          >
            {isOpen ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="graph-creator-body" className="graph-creator-body">
          <div className="graph-root-field">
            <label htmlFor="graph-root">Root</label>
            <input
              id="graph-root"
              type="text"
              inputMode="numeric"
              className={`dataset-input${isRootInvalid ? " input-error" : ""}`}
              value={root}
              onChange={(event) => setRoot(event.target.value)}
              aria-invalid={isRootInvalid}
              placeholder="1"
            />
          </div>

          <div className="graph-creator-grid" role="list" aria-label="Adjacency list rows">
            {rows.map((row, index) => (
              <div className="graph-row" key={`${index}-${row.node}`} role="listitem">
                <div className="graph-field">
                  <label>Node</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="dataset-input"
                    value={row.node}
                    onChange={(event) => updateRow(index, "node", event.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className="graph-field graph-neighbors-field">
                  <label>Neighbors</label>
                  <input
                    type="text"
                    className="dataset-input"
                    value={row.neighbors}
                    onChange={(event) => updateRow(index, "neighbors", event.target.value)}
                    placeholder="2, 3"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="graph-creator-actions">
            <button className="controlpanel-btn-secondary graph-add-button" type="button" onClick={addRow}>
              Add Row
            </button>
            <span className="graph-creator-hint">Use commas or spaces between neighbor nodes.</span>
          </div>

          {result.error && (
            <span className="dataset-error graph-creator-error" role="alert">
              {result.error}
            </span>
          )}
        </div>
      )}
    </section>
  );
}

export default GraphCreator;
