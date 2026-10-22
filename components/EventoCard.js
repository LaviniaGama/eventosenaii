'use client';

import { useState } from 'react';
import { getInscritos } from '@/lib/api';

export default function EventoCard({ evento }) {
  const [inscritos, setInscritos] = useState([]);
  const [mostrarInscritos, setMostrarInscritos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const lotado = evento.vagas_restantes <= 0;
  const encerrado = new Date(evento.data_evento) < new Date();
  const dataFormatada = new Date(evento.data_evento).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  async function handleToggleInscritos() {
    if (!mostrarInscritos) {
      setCarregando(true);
      try { setInscritos(await getInscritos(evento.id)); }
      catch (err) { console.error(err); }
      finally { setCarregando(false); }
    }
    setMostrarInscritos(!mostrarInscritos);
  }

  return (
    <article className="card event-card">
      <span className="tag">{evento.categoria}</span>
      <h3>{evento.titulo}</h3>
      {evento.descricao && <p className="event-description">{evento.descricao}</p>}
      <p className="event-detail"><span>◷</span><span>{dataFormatada}</span></p>
      <p className="event-detail"><span>⌖</span><span>{evento.local}</span></p>
      <div className="event-footer"><span className="seats">Vagas: <strong>{lotado ? 'Esgotadas' : evento.vagas_restantes}</strong></span><span className={`status ${lotado || encerrado ? 'full' : ''}`}>{encerrado ? 'Encerrado' : lotado ? 'Lotado' : 'Inscrições abertas'}</span></div>
      <button className="button button-secondary" style={{ marginTop: 12 }} onClick={handleToggleInscritos}>{mostrarInscritos ? 'Ocultar participantes' : 'Ver participantes'}</button>
      {mostrarInscritos && <div className="registrants"><strong>Participantes inscritos</strong><br />{carregando ? 'Carregando...' : inscritos.length ? inscritos.map((p) => <div key={p.id}>{p.nome} · {p.turma}</div>) : 'Ainda não há participantes inscritos.'}</div>}
    </article>
  );
}
