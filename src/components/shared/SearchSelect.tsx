'use client'

import { useId, useMemo, useState } from 'react'

import { CheckIcon, ChevronsUpDownIcon, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { cn } from '@/lib/utils'

interface SearchSelectProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  items: { value: string; label: string }[]
  value?: string | null
  onChange: (value: string) => void
  /** Placeholder inside the search input */
  searchPlaceholder?: string
  /** Label for the “add custom” row (search text is appended) */
  newItemLabel?: string
}

export function SearchSelect({
  items,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  newItemLabel = 'New',
  
  ...props

}: SearchSelectProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const searchTrim = search.trim()

  const filteredItems = useMemo(() => {
    if (!searchTrim) return items
    const q = searchTrim.toLowerCase()
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q)
    )
  }, [items, searchTrim])

  const hasExactMatch = items.some(
    (item) => item.label.toLowerCase() === searchTrim.toLowerCase()
  )
  const showNewOption = searchTrim.length > 0 && !hasExactMatch

  const displayLabel =
    value != null && value !== '' && !props.disabled
      ? (items.find((item) => item.value === value)?.label ?? value)
      : null

  return (
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setSearch('')
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-input/30 hover:bg-input/60 border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span
              className={cn('truncate', !displayLabel && 'text-muted-foreground')}
            >
              {displayLabel ?? (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>
            <ChevronsUpDownIcon
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-(--radix-popper-anchor-width) p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              {...props}
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
              
              
            />
            <CommandList>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    className="flex justify-between w-full relative"
                    key={item.value}
                    value={item.value}
                    keywords={[item.label, item.value]}
                    onSelect={() => {
                      onChange(item.value)
                      setOpen(false)
                      setSearch('')
                    }}
                  >
                    {item.label}

                    
                    {value === item.value && (
                      <CheckIcon size={16} className="ml-auto absolute right-3" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {showNewOption ? (
                <>
                  <CommandSeparator alwaysRender />
                  <CommandGroup>
                    <CommandItem
                      value={`__new__:${searchTrim}`}
                      onSelect={() => {
                        onChange(searchTrim)
                        setOpen(false)
                        setSearch('')
                      }}
                    >
                      <Plus strokeWidth={3} className="-ms-2 opacity-60" aria-hidden="true" />
                      {newItemLabel} &quot;{searchTrim}&quot;
                    </CommandItem>
                  </CommandGroup>
                </>
              ) : null}
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  )
}
