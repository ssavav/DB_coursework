create or replace procedure sport.register_team(p_team_id bigint, p_tournament_id bigint)
language plpgsql
as $$
declare
    v_status text;
    v_exists boolean;
begin
    select status into v_status
    from sport.tournament
    where id = p_tournament_id;

    if not found then
        raise exception 'Турнир % не найден', p_tournament_id;
    end if;

    if v_status != 'registration' then
        raise exception 'Регистрация на турнир закрыта (текущий статус: %)', v_status;
    end if;

    select exists(
        select 1 from sport.tournament_registration 
        where tournament_id = p_tournament_id and team_id = p_team_id
    ) into v_exists;

    if v_exists then
        raise exception 'Команда % уже подала заявку на турнир %', p_team_id, p_tournament_id;
    end if;

    insert into sport.tournament_registration(tournament_id, team_id, registration_date, status_registration)
    values (p_tournament_id, p_team_id, current_timestamp, 'pending');
end;
$$;


create or replace function sport.trg_generate_tournament_schedule()
returns trigger
language plpgsql
as $$
declare
    v_team_ids bigint[];
    v_loc_ids bigint[];
    v_team_count int;
    v_loc_count int;
    v_match_id bigint;
    v_loc_idx int;
    v_date timestamp;
    i int;
    j int;
begin
    if old.status = 'registration' and new.status = 'active' then
        
        select array_agg(team_id) into v_team_ids
        from sport.tournament_registration
        where tournament_id = new.id and status_registration = 'approved';

        select array_agg(id) into v_loc_ids
        from sport.location;

        v_team_count := coalesce(array_length(v_team_ids, 1), 0);
        v_loc_count := coalesce(array_length(v_loc_ids, 1), 0);

        if v_team_count >= 2 then
            v_date := coalesce(new.start_date::timestamp, current_timestamp);
            
            for i in 1 .. (v_team_count - 1) loop
                for j in (i + 1) .. v_team_count loop
                    
                    v_loc_idx := floor(random() * v_loc_count + 1)::int;
                    
                    insert into sport.match (tournament_id, location_id, match_date, stage_name, status)
                    values (
                        new.id, 
                        v_loc_ids[v_loc_idx], 
                        v_date,
                        'Групповой этап', 
                        'scheduled'
                    ) returning id into v_match_id;

                    insert into sport.match_participant (match_id, team_id, score)
                    values (v_match_id, v_team_ids[i], null);

                    insert into sport.match_participant (match_id, team_id, score)
                    values (v_match_id, v_team_ids[j], null);
                    
                    v_date := v_date + interval '1 day';

                end loop;
            end loop;
        end if;
    end if;

    return new;
end;
$$;

drop trigger if exists trg_generate_schedule on sport.tournament;

create trigger trg_generate_schedule
after update of status on sport.tournament
for each row
execute function sport.trg_generate_tournament_schedule();


create or replace function sport.trg_finish_tournament()
returns trigger
language plpgsql
as $$
begin
    if new.status = 'finished' and old.status is distinct from 'finished' and new.stage_name = 'Финал' then
        
        update sport.tournament 
        set status = 'completed' 
        where id = new.tournament_id;

    end if;

    return new;
end;
$$;

drop trigger if exists trg_match_finish_tournament on sport.match;

create trigger trg_match_finish_tournament
after update of status on sport.match
for each row
execute function sport.trg_finish_tournament();