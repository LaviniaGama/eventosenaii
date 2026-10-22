'use client';

import { useState } from 'react';
import { getInscritos } from '@/lib/api';

export default function EventoCard({ evento }) {
  const [inscritos, setInscritos] = useState([]);
  const [mostrarInscritos, setMostrarInscritos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const lotado = evento.vagas_restantes <= 0;

  // Formatação de data no formato dd/mm/aaaa hh:mm
  const dataFormatada = new Date(evento.data_evento).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  async function handleToggleInscritos() {
    if (!mostrarInscritos) {
      setCarregando(true);
      try {
        const lista = await getInscritos(evento.id);
        setInscritos(lista);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    setMostrarInscritos(!mostrarInscritos);
  }

  return (
    <article className="card" style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>{evento.titulo}</h3>
      <span className="tag" style={{ background: '#eee', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
        {evento.categoria}
      </span>
      <p>📍 {evento.local}</p>
      <p>📅 {dataFormatada}</p>
      <p>
        {lotado ? (
          <strong style={{ color: 'red' }}>Lotado</strong>
        ) : (
          <>Vagas restantes: <strong>{evento.vagas_restantes}</strong></>
        )}
      </p>

      <button onClick={handleToggleInscritos}>
        {mostrarInscritos ? 'Ocultar inscritos' : 'Ver inscritos'}
      </button>

      {mostrarInscritos && (
        <div style={{ marginTop: '0.5rem' }}>
          <h4>Inscritos:</h4>
          {carregando ? (
            <p>A carregar...</p>
          ) : inscritos.length === 0 ? (
            <p>Nenhum inscrito até ao momento.</p>
          ) : (
            <ul>
              {inscritos.map((p) => (
                <li key={p.id}>{p.nome} ({p.turma})</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}