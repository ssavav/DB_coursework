import csv
import random
from faker import Faker
from datetime import timedelta

fake = Faker('ru_RU')
Faker.seed(42)
random.seed(42)
PATH = "../Data/"

N = 1000

def generate_phone():
    """Генерация телефона в едином формате: +7 (XXX) XXX-XX-XX"""
    return f"+7 ({random.randint(900, 999)}) {random.randint(100, 999)}-{random.randint(10, 99):02d}-{random.randint(10, 99):02d}"

def generate_tournament_name():
    """Генерация адекватных названий турниров"""
    prefixes = ['Кубок', 'Чемпионат', 'Гран-при', 'Турнир', 'Лига', 'Открытый кубок']
    suffixes = ['чемпионов', 'надежд', 'профессионалов', 'любителей', 'города', 'страны']
    return f"{random.choice(prefixes)} {fake.city()} ({random.choice(suffixes)})"

def write_csv(filename, columns, data):
    """Функция для записи данных в CSV файл"""
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(columns)
        writer.writerows(data)
    print(f"✅ Файл {filename} успешно сгенерирован")

def main():
    print("Начинаем генерацию данных...")
    
    # 1. ORGANIZER
    organizers = []
    for i in range(1, N + 1):
        organizers.append([
            i, 
            fake.company(), 
            f"org{i}@{fake.free_email_domain()}", 
            generate_phone()
        ])
    write_csv(f"{PATH}organizer.csv", ['id', 'company_name', 'email', 'phone'], organizers)

    # 2. LOCATION
    locations = []
    for i in range(1, N + 1):
        locations.append([
            i, 
            fake.company() + " Arena", 
            fake.city(), 
            random.randint(1000, 80000)
        ])
    write_csv(f"{PATH}location.csv", ['id', 'name', 'city', 'capacity'], locations)

    # 3. TEAM
    teams = []
    suffixes = ['ФК', 'Team', 'United', 'City', 'Pro']
    for i in range(1, N + 1):
        teams.append([
            i, 
            fake.city() + " " + random.choice(suffixes), 
            fake.country(), 
            fake.date_between(start_date='-50y', end_date='-1y')
        ])
    write_csv(f"{PATH}team.csv", ['id', 'name', 'country', 'foundation_date'], teams)

    # 4. REFEREE
    referees = []
    categories = ['FIFA', 'National', 'Regional']
    for i in range(1, N + 1):
        referees.append([
            i, 
            fake.name(), 
            random.choice(categories), 
            random.randint(0, 25)
        ])
    write_csv(f"{PATH}referee.csv", ['id', 'full_name', 'category', 'experience_years'], referees)

    # 5. TOURNAMENT
    tournaments = []
    sport_types = ['Футбол', 'Баскетбол', 'Киберспорт', 'Хоккей', 'Теннис']
    statuses = ['registration', 'active', 'completed', 'cancelled']
    for i in range(1, N + 1):
        start_date = fake.date_between(start_date='-2y', end_date='+1y')
        end_date = start_date + timedelta(days=random.randint(5, 30))
        tournaments.append([
            i, 
            random.randint(1, N), 
            generate_tournament_name(), 
            random.choice(sport_types), 
            start_date, 
            end_date, 
            round(random.uniform(10000.0, 500000.0), 2), 
            random.choice(statuses)
        ])
    write_csv(f"{PATH}tournament.csv", ['id', 'organizer_id', 'name', 'sport_type', 'start_date', 'end_date', 'prize_pool', 'status'], tournaments)

    # 6. MATCH
    matches = []
    stages = ['Группа А', 'Группа Б', '1/4 финала', 'Полуфинал', 'Финал']
    m_statuses = ['scheduled', 'ongoing', 'finished', 'cancelled']
    for i in range(1, N + 1):
        matches.append([
            i, 
            random.randint(1, N), 
            random.randint(1, N), 
            fake.date_time_between(start_date='-1y', end_date='+1y').strftime('%Y-%m-%d %H:%M:%S'), 
            random.choice(stages), 
            random.choice(m_statuses)
        ])
    write_csv(f"{PATH}match.csv", ['id', 'tournament_id', 'location_id', 'match_date', 'stage_name', 'status'], matches)

    # 7. PLAYER
    players = []
    for i in range(1, 2001):
        players.append([
            i, 
            random.randint(1, N), 
            fake.name(), 
            fake.date_of_birth(minimum_age=16, maximum_age=40)
        ])
    write_csv(f"{PATH}player.csv", ['id', 'team_id', 'real_name', 'birth_date'], players)

    # 8. COACH
    coaches = []
    for i in range(1, N + 1):
        coaches.append([
            i, 
            i, 
            fake.first_name(), 
            fake.last_name(), 
            random.randint(1, 30)
        ])
    write_csv(f"{PATH}coach.csv", ['id', 'team_id', 'first_name', 'last_name', 'experience_years'], coaches)

    # 9. TOURNAMENT REGISTRATION
    registrations = []
    reg_statuses = ['pending', 'approved', 'rejected']
    for t_id in range(1, N + 1):
        picked_teams = random.sample(range(1, N + 1), 2)
        for tm in picked_teams:
            reg_date = fake.date_time_between(start_date='-2y', end_date='now').strftime('%Y-%m-%d %H:%M:%S')
            registrations.append([
                t_id, 
                tm, 
                reg_date, 
                random.choice(reg_statuses)
            ])
    write_csv(f"{PATH}tournament_registration.csv", ['tournament_id', 'team_id', 'registration_date', 'status_registration'], registrations)

    # 10. MATCH PARTICIPANT
    participants = []
    for m_id in range(1, N + 1):
        picked_teams = random.sample(range(1, N + 1), 2)
        for tm in picked_teams:
            participants.append([m_id, tm, random.randint(0, 5)])
    write_csv(f"{PATH}match_participant.csv", ['match_id', 'team_id', 'score'], participants)

    # 11. MATCH REFEREE
    match_refs = []
    roles = ['Главный судья', 'Боковой судья', 'VAR']
    for m_id in range(1, N + 1):
        num_refs = random.randint(1, 2)
        picked_refs = random.sample(range(1, N + 1), num_refs)
        for idx, r_id in enumerate(picked_refs):
            match_refs.append([m_id, r_id, roles[idx]])
    write_csv(f"{PATH}match_referee.csv", ['match_id', 'referee_id', 'role'], match_refs)

    print("\nУра! Все CSV файлы созданы.")

if __name__ == "__main__":
    main()