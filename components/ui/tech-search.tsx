'use client'

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { ALL_TECHNOLOGIES } from "@/lib/constants"

interface TechSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TechSearch({ value, onChange, placeholder = "Select technology..." }: TechSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  
  const filteredTechnologies = React.useMemo(() => 
    ALL_TECHNOLOGIES.filter((tech) =>
      tech.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search technologies..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No technology found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {filteredTechnologies.map((tech) => (
              <CommandItem
                key={tech}
                value={tech}
                onSelect={(value) => {
                  onChange(value)
                  setSearch("")
                  setOpen(false)
                }}
              >
                {tech}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
