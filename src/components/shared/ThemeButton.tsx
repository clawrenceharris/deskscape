"use client"
import { useMediaQuery } from "@/hooks";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
type ThemeButtonProps = {
  className?: string;
}
export function ThemeButton({ className }: ThemeButtonProps) {
  const { theme, setTheme } = useTheme();
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const isDark = theme === "dark" || theme === "system" && prefersDark;
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      tabIndex={0}
      className={cn(`
        bg-surface 
        rounded-full 
        px-1 
        shadow-md shadow-black/20
        dark:shadow-black
        flex 
        overflow-hidden 
        cursor-pointer 
        relative 
        items-center 
        size-[50px]
        justify-center
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
      `, className)}
    >
      {/* Dark Theme Icon */}
      <span
        aria-hidden={!isDark}
        className={`
          absolute
          flex
          justify-center
          items-center
          p-2.5
          bg-[#332780]
          rounded-full
          transition-transform 
          duration-400
          ${isDark ? "translate-y-0" : "-translate-y-[150%]"}
        `}
      >
        <Image
          alt=""
          style={{ filter: "invert(1)" }}
          src="https://cdn-icons-png.flaticon.com/128/764/764690.png"
          width={20}
          height={20}
        />
      </span>
      {/* Light Theme Icon */}
      <span
        aria-hidden={!isDark}
        className={`
          absolute
          flex
          justify-center
          items-center
          p-2.5
          rounded-full
          transition-transform 
          duration-400
          bg-[#a5f7f9]
          ${!isDark ? "translate-y-0" : "translate-y-[150%]"}
        `}
      >
        <Image
          alt=""
          src="https://cdn-icons-png.flaticon.com/128/439/439842.png"
          width={20}
          height={20}
        />
      </span>
    </button>
  );
}