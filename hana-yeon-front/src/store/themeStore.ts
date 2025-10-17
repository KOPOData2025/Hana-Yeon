import { create } from "zustand";

type FontSize = "small" | "medium" | "large" | "xLarge";

interface ThemeState {
  theme: "dark" | "light";
  fontSize: FontSize;
}

interface ThemeActions {
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
}

const updateCssVariables = (fontSize: FontSize) => {
  const root = document.documentElement;
  switch (fontSize) {
    case "small":
      root.style.setProperty("--font-size-xs", "10px");
      root.style.setProperty("--font-size-sm", "12px");
      root.style.setProperty("--font-size-base", "14px");
      root.style.setProperty("--font-size-lg", "16px");
      root.style.setProperty("--font-size-xl", "18px");
      root.style.setProperty("--font-size-2xl", "20px");
      root.style.setProperty("--font-size-3xl", "24px");
      break;
    case "medium":
      root.style.setProperty("--font-size-xs", "12px");
      root.style.setProperty("--font-size-sm", "14px");
      root.style.setProperty("--font-size-base", "16px");
      root.style.setProperty("--font-size-lg", "18px");
      root.style.setProperty("--font-size-xl", "20px");
      root.style.setProperty("--font-size-2xl", "24px");
      root.style.setProperty("--font-size-3xl", "30px");
      break;
    case "large":
      root.style.setProperty("--font-size-xs", "14px");
      root.style.setProperty("--font-size-sm", "16px");
      root.style.setProperty("--font-size-base", "18px");
      root.style.setProperty("--font-size-lg", "20px");
      root.style.setProperty("--font-size-xl", "22px");
      root.style.setProperty("--font-size-2xl", "28px");
      root.style.setProperty("--font-size-3xl", "36px");
      break;
    case "xLarge":
      root.style.setProperty("--font-size-xs", "16px");
      root.style.setProperty("--font-size-sm", "18px");
      root.style.setProperty("--font-size-base", "20px");
      root.style.setProperty("--font-size-lg", "22px");
      root.style.setProperty("--font-size-xl", "24px");
      root.style.setProperty("--font-size-2xl", "30px");
      root.style.setProperty("--font-size-3xl", "40px");
      break;
  }
};

export const themeStore = create<ThemeState & ThemeActions>((set) => ({
  theme: "light",
  fontSize: "medium",
  setTheme: (theme) => set(() => ({ theme })),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
  setFontSize: (size) =>
    set(() => {
      updateCssVariables(size);
      localStorage.setItem("fontSize", size);
      return { fontSize: size };
    }),
}));

const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
  const savedFontSize = localStorage.getItem("fontSize") as FontSize | null;

  if (savedTheme) {
    themeStore.getState().setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }

  if (savedFontSize) {
    themeStore.getState().setFontSize(savedFontSize);
  } else {
    updateCssVariables("medium");
  }
};

initializeTheme();
