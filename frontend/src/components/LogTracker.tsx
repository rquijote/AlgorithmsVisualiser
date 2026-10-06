function Logtracker({ logMsg }: { logMsg: string[] }) {
  const message = logMsg.length > 0 ? logMsg[logMsg.length - 1] : "Ready to run.";

  return <p className="algorithm-step-message" role="status" aria-live="polite">{message}</p>;
}

export default Logtracker;
