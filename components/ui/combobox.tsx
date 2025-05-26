import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function Combobox({ options, value, onChange, placeholder = "Select or type a skill..." }: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState(value);

  React.useEffect(() => setInput(value), [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          )}
          value={input}
          onChange={e => {
            setInput(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
        />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-black text-white border border-gray-700">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={input}
            onValueChange={setInput}
            className="bg-black text-white"
          />
          <CommandEmpty>No match found.</CommandEmpty>
          <CommandGroup>
            {options
              .filter(opt => opt.toLowerCase().includes(input.toLowerCase()))
              .map(opt => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onChange(opt);
                    setInput(opt);
                    setOpen(false);
                  }}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {opt}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 