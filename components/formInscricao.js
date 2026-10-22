'use client';

import { useState } from 'react';

export default function FormInscricao({ eventos, participantes, onInscrever }) {
  const [eventoId, setEventoId] = useState('');
  const [participanteId, setParticipanteId] = useState('');

  const eventoSelecionado = eventos.find((e) => String(e.id) === String(eventoId));
  const eventoLotado = eventoSelecionado && eventoSelecionado.vagas_restantes <= 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!eventoId || !participanteId || eventoLotado) return;

    const sucesso = await onInscrever(eventoId, participanteId);
    if (sucesso) {
      setEventoId('');
      setParticipanteId('');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h2>Realizar Inscrição</h2>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'block' }}>Evento:</label>
        <select 
          value={eventoId} 
          onChange={(e) => setEventoId(e.target.value)} 
          required
          style={{ width: '100%', padding: '0.4rem' }}
        >
          <option value="">Selecione um evento...</option>
          {eventos.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.titulo} {ev.vagas_restantes <= 0 ? '(Lotado)' : `(${ev.vagas_restantes} vagas)`}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'block' }}>Participante:</label>
        <select 
          value={participanteId} 
          onChange={(e) => setParticipanteId(e.target.value)} 
          required
          style={{ width: '100%', padding: '0.4rem' }}
        >
          <option value="">Selecione um participante...</option>
          {participantes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} - {p.turma}
            </option>
          ))}
        </select>
      </div>

      <button 
        type="submit" 
        disabled={!eventoId || !participanteId || eventoLotado}
        style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}
      >
        {eventoLotado ? 'Evento Lotado' : 'Inscrever'}
      </button>
    </form>
  );
}