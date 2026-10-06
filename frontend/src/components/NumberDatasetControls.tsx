import { useEffect, useId, useState } from "react";
import "../styles/visualiser.css";

interface NumberDatasetControlsProps {
  numbers: number[];
  onNumbersChange: (numbers: number[]) => void;
  sortNumbers?: boolean;
}

const maxNumberCount = 32;

function NumberDatasetControls({
  numbers,
  onNumbersChange,
  sortNumbers = false,
}: NumberDatasetControlsProps) {
  const inputId = useId();
  const [draft, setDraft] = useState(numbers.join(", "));
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(numbers.join(", "));
  }, [numbers]);

  function applyNumbers(values: number[]) {
    onNumbersChange(sortNumbers ? [...values].sort((left, right) => left - right) : values);
    setError("");
  }

  function handleApply() {
    const tokens = draft.trim().split(/[\s,]+/).filter(Boolean);
    const values = tokens.map(Number);

    if (
      values.length === 0 ||
      values.length > maxNumberCount ||
      values.some((value) => !Number.isSafeInteger(value))
    ) {
      setError(`Enter 1 to ${maxNumberCount} whole numbers, separated by commas or spaces.`);
      return;
    }

    applyNumbers(values);
  }

  function handleRandomize() {
    const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 99) + 1);
    applyNumbers(values);
  }

  return (
    <section className="dataset-controls" aria-label="Input dataset">
      <label htmlFor={inputId}>Numbers</label>
      <input
        id={inputId}
        className="dataset-input"
        type="text"
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setError("");
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleApply();
        }}
        aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
      />
      <button
        className="controlpanel-btn-secondary dataset-button"
        type="button"
        onClick={handleApply}
      >
        Apply
      </button>
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