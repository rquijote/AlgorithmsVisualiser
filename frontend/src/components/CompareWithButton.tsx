import { NavLink } from "react-router";

interface CompareWithButtonProps {
  to: string;
}

function CompareWithButton({ to }: CompareWithButtonProps) {
  return (
    <div className="compare-with-row">
      <NavLink className="controlpanel-btn-secondary compare-with-button" to={to}>
        Compare With
      </NavLink>
    </div>
  );
}

export default CompareWithButton;