# Product Requirement Document (PRD) - FBR-Trends

## 1. Visão Geral
O **FBR-Trends** é uma plataforma de inteligência de dados projetada para rastrear, agregar e analisar tendências em tempo real a partir de múltiplas fontes (Google, Redes Sociais, Notícias). O objetivo é fornecer insights acionáveis para criadores de conteúdo, profissionais de marketing e empresas, permitindo que eles capitalizem sobre tópicos em ascensão antes que saturem.

## 2. Objetivos
- **Centralizar** dados de tendências de diversas plataformas em um único dashboard.
- **Democratizar** o acesso a *trend intelligence* com uma interface intuitiva e visualmente rica.
- **Automatizar** a coleta e análise de dados para economizar tempo dos usuários.
- **Fornecer contexto** sobre *por que* algo está em alta, não apenas *o que* está em alta.

## 3. Arquitetura Proposta (Unificada TypeScript)
Para garantir velocidade de desenvolvimento, simplicidade operacional e uma experiência de desenvolvedor superior, todo o projeto será construído em TypeScript.
- **Frontend**: Next.js (App Router) com Tailwind CSS e Shadcn/UI para uma interface responsiva e elegante.
- **Autenticação**: **Clerk** (User Management, Multi-session, 2FA).
- **Backend**: Next.js API Routes (Serverless) + **n8n** (Self-hosted) para orquestração de fluxos complexos.
- **Scrapers**: Node.js com Playwright (para sites dinâmicos) - Podem ser chamados via Webhook pelo n8n.
- **Banco de Dados**: Supabase (PostgreSQL) para dados estruturados e vetoriais.
- **Automação**: **n8n** como "cérebro" das operações (Agendamento, Integração com LLMs, Disparo de Alertas).

---

## 4. Etapas de Desenvolvimento

### Fase 1: Fundação & MVP (Mês 1)
O foco é estabelecer a infraestrutura e entregar valor imediato com as fontes de dados mais estáveis.
- **1.1. Configuração do Monorepo TS**
  - Setup do projeto Next.js com Turborepo (opcional) ou estrutura organizada.
  - Configuração do ESLint, Prettier e Husky.
  - Definição da arquitetura de pastas para "features" (vertical slice).
- **1.2. Infra de Automação (n8n)**
  - Setup do n8n (Self-hosted via Docker ou Cloud).
  - Criação do workflow "Master Controller" que orquestra as chamadas de scraping.
  - Integração n8n <-> Supabase.
- **1.3. Scrapers Core (Node.js/n8n)**
  - Implementação de scripts Node.js isolados (para performance) que são chamados pelo n8n.
  - OU uso de nodes HTTP do n8n para APIs oficiais (como YouTube/Reddit).
- **1.3. Dashboard Inicial (Frontend de Alto Nível)**
  - Implementação do Design System usando `ui-ux-pro-max` (Glassmorphism, Dark Mode nativo).
  - Criação de widgets de tendências com gráficos interativos (Recharts ou Tremor).
  - Autenticação completa via **Clerk**.

### Fase 2: Expansão de Fontes & Dados (Mês 2)
Aumentar a amplitude de dados para cobrir redes sociais e comunidades.
- **2.1. Scrapers Sociais**
  - Integração com API do **Reddit** (snoowrap).
  - Integração com API do **YouTube Data** (googleapis).
  - Scraper de **TikTok Creative Center** (via Playwright).
- **2.2. Enriquecimento de Dados**
  - Armazenamento histórico de tendências (para ver evolução).
  - Categorização automática de tendências (Tecnologia, Entretenimento, Política) usando GPT-4o-mini (via API).
- **2.3. Funcionalidades de Interface**
  - Filtros avançados por categoria, país e fonte com animações de transição.
  - Página de detalhes da tendência com "Estudo de Caso" gerado por IA.

### Fase 3: Inteligência & AI (Mês 3)
Transformar dados brutos em insights usando IA.
- **3.1. Integração Profunda com LLMs**
  - "Why is this trending?": Resumo automático de tendências cruzando notícias e tweets.
  - Geração de pautas de conteúdo: "Crie um roteiro de TikTok sobre essa trend".
- **3.2. Análise de Sentimento Visual**
  - Indicadores visuais (cores, emojis) para mostrar se a tendência é positiva, negativa ou polêmica.
