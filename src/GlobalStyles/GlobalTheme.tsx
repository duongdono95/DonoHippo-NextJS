"use client";
import { createTheme } from "@mui/material/styles";

export const GlobalTheme = createTheme({
  palette: {
    primary: {
      main: `rgba(var(--primary-code))`,
    },
  },
  components: {
    // // ------------------------------------General buttons
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 12,
        },
        containedPrimary: {
          color: "white !important",
        },
        outlinedPrimary: {
          border: "1px solid rgba(var(--primary-code))",
        },
      },
    },
  },
});
