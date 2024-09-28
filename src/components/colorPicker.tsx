import React from "react";

type TColorPicker = {
  currentColor: string;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
};
export default function ColorPicker({
  currentColor,
  setCurrentColor,
}: TColorPicker) {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(event.target.value);
  };

  return (
    <label htmlFor="color">
      Color
      <input
        type="color"
        name=""
        id="color"
        onChange={handleColorChange}
        value={currentColor}
      />
    </label>
  );
}
