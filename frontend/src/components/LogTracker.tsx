function Logtracker({ logMsg, logExplanation }: { logMsg: string[]; logExplanation: string[] }) {
  const message = logMsg.length > 0 ? logMsg[logMsg.length - 1] : "Ready to run.";
  const explanation = logExplanation.length > 0 ? logExplanation[logExplanation.length - 1] : "";

  return (
    <div className="algorithm-step-message" role="status" aria-live="polite">
      <p className="algorithm-step-action">{message}</p>
      {explanation && <p className="algorithm-step-explanation">{explanation}</p>}
    </div>
  );
}

export default Logtracker;
