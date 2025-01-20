const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

interface PinProps {
  tag: string;
}

function Pin({ tag }: PinProps) {
  const pinStyle = {
    cursor: "pointer",
    fill: TAG_COLOR_MAP[toTag(tag)],
    stroke: "none",
  };

  return (
    <svg height={20} viewBox="0 0 24 24" style={pinStyle}>
      <path d={ICON} />
    </svg>
  );
}

export default Pin;

const TAG_COLOR_MAP = {
  unknown: "#00d",
  marked: "#d00",
  unmarked: "#0d0",
} as const;
type Tag = keyof typeof TAG_COLOR_MAP;

function toTag(tag: string): Tag {
  if (tag in TAG_COLOR_MAP) {
    return tag as Tag;
  }
  console.warn(`Unknown tag: ${tag}`);
  return "unknown";
}
