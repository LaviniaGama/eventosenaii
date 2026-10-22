'use client';

import { useEffect, useState } from 'react';
import { cadastrarParticipante, criarEvento, deletarEvento, atualizarEvento, getEventos, getParticipantes, inscrever } from '@/lib/api';
import EventoCard from '@/components/EventoCard';
import FormParticipante from '@/components/FormParticipante';
import FormInscricao from '@/components/formInscricao';

const categorias = [{ id: 1, nome: 'Palestra' }, { id: 2, nome: 'Oficina' }, { id: 3, nome: 'Workshop' }];
const eventoInicial = { id: '', titulo: '', descricao: '', data_evento: '', local: '', vagas: '', categoria_id: '1' };

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [eventoForm, setEventoForm] = useState(eventoInicial);
  const [mensagem, setMensagem] = useState(null);

  async function carregarEventos() {
    try { setEventos(await getEventos(categoriaSelecionada)); }
    catch (erro) { setMensagem({ tipo: 'erro', texto: erro.message }); }
  }
  async function carregarParticipantes() {
    try { setParticipantes(await getParticipantes()); }
    catch (erro) { setMensagem({ tipo: 'erro', texto: erro.message }); }
  }
  useEffect(() => { carregarEventos(); }, [categoriaSelecionada]);
  useEffect(() => { carregarParticipantes(); }, []);

  async function handleCadastrarParticipante(dados) {
    const { ok, dados: retorno } = await cadastrarParticipante(dados);
    if (!ok) { setMensagem({ tipo: 'erro', texto: retorno.erro || 'Não foi possível cadastrar o participante.' }); return false; }
    setMensagem({ tipo: 'sucesso', texto: 'Participante cadastrado com sucesso!' }); await carregarParticipantes(); return true;
  }
  async function handleInscrever(eventoId, participanteId) {
    const { ok, dados } = await inscrever(eventoId, participanteId);
    if (!ok) { setMensagem({ tipo: 'erro', texto: dados.erro || 'Não foi possível realizar a inscrição.' }); return false; }
    setMensagem({ tipo: 'sucesso', texto: 'Inscrição realizada com sucesso!' }); await carregarEventos(); return true;
  }
  function atualizarCampoEvento(chave, valor) { setEventoForm((atual) => ({ ...atual, [chave]: valor })); }
  async function handleSalvarEvento(e) {
    e.preventDefault();
    const dados = { titulo: eventoForm.titulo, descricao: eventoForm.descricao, data_evento: eventoForm.data_evento, local: eventoForm.local, vagas: Number(eventoForm.vagas), categoria_id: Number(eventoForm.categoria_id) };
    const { ok, dados: retorno } = eventoForm.id ? await atualizarEvento(eventoForm.id, dados) : await criarEvento(dados);
    if (!ok) { setMensagem({ tipo: 'erro', texto: retorno.erro || 'Não foi possível salvar o evento.' }); return; }
    setMensagem({ tipo: 'sucesso', texto: eventoForm.id ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!' });
    setEventoForm(eventoInicial); await carregarEventos();
  }
  function handleEditarEvento(evento) {
    const categoriaId = categorias.find((categoria) => categoria.nome === evento.categoria)?.id ?? 1;
    const data = new Date(evento.data_evento);
    const dataLocal = new Date(data.getTime() - data.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setEventoForm({ id: evento.id, titulo: evento.titulo, descricao: evento.descricao || '', data_evento: dataLocal, local: evento.local, vagas: evento.vagas, categoria_id: String(categoriaId) });
    document.getElementById('administracao')?.scrollIntoView({ behavior: 'smooth' });
  }
  async function handleExcluirEvento(id) {
    if (!window.confirm('Deseja excluir este evento?')) return;
    const { ok } = await deletarEvento(id);
    if (!ok) { setMensagem({ tipo: 'erro', texto: 'Não foi possível excluir o evento.' }); return; }
    setMensagem({ tipo: 'sucesso', texto: 'Evento excluído com sucesso!' }); setEventoForm(eventoInicial); await carregarEventos();
  }
  const totalVagas = eventos.reduce((total, ev) => total + Number(ev.vagas_restantes || 0), 0);
  const proximoEvento = eventos.filter((ev) => new Date(ev.data_evento) >= new Date()).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✦</span><span>EventoSENAI<small>Conexões que inspiram</small></span></div>
        <p className="nav-label">Menu principal</p>
        <nav><a className="nav-link active" href="#inicio"><span className="nav-icon">▦</span>Visão geral</a><a className="nav-link" href="#eventos"><span className="nav-icon">◷</span>Explorar eventos</a><a className="nav-link" href="#administracao"><span className="nav-icon">＋</span>Administração</a></nav>
        <div className="sidebar-note"><strong>Aprender. Compartilhar. Evoluir.</strong>Encontre novas ideias e experiências para construir o futuro.</div>
      </aside>
      <div className="main-area">
        <header className="topbar"><div className="breadcrumb">Portal <span> / </span> <strong>Visão geral</strong></div><div className="user-chip"><span className="avatar">ES</span>Comunidade SENAI</div></header>
        <main id="inicio" className="content">
          <section className="welcome"><div><p className="eyebrow">Portal de experiências</p><h1>Descubra seu próximo evento</h1><p className="welcome-copy">Conhecimento, inovação e novas conexões esperam por você.</p></div><div className="date-pill">◷ &nbsp; Agenda aberta para inscrições</div></section>
          {mensagem && <p className={`message ${mensagem.tipo === 'sucesso' ? 'success' : 'error'}`} role="status">{mensagem.texto}</p>}
          <section className="stats-grid" aria-label="Resumo de eventos"><div className="stat-card"><span className="stat-icon">▦</span><div><div className="stat-value">{eventos.length}</div><div className="stat-label">eventos encontrados</div></div></div><div className="stat-card"><span className="stat-icon">◷</span><div><div className="stat-value">{proximoEvento}</div><div className="stat-label">com inscrições abertas</div></div></div><div className="stat-card"><span className="stat-icon">♧</span><div><div className="stat-value">{totalVagas}</div><div className="stat-label">vagas disponíveis</div></div></div></section>
          <section id="eventos">
            <div className="section-heading"><div><h2>Eventos em destaque</h2><p>Escolha uma experiência para aprender algo novo.</p></div><div className="filter-bar"><label className="field-label" htmlFor="categoria">Categoria</label><select className="filter-select" id="categoria" value={categoriaSelecionada} onChange={(e) => setCategoriaSelecionada(e.target.value)}><option value="">Todas as categorias</option>{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}</select></div></div>
            <div className="events-grid">{eventos.length ? eventos.map((ev) => <div className="event-wrap" key={ev.id}><EventoCard evento={ev} /><div className="event-actions"><button className="button button-secondary" type="button" onClick={() => handleEditarEvento(ev)}>Editar evento</button><button className="button button-danger" type="button" onClick={() => handleExcluirEvento(ev.id)}>Excluir</button></div></div>) : <div className="empty-state">Nenhum evento encontrado nesta categoria. Escolha outra opção ou cadastre um novo evento.</div>}</div>
          </section>
          <section id="administracao" className="admin-section"><div className="section-heading"><div><h2>Administração</h2><p>Gerencie eventos, participantes e inscrições em um só lugar.</p></div></div><div className="admin-grid">
            <form className="form-card" onSubmit={handleSalvarEvento}><h3>{eventoForm.id ? 'Editar evento' : 'Criar evento'}</h3><p className="form-intro">Preencha os dados para publicar uma nova experiência.</p><div className="form-fields"><label>Título do evento<input value={eventoForm.titulo} onChange={(e) => atualizarCampoEvento('titulo', e.target.value)} placeholder="Ex.: Jornada de inovação" required /></label><label>Descrição<textarea value={eventoForm.descricao} onChange={(e) => atualizarCampoEvento('descricao', e.target.value)} placeholder="Conte um pouco sobre o evento" rows={3} /></label><div className="field-pair"><label>Data e horário<input type="datetime-local" value={eventoForm.data_evento} onChange={(e) => atualizarCampoEvento('data_evento', e.target.value)} required /></label><label>Categoria<select value={eventoForm.categoria_id} onChange={(e) => atualizarCampoEvento('categoria_id', e.target.value)} required>{categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></label></div><div className="field-pair"><label>Local<input value={eventoForm.local} onChange={(e) => atualizarCampoEvento('local', e.target.value)} placeholder="Unidade ou sala" required /></label><label>Número de vagas<input type="number" min="1" value={eventoForm.vagas} onChange={(e) => atualizarCampoEvento('vagas', e.target.value)} placeholder="Ex.: 30" required /></label></div></div><button className="button button-primary" type="submit">{eventoForm.id ? 'Salvar alterações' : '＋ Publicar evento'}</button>{eventoForm.id && <button className="button button-secondary" type="button" onClick={() => setEventoForm(eventoInicial)}>Cancelar edição</button>}</form>
            <FormParticipante onCadastrar={handleCadastrarParticipante} />
            <FormInscricao eventos={eventos} participantes={participantes} onInscrever={handleInscrever} />
          </div></section>
        </main>
      </div>
    </div>
  );
}
