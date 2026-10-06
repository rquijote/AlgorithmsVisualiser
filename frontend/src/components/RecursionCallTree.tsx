import type { RecursiveCall } from "../Interfaces";

interface RecursionCallTreeProps {
  calls: RecursiveCall[];
  activeCallId: number | null;
}

const phaseLabels: Record<string, string> = {
  call: "Call",
  "base-case": "Base case",
  "partition-start": "Partitioning",
  "partition-pivot": "Choose pivot",
  "partition-compare": "Compare with pivot",
  "partition-move": "Move into partition",
  "pivot-positioned": "Pivot placed",
  "descend-left": "Explore left",
  "return-left": "Returned from left",
  "descend-right": "Explore right",
  "return-right": "Returned from right",
  return: "Returning to caller",
  complete: "Complete",
  "merge-start": "Merge children",
  compare: "Compare left and right",
  "merge-item": "Build merged segment",
  "merge-complete": "Merge complete",
};

function RecursionCallTree({ calls, activeCallId }: RecursionCallTreeProps) {
  const childrenByParent = new Map<number | null, RecursiveCall[]>();

  calls.forEach((call) => {
    const children = childrenByParent.get(call.parentCallId) || [];
    children.push(call);
    childrenByParent.set(call.parentCallId, children);
  });

  function renderCalls(parentCallId: number | null): React.ReactNode {
    const children = childrenByParent.get(parentCallId) || [];

    return children.map((call) => {
      const isActive = call.callId === activeCallId;
      const isComplete = ["base-case", "return", "complete", "merge-complete"].includes(
        call.phase
      );
      const segmentRange =
        call.segmentEnd < call.segmentStart
          ? "empty range"
          : `indices ${call.segmentStart}-${call.segmentEnd}`;

      return (
        <div className="recursion-call-branch" key={call.callId}>
          <article
            className={`recursion-call${isActive ? " is-active" : ""}${
              isComplete ? " is-complete" : ""
            }`}
            aria-current={isActive ? "step" : undefined}
          >
            <header className="recursion-call-heading">
              <strong>Call {call.callId}</strong>
              <span>{segmentRange}</span>
            </header>
            <div className="recursion-call-values">
              {call.segmentValues.length > 0
                ? `[${call.segmentValues.join(", ")}]`
                : "[]"}
            </div>
            <span className="recursion-call-phase">
              {phaseLabels[call.phase] || call.phase}
            </span>
            {isActive && <p className="recursion-call-message">{call.message}</p>}
          </article>
          <div className="recursion-call-children">
            {renderCalls(call.callId)}
          </div>
        </div>
      );
    });
  }

  return (
    <section className="recursion-tree-panel" aria-label="Recursive call tree">
      <h2>Call Tree</h2>
      <div className="recursion-tree-scroll">
        {calls.length > 0 ? renderCalls(null) : <span>No calls recorded.</span>}
      </div>
    </section>
  );
}

export default RecursionCallTree;