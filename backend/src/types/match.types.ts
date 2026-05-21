export interface Location {
    name?: string | undefined,
    city?: string | undefined
}

export interface MatchFilters {
    location?: Location | undefined,
    date?: string | undefined,
    status?: string | undefined,
    teamName?: string | undefined
}

export interface TeamPair{
    team1?: string | undefined,
    team2?: string | undefined
}
