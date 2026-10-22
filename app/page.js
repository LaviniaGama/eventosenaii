'use client';

import { useEffect, useState } from 'react';
import { cadastrarParticipante, getEventos, getParticipantes, inscrever } from '@/lib/api';
import EventoCard from '@/components/EventoCard';
import FormParticipante from '@/components/FormParticipante';
import FormInscricao from '@/components/formInscricao';

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [mensagem, setMensagem] = useState(null);

  async function carregarEventos() {
    try {
      setEventos(await getEventos());
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: erro.message });
    }
  }

  async function carregarParticipantes() {
    try {
      setParticipantes(await getParticipantes());
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: erro.message });
    }
  }

  useEffect(() => {
    carregarEventos();
    carregarParticipantes();
  }, []);

  async function handleCadastrarParticipante(dados) {
    const { ok, dados: retorno } = await cadastrarParticipante(dados);
    if (!ok) {
      setMensagem({ tipo: 'erro', texto: retorno.erro || 'Erro ao cadastrar participante.' });
      return false;
    }

    setMensagem({ tipo: 'sucesso', texto: 'Participante cadastrado com sucesso!' });
    await carregarParticipantes();
    return true;
  }

  async function handleInscrever(eventoId, participanteId) {
    const { ok, dados } = await inscrever(eventoId, participanteId);
    if (!ok) {
      setMensagem({ tipo: 'erro', texto: dados.erro || 'Não foi possível realizar a inscrição.' });
      return false;
    }

    setMensagem({ tipo: 'sucesso', texto: 'Inscrição realizada com sucesso!' });
    await carregarEventos();
    await carregarParticipantes();
    return true;
  }

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>EventoSENAI</h1>

      {mensagem && (
        <p
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: mensagem.tipo === 'sucesso' ? '#e8f7ed' : '#fdecea',
            color: mensagem.tipo === 'sucesso' ? '#166534' : '#b42318',
            border: `1px solid ${mensagem.tipo === 'sucesso' ? '#86efac' : '#f5b7b1'}`
          }}
        >
          {mensagem.texto}
        </p>
      )}

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginBottom: '2rem' }}>
        {eventos.map((ev) => (
          <EventoCard key={ev.id} evento={ev} />
        ))}
      </section>

      <section style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <FormParticipante onCadastrar={handleCadastrarParticipante} />
        <FormInscricao eventos={eventos} participantes={participantes} onInscrever={handleInscrever} />
      </section>
    </main>
  );
}