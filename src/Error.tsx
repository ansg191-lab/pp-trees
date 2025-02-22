import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      style={{
        maxWidth: "400px",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        textAlign: "center",
        ...(className ? {} : {}),
      }}
    >
      {children}
    </div>
  );
};

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      style={{
        padding: "8px 16px",
        border: "1px solid #007bff",
        borderRadius: "4px",
        color: "#007bff",
        backgroundColor: "transparent",
        cursor: "pointer",
        transition: "background-color 0.2s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e7f0ff")}
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
      {...props}
    >
      {children}
    </button>
  );
};

type FullPageErrorProps = {
  error: unknown;
};

const FullPageError: React.FC<FullPageErrorProps> = ({ error }) => {
  console.error(error);

  const errorMessage = getErrMessage(error);
  const issueUrl = createIssueUrl(error);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f8f9fa",
        padding: "16px",
      }}
    >
      <Card>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <svg
            height="40"
            width="40"
            fill="red"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"
            />
          </svg>
          <h1 style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
            An Error Occurred
          </h1>
          <p style={{ color: "#666" }}>
            {errorMessage || "Something went wrong. Please try again later."}
          </p>
          <a href={issueUrl} target="_blank" rel="noopener noreferrer">
            <Button>Report Issue on GitHub</Button>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default FullPageError;

function createIssueUrl(err: unknown): string {
  const browserInfo = `User Agent: ${navigator.userAgent}`;
  let errMessage = "Unknown Error";
  let errStack: string | undefined = undefined;

  if (typeof err === "string") {
    errMessage = err;
  } else if (err instanceof Error) {
    errMessage = err.toString();
    errStack = err.stack;
  }

  const issueTitle = encodeURIComponent("Application Error: " + errMessage);
  const issueBody = encodeURIComponent(
    `### Error Message\n${errMessage}\n\n` +
      `### Stack Trace\n\`\`\`
${errStack || "No stack trace available."}
\`\`\`\n\n` +
      `### Browser Information\n${browserInfo}`,
  );
  return `https://github.com/ansg191-lab/pp-trees/issues/new?title=${issueTitle}&body=${issueBody}`;
}

function getErrMessage(err: unknown): string {
  if (typeof err === "string") {
    return err;
  } else if (err instanceof Error) {
    return err.toString();
  }
  return "Unknown Error";
}
