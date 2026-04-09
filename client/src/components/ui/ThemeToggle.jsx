import { useTheme } from '../../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi2';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-surface hover:bg-surface-hover transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {isDark ? (
          <HiSun className="w-5 h-5 text-accent transition-transform group-hover:rotate-45" />
        ) : (
          <HiMoon className="w-5 h-5 text-primary transition-transform group-hover:-rotate-12" />
        )}
      </div>
    </button>
  );
}
