alter table sport.users
    add constraint pk_user_id primary key (id),
    alter column email set not null,
    alter column password_hash set not null,
    alter column role set not null,
    add constraint uq_users_email unique (email),
    add constraint valid_email check (email ~ '^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z0-9]{2,}$');

alter table sport.organizer
    add constraint pk_organizer_id primary key (id),
    add constraint uq_organizer_email unique (email),
    add constraint valid_email check (email ~ '^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z0-9]{2,}$');

alter table sport.organizer
    alter column id set not null,
    alter column company_name set not null,
    alter column email set not null;

alter table sport.location
    add constraint pk_location_id primary key (id),
    add constraint chk_location_capacity check (capacity > 0);

alter table sport.location
    alter column id set not null,
    alter column name set not null,
    alter column city set not null;

alter table sport.team
    add constraint pk_team_id primary key (id);

alter table sport.team
    alter column id set not null,
    alter column name set not null,
    alter column country set not null;

alter table sport.referee
    add constraint pk_referee_id primary key (id),
    add constraint chk_referee_experience check (experience_years >= 0);

alter table sport.referee
    alter column id set not null,
    alter column full_name set not null,
    alter column category set not null,
    alter column experience_years set default 0;

alter table sport.tournament
    add constraint pk_tournament_id primary key (id),
    add constraint fk_tournament_organizer foreign key (organizer_id) references sport.organizer (id) on delete cascade,
    add constraint chk_tournament_dates check (start_date <= end_date),
    add constraint chk_tournament_prize check (prize_pool >= 0),
    add constraint chk_tournament_status check (status in ('registration', 'active', 'completed', 'cancelled'));

alter table sport.tournament
    alter column id set not null,
    alter column organizer_id set not null,
    alter column name set not null,
    alter column sport_type set not null,
    alter column start_date set not null,
    alter column end_date set not null,
    alter column prize_pool set default 0.00,
    alter column status set default 'registration';

alter table sport.match
    add constraint pk_match_id primary key (id),
    add constraint fk_match_tournament foreign key (tournament_id) references sport.tournament (id) on delete cascade,
    add constraint fk_match_location foreign key (location_id) references sport.location (id) on delete set null,
    add constraint chk_match_status check (status in ('scheduled', 'ongoing', 'finished', 'cancelled'));

alter table sport.match
    alter column id set not null,
    alter column tournament_id set not null,
    alter column match_date set not null,
    alter column stage_name set not null,
    alter column status set default 'scheduled';

alter table sport.player
    add constraint pk_player_id primary key (id),
    add constraint fk_player_team foreign key (team_id) references sport.team (id) on delete set null;

alter table sport.player
    alter column id set not null,
    alter column real_name set not null,
    alter column birth_date set not null;

alter table sport.coach
    add constraint pk_coach_id primary key (id),
    add constraint fk_coach_team foreign key (team_id) references sport.team (id) on delete set null,
    add constraint chk_coach_experience check (experience_years >= 0);

alter table sport.coach
    alter column id set not null,
    alter column first_name set not null,
    alter column last_name set not null,
    alter column experience_years set default 0;

alter table sport.tournament_registration
    add constraint pk_tournament_registration primary key (tournament_id, team_id),
    add constraint fk_reg_tournament foreign key (tournament_id) references sport.tournament (id) on delete cascade,
    add constraint fk_reg_team foreign key (team_id) references sport.team (id) on delete cascade,
    add constraint chk_reg_status check (status_registration in ('pending', 'approved', 'rejected'));

alter table sport.tournament_registration
    alter column tournament_id set not null,
    alter column team_id set not null,
    alter column registration_date set default current_timestamp,
    alter column status_registration set default 'pending';

alter table sport.match_participant
    add constraint pk_match_participant primary key (match_id, team_id),
    add constraint fk_part_match foreign key (match_id) references sport.match (id) on delete cascade,
    add constraint fk_part_team foreign key (team_id) references sport.team (id) on delete cascade,
    add constraint chk_part_score check (score >= 0);

alter table sport.match_participant
    alter column match_id set not null,
    alter column team_id set not null,
    alter column score set default 0;

alter table sport.match_referee
    add constraint pk_match_referee primary key (match_id, referee_id),
    add constraint fk_ref_match foreign key (match_id) references sport.match (id) on delete cascade,
    add constraint fk_ref_referee foreign key (referee_id) references sport.referee (id) on delete cascade;

alter table sport.match_referee
    alter column match_id set not null,
    alter column referee_id set not null,
    alter column role set not null;