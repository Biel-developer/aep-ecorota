# 🌿 EcoApp – Aplicativo de Gestão Inteligente de Resíduos Urbanos

> Projeto Interdisciplinar – AEP 7º Semestre  
> Disciplinas: Programação Mobile · Teoria da Computação · Engenharia de Software

---

## 👥 Autores
| Nome | RA |
|---|---|
| Lucas de Oliveira Lima | 23000810-2 |
| Alexandre Lozano de Souza | 23003803-2 |
| Gabriel do Nascimento Cano Andrade | 23000555-2 |

---

## 📱 Sobre o Projeto

O **EcoApp** é um aplicativo móvel que utiliza **Inteligência Artificial** para classificar resíduos sólidos urbanos por meio da câmera do smartphone, orientando o usuário sobre o descarte correto e indicando o ecoponto mais próximo. O projeto integra os princípios do **ODS 11** da Agenda 2030 da ONU com tecnologias modernas de engenharia de software.

---

## 🗂️ Estrutura do Projeto

```
EcoApp/
├── App.js                          # Ponto de entrada do app
├── app.json                        # Configuração do Expo
├── package.json                    # Dependências npm
├── babel.config.js                 # Configuração Babel/Expo
└── src/
    ├── theme.js                    # 🎨 Tema global (cores, fontes, espaçamentos)
    ├── automaton.js                # 🤖 AFD – Teoria da Computação
    ├── classifier.js               # 🧠 Módulo de IA (classificação de resíduos)
    ├── navigation/
    │   └── AppNavigator.js         # 🗺️ Stack + Bottom Tab Navigator
    ├── screens/
    │   ├── HomeScreen.js           # 🏠 Dashboard / Tela Inicial
    │   ├── ScanScreen.js           # 📷 Escaneamento com câmera + IA
    │   ├── EcopontosScreen.js      # 📍 Lista e filtro de ecopontos
    │   ├── GuiaScreen.js           # 📚 Guia de educação ambiental
    │   └── PerfilScreen.js         # 👤 Perfil e gamificação
    └── data/
        └── ecopontos.js            # 📊 Base de dados dos pontos de coleta
```

---

## 🧠 Fundamentação Teórica

### Teoria da Computação (SIPSER, 2012)
O módulo `src/automaton.js` implementa um **Autômato Finito Determinístico (AFD)** que controla os estados de navegação do usuário durante o fluxo de escaneamento:

```
M = (Q, Σ, δ, q₀, F)

Q  = { idle, scanning, classifying, result_shown,
       route_planning, navigating, completed, error }

Σ  = { OPEN_CAMERA, CAPTURE_IMAGE, CLASSIFICATION_OK,
       CLASSIFICATION_FAIL, REQUEST_ROUTE, START_NAVIGATION,
       CONFIRM_DISPOSAL, RESET, ERROR_OCCURRED }

q₀ = idle
F  = { completed }
```

### Inteligência Artificial (RUSSELL & NORVIG, 2022)
O módulo `src/classifier.js` implementa um **agente inteligente** baseado no modelo percepção-raciocínio-ação:
- **Percepção:** imagem capturada pela câmera
- **Raciocínio:** modelo de visão computacional (simulado com mock para a apresentação)
- **Ação:** retorna categoria, confiança e instruções de descarte

Em produção, o classificador seria substituído por um modelo **TensorFlow Lite** embarcado ou integração com API de cloud vision.

### Engenharia de Software (PRESSMAN & MAXIM, 2021)
- **Metodologia ágil:** estrutura modular com separação de responsabilidades
- **Princípio Open/Closed:** navegação extensível sem alteração de código existente
- **Manutenibilidade:** tema centralizado (`theme.js`) e dados separados (`data/`)

---

## 🚀 Como Executar

### Pré-requisitos
```bash
node --version   # v18+ recomendado
npm --version
```

### Instalação
```bash
cd EcoApp
npm install
```

### Iniciar o projeto
```bash
npx expo start
```

Depois escaneie o QR Code com o aplicativo **Expo Go** (iOS ou Android).

---

## 📲 Funcionalidades

| Tela | Funcionalidade |
|---|---|
| **Home** | Dashboard com dicas rotativas, estatísticas e acesso rápido |
| **Scan** | Câmera + IA para classificar resíduos + fluxo controlado por AFD |
| **Ecopontos** | Lista filtrável de pontos de coleta com rota via Google Maps |
| **Guia** | Educação ambiental: categorias, cores (ABNT), instruções |
| **Perfil** | Gamificação: pontos, conquistas, histórico, impacto ambiental |

---

## 📚 Referências

- PRESSMAN, R. S.; MAXIM, B. R. *Engenharia de Software: uma abordagem profissional*. 9. ed. Porto Alegre: AMGH, 2021.
- RUSSELL, S.; NORVIG, P. *Inteligência Artificial: uma abordagem moderna*. 4. ed. Rio de Janeiro: LTC, 2022.
- SANTOS, A. C.; SILVA, M. R. Tecnologias digitais e sustentabilidade urbana. *Revista de Tecnologia e Sociedade*, Curitiba, v. 18, n. 45, p. 112-128, 2022.
- SIPSER, M. *Introdução à Teoria da Computação*. 2. ed. São Paulo: Cengage Learning, 2012.
