'use client';

import { useState } from 'react';

export default function GerenciarParticipantes({ participantes, onAtualizar, onExcluir }) {
  const [editando, setEditando] = useState(null);
  const [dados, setDados] = useState({ nome: '', email: '', turma: '' });

  function iniciarEdicao(participante) {
    setEditando(participante.id);
    setDados({ nome: participante.nome, email: participante.email, turma: participante.turma });
  }

  async function salvar(e) {
    e.preventDefault();
    const sucesso = await onAtualizar(editando, dados);
    if (sucesso) setEditando(null);
  }

  return (
    <section className="manage-events participant-management">
      <h3>Gerenciar participantes</h3>
      <p className="form-intro">Edite os dados ou remova participantes cadastrados.</p>
      {participantes.length ? participantes.map((participante) => (
        <div className="participant-row" key={participante.id}>
          {editando === participante.id ? (
            <form className="participant-edit-form" onSubmit={salvar}>
              <label>Nome<input value={dados.nome} onChange={(e) => setDados({ ...dados, nome: e.target.value })} required /></label>
              <label>E-mail<input type="email" value={dados.email} onChange={(e) => setDados({ ...dados, email: e.target.value })} required /></label>
              <label>Turma<input value={dados.turma} onChange={(e) => setDados({ ...dados, turma: e.target.value })} required /></label>
              <div className="participant-actions">
                <button className="button button-primary" type="submit">Salvar</button>
                <button className="button button-secondary" type="button" onClick={() => setEditando(null)}>Cancelar</button>
              </div>
            </form>
          ) : (
            <>
              <div className="participant-info"><strong>{participante.nome}</strong><span>{participante.email} · {participante.turma}</span></div>
              <div className="event-actions">
                <button className="button button-secondary" type="button" onClick={() => iniciarEdicao(participante)}>Editar</button>
                <button className="button button-danger" type="button" onClick={() => onExcluir(participante)}>Excluir</button>
              </div>
            </>
          )}
        </div>
      )) : <p className="form-intro">Ainda não há participantes cadastrados.</p>}
    </section>
  );
}