'use client';

import { useState } from 'react';

export default function FormParticipante({ onCadastrar }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [turma, setTurma] = useState('');
  const [salvo, setSalvo] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const sucesso = await onCadastrar({ nome, email, turma });
    if (sucesso) { setNome(''); setEmail(''); setTurma(''); setSalvo(true); setTimeout(() => setSalvo(false), 3500); }
  }

  return <form className="form-card" onSubmit={handleSubmit}><h3>Novo participante</h3><p className="form-intro">Cadastre os dados para liberar a inscrição nos eventos.</p><div className="form-fields"><label>Nome completo<input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do participante" required /></label><label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@email.com" required /></label><label>Turma<input type="text" value={turma} onChange={(e) => setTurma(e.target.value)} placeholder="Ex.: 2º ano de Desenvolvimento" required /></label></div><button className="button button-primary" type="submit">＋ Cadastrar participante</button>{salvo && <p className="inline-success">Participante cadastrado com sucesso.</p>}</form>;
}
