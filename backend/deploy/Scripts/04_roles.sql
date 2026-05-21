CREATE ROLE guest_role;
CREATE ROLE team_manager_role;
CREATE ROLE organizer_role;

GRANT USAGE ON SCHEMA sport TO guest_role, team_manager_role, organizer_role;

GRANT SELECT ON ALL TABLES IN SCHEMA sport TO guest_role;
GRANT SELECT ON ALL TABLES IN SCHEMA sport TO team_manager_role;

GRANT INSERT, UPDATE, DELETE ON sport.player TO team_manager_role;
GRANT INSERT, UPDATE, DELETE ON sport.tournament_registration TO team_manager_role;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA sport TO organizer_role;

GRANT EXECUTE ON PROCEDURE sport.start_tournament(BIGINT) TO organizer_role;