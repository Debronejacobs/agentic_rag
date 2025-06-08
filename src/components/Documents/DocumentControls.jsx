import React from 'react';
import { Input } from '@/components/ui/input'; // Assuming shadcn/ui path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming shadcn/ui path
import { Search, ListFilter, ArrowUpDown } from 'lucide-react';

function DocumentControls({
    searchQuery,
    setSearchQuery,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    fileTypes,
    disabled // To disable controls during initial load or error
}) {
     // Ensure disabled state propagates correctly
    const isControlsDisabled = disabled; // Or add more complex logic if needed

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full max-w-xs md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-3"
                    disabled={isControlsDisabled}
                />
            </div>

             {/* Filter Dropdown */}
            <Select value={filterBy} onValueChange={setFilterBy} disabled={isControlsDisabled}>
                <SelectTrigger className="w-[150px]">
                    <ListFilter className="mr-2 size-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {fileTypes.map(type => (
                        <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy} disabled={isControlsDisabled}>
                <SelectTrigger className="w-[180px]">
                     <ArrowUpDown className="mr-2 size-4 text-muted-foreground" />
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="-created">Date (Newest first)</SelectItem>
                    <SelectItem value="created">Date (Oldest first)</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="-title">Title (Z-A)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export default DocumentControls;