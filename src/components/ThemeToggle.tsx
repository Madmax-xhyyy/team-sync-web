import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/app/providers/theme-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isTheme } from "@/lib/theme";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const selectedTheme = themes.find((option) => option.value === theme)!;
  const Icon = selectedTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change appearance"
        title={`Theme: ${selectedTheme.label}`}
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-popup-open:bg-accent data-popup-open:text-accent-foreground"
      >
        <Icon className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-44 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) => {
              if (isTheme(value)) setTheme(value);
            }}
          >
            {themes.map(({ value, label, icon: OptionIcon }) => (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                closeOnClick
                className="cursor-pointer gap-2 py-2 pl-2"
              >
                <OptionIcon aria-hidden="true" />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
