// Em produção, este módulo enviaria a imagem a uma API de visão computacional
// (ex: TensorFlow Lite embarcado ou serviço de cloud vision).
// Para a apresentação, usamos um mock que simula o processamento.
// =============================================================================

// Base de conhecimento: categorias de resíduos e suas instruções
export const WASTE_CATEGORIES = {
  papel: {
    id:       'papel',
    label:    'Papel e Papelão',
    color:    '#1565C0',
    icon:     '📄',
    lixeira:  'Azul',
    instrucoes: [
      'Dobre ou amasse para economizar espaço',
      'Remova clipes, grampos e plástico antes',
      'Evite papel engordurado ou molhado',
      'Papelão deve ser desmontado',
    ],
    exemplos: ['Jornal', 'Revista', 'Caixa de cereal', 'Papel A4'],
    reciclavel: true,
  },
  plastico: {
    id:       'plastico',
    label:    'Plástico',
    color:    '#E53935',
    icon:     '🧴',
    lixeira:  'Vermelha',
    instrucoes: [
      'Lave e seque antes de descartar',
      'Amasse garrafas PET para economizar espaço',
      'Verifique o símbolo de reciclagem (triângulo)',
      'Sacolas plásticas podem ser devolvidas em supermercados',
    ],
    exemplos: ['Garrafa PET', 'Embalagem de shampoo', 'Pote de iogurte', 'Sacola'],
    reciclavel: true,
  },
  vidro: {
    id:       'vidro',
    label:    'Vidro',
    color:    '#2E7D32',
    icon:     '🫙',
    lixeira:  'Verde',
    instrucoes: [
      'Lave o recipiente antes do descarte',
      'Não quebre o vidro – risco de cortes',
      'Tampas metálicas devem ser separadas',
      'Espelhos e vidros de janela não são recicláveis',
    ],
    exemplos: ['Pote de conserva', 'Garrafa de vidro', 'Frasco de perfume'],
    reciclavel: true,
  },
  metal: {
    id:       'metal',
    label:    'Metal e Alumínio',
    color:    '#F9A825',
    icon:     '🥫',
    lixeira:  'Amarela',
    instrucoes: [
      'Lave latas antes de descartar',
      'Amasse as latas para economizar espaço',
      'Aerossóis vazios são recicláveis',
      'Papel alumínio limpo pode ser reciclado',
    ],
    exemplos: ['Lata de refrigerante', 'Lata de sardinha', 'Papel alumínio', 'Panela velha'],
    reciclavel: true,
  },
  organico: {
    id:       'organico',
    label:    'Resíduo Orgânico',
    color:    '#6D4C41',
    icon:     '🍎',
    lixeira:  'Marrom',
    instrucoes: [
      'Pode ser usado para compostagem doméstica',
      'Evite misturar com resíduos recicláveis',
      'Borra de café e cascas de frutas são ótimas para adubo',
      'Busque projetos de compostagem comunitária',
    ],
    exemplos: ['Cascas de frutas', 'Restos de comida', 'Borra de café', 'Folhas secas'],
    reciclavel: false,
  },
  rejeito: {
    id:       'rejeito',
    label:    'Rejeito',
    color:    '#757575',
    icon:     '🗑️',
    lixeira:  'Cinza/Preta',
    instrucoes: [
      'Vai para o lixo comum (aterro sanitário)',
      'Não misture com recicláveis',
      'Fraldas, absorventes e papel higiênico são rejeitos',
      'Procure reduzir o consumo deste tipo de material',
    ],
    exemplos: ['Fralda', 'Papel higiênico usado', 'Isopor', 'Cerâmica quebrada'],
    reciclavel: false,
  },
};


// Lista de categorias para sorteio aleatório (mock)
const CATEGORY_KEYS = Object.keys(WASTE_CATEGORIES);

// Função principal: classifica a imagem capturada
// Em produção: enviaria o URI da imagem para o modelo de ML
// No mock: simula latência de rede e retorna resultado aleatório
export async function classifyImage(imageUri) {
  const delay = 800 + Math.random() * 1200;
  await new Promise(resolve => setTimeout(resolve, delay));

  if (Math.random() < 0.10) {
    throw new Error('Não foi possível identificar o resíduo. Tente novamente com melhor iluminação.');
  }

  const randomKey      = CATEGORY_KEYS[Math.floor(Math.random() * CATEGORY_KEYS.length)];
  const category       = WASTE_CATEGORIES[randomKey];

  const confidence = Math.floor(72 + Math.random() * 26);

  return {
    category,
    confidence,
    imageUri,
    timestamp: new Date().toISOString(),
  };
}
