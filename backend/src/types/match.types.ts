export interface Location {
    name?: string | undefined,
    city?: string | undefined
}

export interface MatchFilters {
    location?: Location | undefined,
    date?: string | undefined,
    status?: string | undefined
}
