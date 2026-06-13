// Base de Dados de Ecopontos
// Lista de pontos de coleta seletiva cadastrados.
// Em produção, estes dados viriam de uma API REST ou banco de dados
// geoespacial (ex: Firebase + GeoFirestore ou PostGIS).

export const ECOPONTOS = [
  {
    id:      'ep001',
    nome:    'Ecoponto Central',
    endereco:'Av. Colombo, 5790 – Zona 7',
    cidade:  'Maringá – PR',
    lat:     -23.4273,
    lng:     -51.9375,
    horario: 'Seg–Sex: 7h–18h | Sáb: 7h–13h',
    aceita:  ['papel', 'plastico', 'vidro', 'metal'],
    distancia: 1.2,
    avaliacao: 4.5,
  },
  {
    id:      'ep002',
    nome:    'Ecoponto Parque do Ingá',
    endereco:'R. Itambé, s/n – Zona 5',
    cidade:  'Maringá – PR',
    lat:     -23.4201,
    lng:     -51.9301,
    horario: 'Seg–Dom: 6h–20h',
    aceita:  ['papel', 'plastico', 'vidro', 'metal', 'organico'],
    distancia: 2.8,
    avaliacao: 4.8,
  },
  {
    id:      'ep003',
    nome:    'Ecoponto Shopping Catuaí',
    endereco:'Av. Carneiro Leão, 563',
    cidade:  'Maringá – PR',
    lat:     -23.4380,
    lng:     -51.9200,
    horario: 'Seg–Dom: 10h–22h',
    aceita:  ['papel', 'plastico', 'metal'],
    distancia: 3.5,
    avaliacao: 4.2,
  },
  {
    id:      'ep004',
    nome:    'Ecoponto Zona Norte',
    endereco:'R. Francisco Glicério, 1200 – Jd. Alvorada',
    cidade:  'Maringá – PR',
    lat:     -23.4100,
    lng:     -51.9450,
    horario: 'Ter–Sáb: 8h–17h',
    aceita:  ['papel', 'plastico', 'vidro', 'metal', 'organico', 'rejeito'],
    distancia: 4.1,
    avaliacao: 4.0,
  },
  {
    id:      'ep005',
    nome:    'Ecoponto UEM – Campus',
    endereco:'Av. Colombo, 5790 – Bloco C22',
    cidade:  'Maringá – PR',
    lat:     -23.4260,
    lng:     -51.9390,
    horario: 'Seg–Sex: 7h–22h',
    aceita:  ['papel', 'plastico', 'vidro', 'metal'],
    distancia: 1.0,
    avaliacao: 4.7,
  },
];


// Filtra ecopontos que aceitam determinada categoria de resíduo
export function filtrarPorCategoria(categoria) {
  return ECOPONTOS.filter(ep => ep.aceita.includes(categoria))
                  .sort((a, b) => a.distancia - b.distancia);
}


// Retorna o ecoponto mais próximo para uma categoria
export function ecopontoMaisProximo(categoria) {
  const lista = filtrarPorCategoria(categoria);
  return lista.length > 0 ? lista[0] : null;
}
