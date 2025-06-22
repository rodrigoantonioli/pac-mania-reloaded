
# 🕹️ Pac-Man Game

Um jogo Pac-Man moderno desenvolvido com React, TypeScript e Tailwind CSS.

![Pac-Man Game](https://img.shields.io/badge/Game-Pac--Man-yellow?style=for-the-badge&logo=pac-man)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🎮 Sobre o Jogo

Este é uma recriação moderna do clássico jogo Pac-Man, desenvolvida com tecnologias web atuais. O jogo mantém a jogabilidade original enquanto oferece gráficos modernos e uma interface responsiva.

### ✨ Características

- 🕹️ **Jogabilidade Clássica**: Movimento fluido e mecânicas fiéis ao original
- 👻 **IA dos Fantasmas**: 4 fantasmas com comportamentos únicos (scatter, chase, frightened)
- 🏆 **Sistema de Pontuação**: Pontos por dots, power pellets e fantasmas
- 🎯 **Múltiplos Controles**: Setas, WASD, e controles visuais
- 📱 **Design Responsivo**: Otimizado para diferentes tamanhos de tela
- 🎨 **Animações Suaves**: Transições e efeitos visuais modernos

### 🎯 Como Jogar

**Objetivo**: Coma todos os dots evitando os fantasmas!

**Controles**:
- **Movimento**: Setas (↑↓←→) ou WASD
- **Iniciar**: Enter
- **Pausar**: Espaço ou Escape
- **Reiniciar**: R (quando game over)

**Pontuação**:
- Dot normal: 10 pontos
- Power Pellet: 50 pontos
- Fantasma (assustado): 200 pontos

## 🚀 Quick Start

### Usando Lovable

1. Acesse [Lovable Project](https://lovable.dev/projects/dad40345-de2e-4bb8-b129-38b65f1aeb71)
2. Clique em "Share" → "Publish" para jogar online

### Desenvolvimento Local

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>
cd pacman-game

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

### Build para Produção

```bash
npm run build
```

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Build**: Vite
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── PacManGame.tsx      # Lógica principal do jogo
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

## 📖 Documentação

Para documentação completa, incluindo arquitetura, estratégias de jogo e guia de contribuição, consulte [GAME_DOCUMENTATION.md](./GAME_DOCUMENTATION.md).

## 🎮 Features Implementadas

- ✅ Movimento suave do Pac-Man
- ✅ IA inteligente dos fantasmas
- ✅ Sistema de colisões
- ✅ Power pellets e modo "frightened"
- ✅ Sistema de vidas e pontuação
- ✅ Controles de teclado e interface
- ✅ Animações e feedback visual
- ✅ Design responsivo

## 🔮 Próximas Features

- [ ] Efeitos sonoros
- [ ] Múltiplos níveis
- [ ] High scores
- [ ] Controles touch para mobile
- [ ] Frutas bônus
- [ ] Modos de jogo alternativos

## 🌐 Deploy

### Lovable (Recomendado)
1. Abra o projeto no Lovable
2. Clique em "Publish" no topo direito
3. Compartilhe o link gerado

### Outras Plataformas
- **Vercel**: `vercel --prod`
- **Netlify**: Arraste a pasta `dist` após build
- **GitHub Pages**: Configure workflow de deploy

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/MinhaFeature`
3. Commit: `git commit -m 'Adiciona MinhaFeature'`
4. Push: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🔗 Links Úteis

- [Lovable Project](https://lovable.dev/projects/dad40345-de2e-4bb8-b129-38b65f1aeb71)
- [Documentação Completa](./GAME_DOCUMENTATION.md)
- [Lovable Docs](https://docs.lovable.dev/)

---

**Desenvolvido com ❤️ por [Seu Nome]**

*Divirta-se jogando! 🕹️*
