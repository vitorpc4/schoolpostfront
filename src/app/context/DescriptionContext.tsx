import { createContext } from "react";

interface DescriptionContextProps {
  html: string;
  setHtml: (value: string) => void;
}

export const DescriptionContext = createContext<DescriptionContextProps>({
  html: "",
  setHtml: () => {},
});
