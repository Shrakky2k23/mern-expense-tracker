import { useTheme, THEMES } from "../context/ThemeContext.jsx";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="theme-switcher">
      {THEMES.map((t) => (
        <button
          key={t}
          className={`theme-dot theme-dot-${t} ${theme === t ? "active" : ""}`}
          onClick={() => setTheme(t)}
          title={t}
          aria-label={`Switch to ${t} theme`}
        />
      ))}
    </div>
  );
}
