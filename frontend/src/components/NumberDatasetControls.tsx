import { useId, useState } from "react";
import "../styles/visualiser.css";
import { randomizeNumbers } from "../utils/randomizeNumbers";

interface NumberDatasetControlsProps {
  numbers: number[] | null;
  onNumbersChange: (numbers: number[] | null) => void;
  sortNumbers?: boolean;
  maxNumberCount?: number;
}

function NumberDatasetControls({
  numbers,
  onNumbersChange,
  sortNumbers = false,
  maxNumberCount = 32,
}: NumberDatasetControlsProps) {
  const inputId = useId();
  const [draft, setDraft] = useState(numbers?.join(", ") || "");
  const [error, setError] = useState("");

  function parseNumbers(value: string): number[] | null {
    const trimmed = value.trim();
    if (!trimmed || trimmed.startsWith(",") || trimmed.endsWith(",") || /,\s*,/.test(trimmed)) {
      return null;
    }

    const tokens = trimmed.split(/[\s,]+/);
    const values = tokens.map(Number);

    if (
      values.length > maxNumberCount ||
      tokens.some((token) => !/^-?\d+$/.test(token)) ||
      values.some((value) => !Number.isSafeInteger(value) || value < 0 || value > 99)
    ) {
      return null;
    }

    return sortNumbers ? [...values].sort((left, right) => left - right) : values;
  }

  function handleDraftChange(value: string) {
    setDraft(value);
    const values = parseNumbers(value);
    onNumbersChange(values);
    setError(
      values ? "" : `Enter 1 to ${maxNumberCount} whole numbers from 0 to 99, separated by commas or spaces.`
    );
  }

  function handleRandomize() {
    const values = randomizeNumbers(maxNumberCount);
    const nextNumbers = sortNumbers
      ? [...values].sort((left, right) => left - right)
      : values;
    setDraft(nextNumbers.join(", "));
    onNumbersChange(nextNumbers);
    setError("");
  }

  return (
    <section className="dataset-controls" aria-label="Input dataset">
      <label htmlFor={inputId}>Numbers</label>
      <input
        id={inputId}
        className={`dataset-input${error ? " input-error" : ""}`}
        type="text"
        value={draft}
        onChange={(event) => handleDraftChange(event.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
      />
      <button
        className="controlpanel-btn-secondary dataset-button"
        type="button"
        onClick={handleRandomize}
      >
        Random
      </button>
      <span className="dataset-hint" id={`${inputId}-hint`}>
        Comma- or space-separated integers
      </span>
      {error && (
        <span className="dataset-error" id={`${inputId}-error`} role="alert">
          {error}
        </span>
      )}
    </section>
  );
}

export default NumberDatasetControls;