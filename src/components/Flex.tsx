import type { BoxProps } from "ui-box";

export const FlexColCenter: Partial<BoxProps<"div">> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
