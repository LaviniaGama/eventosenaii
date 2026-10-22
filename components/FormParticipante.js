'use client';

import { useState } from 'react';

export default function FormParticipante({ onCadastrar }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [turma, setTurma] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome || !email || !turma) return;

    const sucesso = await onCadastrar({ nome, email, turma });
    if (sucesso) {
      setNome('');
      setEmail('');
      setTurma('');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h2>Cadastrar Participante</h2>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'block' }}>Nome:</label>
        <input 
          type="text" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
          style={{ width: '100%', padding: '0.4rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'block' }}>E-mail:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ width: '100%', padding: '0.4rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'block' }}>Turma:</label>
        <input 
          type="text" 
          value={turma} 
          onChange={(e) => setTurma(e.target.value)} 
          required 
          style={{ width: '100%', padding: '0.4rem' }}
        />
      </div>
      <button type="submit" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
        Cadastrar
      </button>
    </form>
  );
}