-- Отключение проверки ограничений и каскадное удаление данных перед загрузкой
TRUNCATE TABLE sport.tournament_registration, sport.match_participant, sport.match_referee CASCADE;
TRUNCATE TABLE sport.match, sport.player, sport.coach CASCADE;
TRUNCATE TABLE sport.tournament CASCADE;
TRUNCATE TABLE sport.organizer, sport.location, sport.team, sport.referee CASCADE;

-- Загрузка данных из CSV-файлов внутри Docker
COPY sport.organizer (id, company_name, email, phone)
FROM '/docker-data/organizer.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.location (id, name, city, capacity)
FROM '/docker-data/location.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.team (id, name, country, foundation_date)
FROM '/docker-data/team.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.referee (id, full_name, category, experience_years)
FROM '/docker-data/referee.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.tournament (id, organizer_id, name, sport_type, start_date, end_date, prize_pool, status)
FROM '/docker-data/tournament.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.match (id, tournament_id, location_id, match_date, stage_name, status)
FROM '/docker-data/match.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.player (id, team_id, real_name, birth_date)
FROM '/docker-data/player.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.coach (id, team_id, first_name, last_name, experience_years)
FROM '/docker-data/coach.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.tournament_registration (tournament_id, team_id, registration_date, status_registration)
FROM '/docker-data/tournament_registration.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.match_participant (match_id, team_id, score)
FROM '/docker-data/match_participant.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');

COPY sport.match_referee (match_id, referee_id, role)
FROM '/docker-data/match_referee.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '', ENCODING 'UTF8');