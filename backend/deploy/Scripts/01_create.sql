create schema if not exists sport;

create type sport.user_role as enum ('manager', 'organizer');

create table if not exists sport.users (
    id bigserial,
    email text,
    password_hash text,
    role sport.user_role,
    created_at timestamp default current_timestamp
);

create table if not exists sport.manager (
    id bigserial primary key,
    user_id bigint unique,
    team_id bigint
);

-- 1. сущности без связей

create table if not exists sport.organizer (
    id bigserial,
    user_id bigint unique,
    company_name text,
    email text,
    phone text
);

create table if not exists sport.location (
    id bigserial,
    name text,
    city text,
    capacity bigint
);

create table if not exists sport.team (
    id bigserial,
    name text,
    country text,
    foundation_date date
);

create table if not exists sport.referee (
    id bigserial,
    full_name text,
    category text,
    experience_years int
);

-- 2. сущности со связями

create table if not exists sport.tournament (
    id bigserial,
    organizer_id bigint,
    name text,
    sport_type text,
    start_date date,
    end_date date,
    prize_pool numeric,
    status text
);

create table if not exists sport.match (
    id bigserial,
    tournament_id bigint,
    location_id bigint,
    match_date timestamp,
    stage_name text,
    status text
);

create table if not exists sport.player (
    id bigserial,
    team_id bigint,
    real_name text,
    birth_date date
);

create table if not exists sport.coach (
    id bigserial,
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