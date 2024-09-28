import { COLORS } from "@/utils/constants";

export default function ColorDefault() {
  const handleColors = () => {
    return COLORS.map((color) => {
      return <ColorItem color={color} key={color} />;
    });
  };
  return (
    <fieldset>
      <legend>Colors</legend>
      {handleColors()}
    </fieldset>
  );
}

function ColorItem({ color }: { color: string }) {
  return (
    <div>
      <input
        type="radio"
        id="color"
        name="color"
        value="color"
        className={`accent-[${color}]-500 hover:accent-red-500`}
      />
      <label htmlFor="color" className={`bg-[#1d4ed8]`}>
        {color}
      </label>
    </div>
  );
}
