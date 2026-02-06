import React from "react";

interface Props {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<Props> = ({ checked, onChange }) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    <span
      className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out shadow-inner
        ${checked ? "bg-gradient-to-r from-[#138808] to-[#1b9e10]" : "bg-gray-300"}`}
    >
      <span
        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out
          ${checked ? "translate-x-5" : ""}`}
      />
    </span>
  </label>
);

export default ToggleSwitch;