import { S3_BASE_URL, Tree } from "./gcs.ts";

export type PopupProps = Tree;

function Popup(props: PopupProps) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ width: "60px" }}>Taken at:</span>
        <b>{props.timestamp.toLocaleString()}</b>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ width: "60px" }}>Tag:</span>
        <b>{props.tag}</b>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ width: "60px" }}>File:</span>
        <a href={`https://drive.google.com/file/d/${props.id}`} target="_blank">
          <b>{props.file}</b>
        </a>
      </div>
      <a
        href={`${S3_BASE_URL}${props.id}-large.webp`}
        target="_blank"
        style={{ outline: "none" }}
      >
        <img
          width="100%"
          src={`${S3_BASE_URL}${props.id}-small.webp`}
          alt="tree"
          style={{ marginTop: "0.5rem" }}
        />
      </a>
    </>
  );
}

export default Popup;
