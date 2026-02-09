# Plano de Execução - FBR-Trends (Unified TypeScript Stack)

Este documento detalha o plano passo-a-passo para construir o FBR-Trends com uma stack unificada em TypeScript, focando em elegância visual e funcionalidade robusta.

## Arquitetura Técnica
- **Monorepo**: Turborepo (opcional) ou Next.js App Router (estruturado).
- **Frontend**: Next.js 14+, Tailwind CSS, Shadcn/UI, Framer Motion (para animações).
- **Backend/API**: Next.js API Routes + **n8n** (para fluxos de background e orquestração).
- **Data Collection**: Scripts Node.js (Playwright) disparados via Webhook pelo **n8n**.
- **Database**: Supabase (Postgres) + Supabase Vector.
- **Automation**: **n8n** (Self-hosted) substituindo filas manuais (BullMQ) para lógica de negócio complexa.

---

## Fase 1: Setup & Infraestrutura Base (Prioridade Alta)

### 1.1. Inicialização do Projeto
- [x] Criar projeto Next.js com TypeScript, Tailwind e ESLint.
- [x] Configurar Shadcn/UI e instalar componentes base (Button, Card, Input, Sheet, etc.).
- [x] Configurar **Clerk** (Middleware, Provider, Components).
- [/] Configurar Supabase (Database Only) e tabelas iniciais.
- [x] Configurar conexão com o banco no Next.js (Drizzle ORM ou Prisma).

### 1.2. Sistema de Design (UI/UX Pro Max)
O objetivo é criar o "Wow Effect" logo de cara.
- [x] Criar tema de cores (Dark Mode default com acentos neon/vibrantes).
- [x] Implementar Layout Shell (Sidebar de navegação com glassmorphism, Header fixo).
- [ ] Criar componente `TrendCard`: o bloco fundamental da UI, exibindo título, gráfico mini e score.

### 1.3. Scraper Engine (Node.js)
- [ ] Criar estrutura de `services/scraper`.
- [ ] Implementar `GoogleTrendsProvider`: classe para buscar dados do Google Trends.
- [ ] Implementar `RSSProvider`: classe para ler feeds RSS.
- [ ] Criar script de teste para validar a coleta de dados e inserção no Supabase.

**Verificação Fase 1:**
- O projeto roda localmente sem erros?
- O tema (Dark/Light) funciona?
- O script de teste consegue salvar 10 trends no banco de dados?

---

## Fase 2: Dashboard & Visualização (O "Coração" do Produto)

### 2.1. Home Dashboard
- [ ] Implementar "Bento Grid" layout para a página inicial.
- [ ] Widget "Trending Now": Lista das top 5 tendências do momento com ícones de subida/descida.
- [ ] Widget "Category Heatmap": Visualização rápida de quais categorias estão quentes.

### 2.2. Página de Pesquisa & Filtros
- [ ] Criar barra de busca global (Cmd+K) com animação suave.
- [ ] Implementar filtros de categoria (Tech, Fashion, Crypto) usando Chips selecionáveis.

### 2.3. Detalhes da Tendência (Trend Deep Dive)
- [ ] Criar página `/trend/[slug]`.
- [ ] Adicionar gráfico de linha (LineChart) mostrando histórico de volume (usar Recharts ou Tremor).
- [ ] Criar página `/trend/[slug]`.
- [ ] Adicionar gráfico de linha (LineChart) mostrando histórico de volume (usar Recharts ou Tremor).
- [ ] Exibir "Related Queries" e tópicos correlatos.

### 2.4. Redesign Visual (Claymorphism)
- [ ] Refatorar Landing Page (`src/app/page.tsx`) aplicando conceitos de Claymorphism (Rounded 3D, Soft Shadows).
- [ ] Ajustar cores e tipografia para um visual "Playful & Tactile".

**Verificação Fase 2:**
- A navegação entre Home e Detalhes é instantânea?
- Os gráficos renderizam corretamente com dados mockados e reais?
- A busca global responde em <200ms?

---

## Fase 3: Automação com n8n (O "Cérebro" Operacional)

### 3.1. Infraestrutura n8n
- [ ] Subir container do n8n (Docker Compose) integrado na mesma rede do projeto ou via Easypanel.
- [ ] Configurar credenciais (Supabase, OpenAI, Redes Sociais) no n8n.

### 3.2. Workflows Inteligentes
- [ ] **Workflow "Trend Hunter"**:
    1. Trigger: A cada 4h.
    2. Action: Chama script Node.js de scraping (ou API).
    3. Action: Salva dados crus no Supabase.
    4. Action (Condition): Se score > X, chama Workflow de Análise.
- [ ] **Workflow "Content Analyst"**:
    1. Recebe dados da trend.
    2. Chama OpenAI (GPT-4) para explicar "Por que está em alta?".
    3. Atualiza registro no Supabase com o resumo.

---

## Fase 4: Inteligência Artificial (O "Cérebro")

### 4.1. Integração LLM
- [ ] Configurar cliente OpenAI/Anthropic.
- [ ] Criar prompt para "Resumir Tendência": input (dados brutos) -> output (texto explicativo).

### 4.2. Virality Score
- [ ] Implementar algoritmo de cálculo de score no backend.
- [ ] Exibir score visualmente nos cards (ex: anel de progresso colorido).

**Verificação Fase 4:**
- As explicações geradas pela IA fazem sentido?
- O Virality Score atualiza conforme novos dados chegam?

---
## Plano de Testes (QA)

### Testes Manuais
1.  **Fluxo de Scraping**: Disparar manualmente o job de scraping e verificar se novos registros aparecem na tabela `trends` do Supabase.
2.  **Responsividade**: Abrir o dashboard no modo mobile do DevTools e verificar se o menu lateral vira um "Drawer" e se os gráficos se ajustam.
3.  **Performance**: Rodar Lighthouse na Home page (Meta: Score > 90 em tudo).

### Testes Automatizados (Opcional para MVP, mas recomendado)
- Testes unitários para os Parsers dos scrapers (garantir que mudanças no HTML não quebrem tudo silenciosamente).
