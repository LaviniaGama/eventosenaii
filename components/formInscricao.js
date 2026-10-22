'use client';

import { useState } from 'react';

export default function FormInscricao({ eventos, participantes, onInscrever }) {
  const [eventoId, setEventoId] = useState('');
  const [participanteId, setParticipanteId] = useState('');
  const eventoSelecionado = eventos.find((e) => String(e.id) === String(eventoId));
  const eventoPassado = eventoSelecionado && new Date(eventoSelecionado.data_evento) < new Date();
  const eventoLotado = eventoSelecionado && (eventoSelecionado.vagas_restantes <= 0 || eventoPassado);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!eventoId || !participanteId || eventoLotado) return;
    const sucesso = await onInscrever(eventoId, participanteId);
    if (sucesso) { setEventoId(''); setParticipanteId(''); }
  }

  return <form className="form-card" onSubmit={handleSubmit}><h3>Realizar inscrição</h3><p className="form-intro">Selecione um evento e o participante para confirmar a vaga.</p><div className="form-fields"><label>Evento<select value={eventoId} onChange={(e) => setEventoId(e.target.value)} required><option value="">Selecione um evento...</option>{eventos.map((ev) => { const passado = new Date(ev.data_evento) < new Date(); const indisponivel = ev.vagas_restantes <= 0 || passado; return <option key={ev.id} value={ev.id} disabled={indisponivel}>{ev.titulo} {passado ? '(Encerrado)' : ev.vagas_restantes <= 0 ? '(Lotado)' : `(${ev.vagas_restantes} vagas)`}</option>; })}</select></label><label>Participante<select value={participanteId} onChange={(e) => setParticipanteId(e.target.value)} required><option value="">Selecione um participante...</option>{participantes.map((p) => <option key={p.id} value={p.id}>{p.nome} · {p.turma}</option>)}</select></label></div>{eventoSelecionado && eventoPassado && <p className="message error">Este evento já aconteceu e não aceita novas inscrições.</p>}{eventoSelecionado && !eventoPassado && eventoSelecionado.vagas_restantes <= 0 && <p className="message error">As vagas deste evento já foram preenchidas.</p>}<button className="button button-primary" type="submit" disabled={!eventoId || !participanteId || eventoLotado}>Confirmar inscrição</button></form>;
}
