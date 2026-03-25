create schema if not exists sport;

-- 1. сущности без связей

create table if not exists sport.organizer (
    id bigint,
    company_name text,
    email text,
    phone text
);

create table if not exists sport.location (
    id bigint,
    name text,
    city text,
    capacity bigint
);

create table if not exists sport.team (
    id bigint,
    name text,
    country text,
    foundation_date date
);

create table if not exists sport.referee (
    id bigint,
    full_name text,
    category text,
    experience_years int
);

-- 2. сущности со связями

create table if not exists sport.tournament (
    id bigint,
    organizer_id bigint,
    name text,
    sport_type text,
    start_date date,
    end_date date,
    prize_pool numeric,
    status text
);

create table if not exists sport.match (
    id bigint,
    tournament_id bigint,
    location_id bigint,
    match_date timestamp,
    stage_name text,
    status text
);

create table if not exists sport.player (
    id bigint,
    team_id bigint,
    real_name text,
    birth_date date
);

create table if not exists sport.coach (
    id bigint,
    team_id bigint,
    first_name text,
    last_name text,
    experience_years int
);

-- 3. таблицы-связки

create table if not exists sport.tournament_registration (
    tournament_id bigint,
    team_id bigint,
    registration_date timestamp,
    status_registration text
);

create table if not exists sport.match_participant (
    match_id bigint,
    team_id bigint,
    score int
);

create table if not exists sport.match_referee (
    match_id bigint,
    referee_id bigint,
    role text
);