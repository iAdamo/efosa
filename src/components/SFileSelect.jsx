import { useState } from "react";
import { FileTrigger, Button } from "react-aria-components";

export default function SFileSelect({ children, ...props }) {
  const [file, setFile] = useState(null);

  return (
    <FileTrigger
      onSelect={(e) => {
        const files = Array.from(e);
        const filenames = files.map((file) => file.name);
        setFile(filenames);
      }}
    >
      <Button>{children}</Button>
    </FileTrigger>
  );
}
