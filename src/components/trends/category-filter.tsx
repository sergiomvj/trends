"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

const categoriesList = [
    { value: "all", label: "All Categories" },
    { value: "google_trends", label: "Google Trends" },
    { value: "news", label: "News" },
    { value: "technology", label: "Technology" },
    { value: "business", label: "Business" },
    { value: "entertainment", label: "Entertainment" },
    { value: "reddit", label: "Reddit" },
    { value: "youtube", label: "YouTube" },
]

interface CategoryFilterProps {
    selectedCategories: string[]
    onSelectCategories: (categories: string[]) => void
}

export function CategoryFilter({ selectedCategories, onSelectCategories }: CategoryFilterProps) {
    const [open, setOpen] = React.useState(false)

    const toggleCategory = (value: string) => {
        if (value === "all") {
            onSelectCategories(["all"])
            setOpen(false)
            return
        }

        const newCategories = selectedCategories.includes(value)
            ? selectedCategories.filter((c) => c !== value)
            : [...selectedCategories.filter((c) => c !== "all"), value]

        onSelectCategories(newCategories.length === 0 ? ["all"] : newCategories)
    }

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                        {selectedCategories.includes("all")
                            ? "Filter Categories"
                            : `${selectedCategories.length} selected`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 border-border bg-popover text-popover-foreground">
                    <Command>
                        <CommandInput placeholder="Search category..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                                {categoriesList.map((cat) => (
                                    <CommandItem
                                        key={cat.value}
                                        value={cat.value}
                                        onSelect={() => toggleCategory(cat.value)}
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedCategories.includes(cat.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {cat.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-1">
                {selectedCategories.filter(c => c !== 'all').map(c => (
                    <Badge key={c} variant="secondary" className="bg-secondary text-secondary-foreground border-border">
                        {categoriesList.find(cat => cat.value === c)?.label}
                        <X className="ml-1 h-3 w-3 cursor-pointer hover:text-foreground" onClick={() => toggleCategory(c)} />
                    </Badge>
                ))}
            </div>
        </div>
    )
}
