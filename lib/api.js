const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export async function getEventos() {
  const resposta = await fetch(`${API}/eventos`, { cache: 'no-store' });
  if (!resposta.ok) throw new Error('Erro ao buscar eventos');
  return resposta.json();
}

export async function getParticipantes() {
  const resposta = await fetch(`${API}/participantes`, { cache: 'no-store' });
  if (!resposta.ok) throw new Error('Erro ao buscar participantes');
  return resposta.json();
}

export async function cadastrarParticipante(dados) {
  const resposta = await fetch(`${API}/participantes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  let retorno;
  try {
    retorno = await resposta.json();
  } catch {
    retorno = {};
  }

  return { ok: resposta.ok, dados: retorno };
}

export async function getInscritos(eventoId) {
  const resposta = await fetch(`${API}/eventos/${eventoId}/inscritos`, { cache: 'no-store' });
  if (!resposta.ok) throw new Error('Erro ao buscar inscritos');
  return resposta.json();
}

export async function inscrever(evento_id, participante_id) {
  const resposta = await fetch(`${API}/inscricoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evento_id, participante_id })
  });

  let dados;
  try {
    dados = await resposta.json();
  } catch {
    dados = {};
  }

  return { ok: resposta.ok, dados };
}