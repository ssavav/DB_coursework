import { useState, useMemo } from 'react';

// Фейковые данные (потом заменим на fetch запрос к твоей БД)
const mockTournaments =[
  { id: 1, name: "Летний Кубок Бауманки", sport_type: "Футбол", start_date: "2026-06-01", status: "registration", prize_pool: 50000 },
  { id: 2, name: "Cyber League 2026", sport_type: "Киберспорт", start_date: "2026-05-15", status: "active", prize_pool: 150000 },
  { id: 3, name: "Городской турнир", sport_type: "Баскетбол", start_date: "2026-04-10", status: "completed", prize_pool: 30000 },
  { id: 4, name: "Dota 2 Spring Major", sport_type: "Киберспорт", start_date: "2026-07-20", status: "registration", prize_pool: 500000 },
];

function App() {
  // Состояния для фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const[sportFilter, setSportFilter] = useState('');

  // Логика фильтрации (useMemo пересчитывает список только когда меняются фильтры)
  const filteredTournaments = useMemo(() => {
    return mockTournaments.filter((tournament) => {
      const matchName = tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? tournament.status === statusFilter : true;
      const matchSport = sportFilter ? tournament.sport_type === sportFilter : true;
      
      return matchName && matchStatus && matchSport;
    });
  }, [searchTerm, statusFilter, sportFilter]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>🏆 Управление спортивными турнирами</h1>
      
      {/* ПАНЕЛЬ ФИЛЬТРОВ */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        
        <input 
          type="text" 
          placeholder="Поиск по названию..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px' }}>
          <option value="">Все статусы</option>
          <option value="registration">Открыта регистрация</option>
          <option value="active">Активный</option>
          <option value="completed">Завершен</option>
        </select>

        <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} style={{ padding: '8px' }}>
          <option value="">Все виды спорта</option>
          <option value="Футбол">Футбол</option>
          <option value="Баскетбол">Баскетбол</option>
          <option value="Киберспорт">Киберспорт</option>
        </select>
        
      </div>

      {/* ТАБЛИЦА ТУРНИРОВ */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>Название</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>Вид спорта</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>Дата начала</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>Статус</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>Призовой фонд</th>
          </tr>
        </thead>
        <tbody>
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}><strong>{t.name}</strong></td>
                <td style={{ padding: '10px' }}>{t.sport_type}</td>
                <td style={{ padding: '10px' }}>{t.start_date}</td>
                <td style={{ padding: '10px' }}>
                  {/* Красивые бейджики статусов */}
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', color: '#fff',
                    backgroundColor: t.status === 'registration' ? '#2196F3' : t.status === 'active' ? '#4CAF50' : '#9E9E9E' 
                  }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>{t.prize_pool.toLocaleString()} ₽</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Турниры не найдены 😔</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;