- **3.3. Sistema de "Virality Score"**
  - Algoritmo ponderado (Volume de Busca + Crescimento Recente + Engajamento Social) para dar uma nota de 0 a 100 para cada trend.

### Fase 4: Monetização & Retenção (Mês 4+)
Recursos para uso profissional e recorrente.
- **4.1. Sistema de Alertas Pro**
  - Notificações em tempo real via WhatsApp/Email para keywords monitoradas.
- **4.2. Relatórios White-label**
  - PDF exportável com logomarca da agência do usuário.
- **4.3. API Pública (Beta)**
  - Monetização via venda de dados de tendências via API.

---

## 5. Recursos Sugeridos (Detalhados)

### 5.1. Trend Time Machine (Máquina do Tempo de Tendências)
**O que é:** Uma interface de calendário onde o usuário pode selecionar qualquer data no passado e ver exatamente o que estava em alta naquele dia.
**Como funciona:**
- O sistema armazena snapshots diários dos rankings de tendências.
- O usuário seleciona "25 de Dezembro de 2023".
- O dashboard recarrega os dados daquele dia.
**Valor:** Permite planejamento sazonal. Um profissional de marketing pode ver o que bombou no Natal passado para planejar o Natal deste ano.

### 5.2. Content Matcher (Gerador de Pautas Contextual)
**O que é:** Uma ferramenta que pega uma tendência e sugere formatos de conteúdo específicos para ela.
**Como funciona:**
- A IA analisa a natureza da trend (ex: "Visual", "Notícia", "Meme", "Debate").
- Se for "Visual" (ex: uma nova estética de design), sugere: "Faça um carrossel no Instagram".
- Se for "Debate" (ex: uma polêmica política), sugere: "Faça um vídeo de opinião no YouTube/Twitter".
- Integra com templates prontos (ex: "Usar template de Carrossel Explicativo").

### 5.3. Virality Score (Pontuação de Viralidade)
**O que é:** Um número único de 0 a 100 que indica o quão "quente" uma tendência está.
**Como funciona (Cálculo Simplificado):**
- `Score = (Volume de Busca * 0.4) + (Taxa de Crescimento * 0.4) + (Engajamento Social * 0.2)`
- Normalizado para uma escala de 0-100.
- **Visualização:** Um gráfico de velocímetro ou uma barra de progresso colorida (Verde = Viralizando, Vermelho = Caindo).

### 5.4. Competitor X-Ray (Raio-X da Concorrência)
**O que é:** O usuário insere a URL de um concorrente e o sistema descobre quais trends ele está cobrindo.
**Como funciona:**
- O sistema faz scraping do sitemap ou últimas postagens do concorrente.
- Extrai keywords principais dos títulos.
- Cruza essas keywords com o banco de dados de trends do FBR-Trends.
- **Resultado:** "Seu concorrente X está falando sobre a trend Y e Z, mas ignorou a trend W (que é uma oportunidade para você)."

---

## 6. Stack de SKILLs Recomendada

Para garantir a execução de nível "Pro Max", utilizaremos:

-   `@[FBR-Trends/.agent/skills/ui-ux-pro-max]`: **Essencial**. Foco em componentes Shadcn/UI personalizados, animações com Framer Motion e layouts de dashboard tipo "Bento Grid".
-   `@[FBR-Trends/.agent/skills/frontend-design]`: **Essencial**. Para estruturar o Next.js 14+ com Server Components e otimização de performance.
-   `@[FBR-Trends/.agent/skills/firecrawl-scraper]`: **Essencial**. Para lidar com sites difíceis de raspar sem precisar gerenciar proxies complexos manualmente.
-   `@[FBR-Trends/.agent/skills/ai-agents-architect]`: **Diferencial**. Para criar "agentes analistas" que rodam em background, não apenas scripts cron simples.
-   `@[FBR-Trends/.agent/skills/workflow-automation]`: **Infraestrutura**. Usar n8n ou Temporal (conceitualmente) para orquestrar fluxos complexos de dados se necessário.
-   `@[FBR-Trends/.agent/skills/marketing-psychology]`: **Conteúdo**. Para ajudar a IA a gerar explicações persuasivas sobre as tendências.
