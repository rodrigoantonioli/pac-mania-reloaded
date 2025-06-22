
# 🕹️ Pac-Man Game - Documentação Completa

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Controles](#controles)
- [Arquitetura do Código](#arquitetura-do-código)
- [Como Jogar](#como-jogar)
- [Instalação e Execução](#instalação-e-execução)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## 🎮 Visão Geral

Este é um jogo Pac-Man desenvolvido em React com TypeScript, utilizando Tailwind CSS para estilização. O jogo apresenta a jogabilidade clássica do Pac-Man com gráficos modernos e responsivos.

## ⭐ Funcionalidades

### Principais
- **Movimento do Pac-Man**: Controle fluido com teclado
- **Fantasmas Inteligentes**: 4 fantasmas com IA diferenciada
- **Sistema de Pontuação**: Pontos por dots, power pellets e fantasmas
- **Níveis Progressivos**: Dificuldade crescente
- **Vidas**: Sistema de 3 vidas
- **Power Pellets**: Torna fantasmas vulneráveis temporariamente

### Modos dos Fantasmas
- **Scatter**: Movimento aleatório pelos cantos
- **Chase**: Perseguição ativa do Pac-Man
- **Frightened**: Vulneráveis após power pellet

### Interface
- **Tela de Início**: Apresentação e instruções
- **HUD**: Score, vidas e nível em tempo real
- **Controles Visuais**: Botões para iniciar, pausar e reiniciar
- **Feedback Visual**: Animações e transições suaves

## 🎯 Controles

### Teclado
- **Setas (↑↓←→)**: Movimento do Pac-Man
- **WASD**: Movimento alternativo
- **Enter**: Iniciar jogo
- **Espaço**: Pausar/Despausar
- **Escape**: Pausar
- **R**: Reiniciar (quando game over)

### Interface
- **Botão Iniciar**: Começar nova partida
- **Botão Pausar**: Pausar jogo em andamento
- **Botão Reiniciar**: Resetar jogo a qualquer momento

## 🏗️ Arquitetura do Código

### Estrutura de Arquivos
```
src/
├── components/
│   ├── PacManGame.tsx      # Componente principal do jogo
│   ├── GameBoard.tsx       # Renderização do tabuleiro
│   └── GameUI.tsx          # Interface do usuário
├── types/
│   └── game.ts             # Tipos TypeScript
├── utils/
│   ├── gameConstants.ts    # Constantes e estado inicial
│   └── mazeData.ts         # Dados do labirinto
└── pages/
    └── Index.tsx           # Página principal
```

### Componentes Principais

#### PacManGame.tsx
- **Responsabilidade**: Lógica principal do jogo
- **Funcionalidades**:
  - Gerenciamento de estado
  - Loops de jogo (Pac-Man e fantasmas)
  - Detecção de colisões
  - Controle de teclado
  - Sistema de pontuação

#### GameBoard.tsx
- **Responsabilidade**: Renderização visual
- **Funcionalidades**:
  - Desenho do labirinto
  - Renderização de personagens
  - Animações visuais
  - Overlays de status

#### GameUI.tsx
- **Responsabilidade**: Interface do usuário
- **Funcionalidades**:
  - Exibição de estatísticas
  - Controles de jogo
  - Mensagens de status

### Tipos de Dados

#### GameState
```typescript
type GameState = {
  score: number;
  lives: number;
  level: number;
  gameStatus: 'ready' | 'playing' | 'paused' | 'gameOver';
  pacman: PacMan;
  ghosts: Ghost[];
  maze: number[][];
  dotsRemaining: number;
};
```

## 🎲 Como Jogar

### Objetivo
Coma todos os dots (pontos) do labirinto evitando os fantasmas.

### Pontuação
- **Dot normal**: 10 pontos
- **Power Pellet**: 50 pontos
- **Fantasma**: 200 pontos (apenas quando assustado)

### Estratégias
1. **Planeje sua rota**: Evite becos sem saída
2. **Use os túneis**: Passe de um lado para outro do labirinto
3. **Power Pellets**: Use estrategicamente para comer fantasmas
4. **Padrões dos fantasmas**: Aprenda os comportamentos

### Condições de Vitória/Derrota
- **Vitória**: Comer todos os dots do nível
- **Derrota**: Perder todas as 3 vidas

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos
1. Clone o repositório:
```bash
git clone <repository-url>
cd pacman-game
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

### Build para Produção
```bash
npm run build
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Estilização
- **Lucide React**: Ícones

### Bibliotecas de UI
- **Shadcn/ui**: Componentes base
- **Sonner**: Notificações toast
- **React Router**: Navegação

### Ferramentas de Desenvolvimento
- **ESLint**: Linting
- **TypeScript**: Type checking
- **Vite**: Hot reload e build

## 📱 Responsividade

O jogo é otimizado para:
- **Desktop**: Experiência completa com teclado
- **Tablet**: Layout adaptado
- **Mobile**: Controles touch (futuro)

## 🔧 Configurações

### Performance
- **Pac-Man Speed**: 150ms por movimento
- **Ghost Speed**: 250ms por movimento
- **Power Pellet Duration**: 8 segundos

### Labirinto
- **Dimensões**: 27x31 células
- **Tamanho da célula**: 20px
- **Elementos**: Paredes, dots, power pellets, túneis

## 🎨 Estilo Visual

### Cores
- **Pac-Man**: Amarelo (#F59E0B)
- **Fantasmas**: Vermelho, Rosa, Ciano, Laranja
- **Labirinto**: Azul (#1E3A8A)
- **Dots**: Amarelo claro (#FDE68A)

### Animações
- **Pac-Man**: Rotação baseada na direção
- **Fantasmas**: Animação de "assustado"
- **UI**: Transições suaves
- **Pulse**: Power pellets pulsantes

## 🐛 Debugging

### Console Logs
O jogo inclui logs para debugging:
- Movimento de personagens
- Mudanças de estado
- Colisões
- Pontuação

### Problemas Comuns
1. **Fantasmas parados**: Verificar validação de movimento
2. **Performance**: Verificar loops e useEffect
3. **Controles**: Verificar event listeners

## 📈 Futuras Melhorias

### Planejadas
- [ ] Múltiplos níveis com layouts diferentes
- [ ] Sistema de high scores
- [ ] Efeitos sonoros
- [ ] Controles touch para mobile
- [ ] Animações mais elaboradas
- [ ] Frutas bônus
- [ ] Modos de jogo alternativos

### Técnicas
- [ ] Otimização de performance
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)
- [ ] Multiplayer local

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando React e TypeScript**
