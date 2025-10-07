import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
  <NextThemesProvider attribute="class" defaultTheme="light" enableSystem {...props}>
    {children}
  </NextThemesProvider>
);
