Perfeito! Vamos ajustar a arquitetura para usar Python nos scrapers, mantendo Next.js no frontend.

## Arquitetura Híbrida

```
Frontend/API: Next.js + Supabase
Scrapers: Python (serviço separado)
Comunicação: Supabase como ponte de dados
```

## Estrutura do Projeto Python

```
/scrapers-service
  /scrapers
    __init__.py
    /sources
      google_trends.py
      twitter_scraper.py
      reddit_scraper.py
      rss_feeds.py
      instagram_trends.py
      youtube_trends.py
      news_aggregator.py
    /utils
      db.py              # Cliente Supabase
      cache.py
      rate_limiter.py
      proxy_rotator.py
  /scheduler
    cron_jobs.py
    task_queue.py
  /config
    sources_config.py
    settings.py
  requirements.txt
  Dockerfile
```

## Stack Python

```txt
# requirements.txt
supabase==2.0.3          # Cliente Supabase
python-dotenv==1.0.0

# Scraping
requests==2.31.0
beautifulsoup4==4.12.0
selenium==4.15.0         # Para sites com JS
playwright==1.40.0       # Alternativa ao Selenium
scrapy==2.11.0           # Framework completo

# APIs específicas
tweepy==4.14.0           # Twitter API
praw==7.7.1              # Reddit API
pytrends==4.9.2          # Google Trends
feedparser==6.0.10       # RSS feeds
yt-dlp==2023.11.16       # YouTube data

# Processamento
pandas==2.1.3
numpy==1.26.2

# Scheduling
apscheduler==3.10.4
celery==5.3.4            # Para tasks assíncronas
redis==5.0.1             # Backend do Celery

# Utilities
tenacity==8.2.3          # Retry logic
fake-useragent==1.4.0
```

## Exemplos de Scrapers

### 1. Google Trends Scraper

```python
# scrapers/sources/google_trends.py
from pytrends.request import TrendReq
from datetime import datetime, timedelta
import pandas as pd
from ..utils.db import SupabaseClient

class GoogleTrendsScraper:
    def __init__(self):
        self.pytrends = TrendReq(hl='pt-BR', tz=-180)
        self.db = SupabaseClient()
    
    def fetch_trending_topics(self, category=None, geo='BR'):
        """Busca trending topics do Google"""
        trending_searches = self.pytrends.trending_searches(pn=geo)
        
        results = []
        for topic in trending_searches[0].head(20):
            # Pega dados detalhados de cada tópico
            self.pytrends.build_payload([topic], timeframe='now 7-d', geo=geo)
            interest = self.pytrends.interest_over_time()
            
            results.append({
                'topic': topic,
                'current_score': int(interest[topic].iloc[-1]) if not interest.empty else 0,
                'trend_direction': self._calculate_trend(interest[topic]),
                'geo': geo
            })
        
        return results
    
    def fetch_related_queries(self, keyword, geo='BR'):
        """Busca queries relacionadas para um termo"""
        self.pytrends.build_payload([keyword], timeframe='today 3-m', geo=geo)
        related = self.pytrends.related_queries()
        
        return {
            'rising': related[keyword]['rising'],
            'top': related[keyword]['top']
        }
    
    def _calculate_trend(self, series):
        """Calcula se está subindo ou descendo"""
        if len(series) < 2:
            return 'stable'
        
        recent = series.tail(3).mean()
        previous = series.head(len(series)-3).mean()
        
        if recent > previous * 1.2:
            return 'rising'
        elif recent < previous * 0.8:
            return 'falling'
        return 'stable'
    
    def save_to_db(self, publication_id, data):
        """Salva no Supabase"""
        self.db.insert('scraped_data', {
            'publication_id': publication_id,
            'source_type': 'google_trends',
            'data': data,
            'fetched_at': datetime.utcnow().isoformat(),
            'expires_at': (datetime.utcnow() + timedelta(hours=6)).isoformat()
        })
```

### 2. Reddit Scraper

```python
# scrapers/sources/reddit_scraper.py
import praw
from datetime import datetime, timedelta

class RedditScraper:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id='YOUR_CLIENT_ID',
            client_secret='YOUR_SECRET',
            user_agent='PautaBot/1.0'
        )
        self.db = SupabaseClient()
    
    def fetch_hot_topics(self, subreddits, limit=50):
        """Busca posts quentes de subreddits específicos"""
        results = []
        
        for sub_name in subreddits:
            subreddit = self.reddit.subreddit(sub_name)
            
            for post in subreddit.hot(limit=limit):
                # Filtra posts recentes (últimas 48h)
                post_age = datetime.utcnow() - datetime.fromtimestamp(post.created_utc)
                
                if post_age < timedelta(hours=48):
                    results.append({
                        'title': post.title,
                        'subreddit': sub_name,
                        'score': post.score,
                        'num_comments': post.num_comments,
                        'url': post.url,
                        'created_at': datetime.fromtimestamp(post.created_utc).isoformat(),
                        'engagement_rate': self._calculate_engagement(post)
                    })
        
        return sorted(results, key=lambda x: x['engagement_rate'], reverse=True)
    
    def _calculate_engagement(self, post):
        """Calcula taxa de engajamento"""
        hours_since_post = (datetime.utcnow() - datetime.fromtimestamp(post.created_utc)).total_seconds() / 3600
        
        if hours_since_post < 1:
            hours_since_post = 1
        
        return (post.score + post.num_comments * 2) / hours_since_post
```

### 3. RSS Feed Scraper

```python
# scrapers/sources/rss_feeds.py
import feedparser
from bs4 import BeautifulSoup
import requests

class RSSFeedScraper:
    def __init__(self):
        self.db = SupabaseClient()
    
    def fetch_feeds(self, feed_urls, keywords=None):
        """Busca conteúdo de múltiplos RSS feeds"""
        all_entries = []
        
        for url in feed_urls:
            feed = feedparser.parse(url)
            
            for entry in feed.entries[:20]:  # Top 20 por feed
                # Extrai texto limpo
                content = self._extract_clean_text(entry.get('summary', ''))
                
                # Filtra por keywords se especificado
                if keywords and not any(kw.lower() in content.lower() for kw in keywords):
                    continue
                
                all_entries.append({
                    'title': entry.title,
                    'link': entry.link,
                    'published': entry.get('published', ''),
                    'source': feed.feed.title,
                    'summary': content[:300],
                    'categories': entry.get('tags', [])
                })
        
        return all_entries
    
    def _extract_clean_text(self, html_content):
        """Remove HTML e retorna texto limpo"""
        soup = BeautifulSoup(html_content, 'html.parser')
        return soup.get_text(strip=True)
```

### 4. Twitter/X Scraper (sem API oficial)

```python
# scrapers/sources/twitter_scraper.py
from playwright.sync_api import sync_playwright
import json

class TwitterScraper:
    """Scraper via Playwright - use com moderação para evitar bloqueios"""
    
    def __init__(self):
        self.db = SupabaseClient()
    
    def fetch_trending_hashtags(self, location='Brazil'):
        """Busca hashtags em tendência"""
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Acessa página de tendências
            page.goto('https://twitter.com/explore/tabs/trending')
            page.wait_for_timeout(3000)
            
            # Extrai tendências
            trends = page.query_selector_all('[data-testid="trend"]')
            
            results = []
            for trend in trends[:20]:
                trend_text = trend.inner_text()
                results.append({
                    'hashtag': trend_text,
                    'platform': 'twitter'
                })
            
            browser.close()
            return results
```

## Sistema de Agendamento

```python
# scheduler/cron_jobs.py
from apscheduler.schedulers.blocking import BlockingScheduler
from scrapers.sources.google_trends import GoogleTrendsScraper
from scrapers.sources.reddit_scraper import RedditScraper
from scrapers.sources.rss_feeds import RSSFeedScraper
from utils.db import SupabaseClient

scheduler = BlockingScheduler()
db = SupabaseClient()

@scheduler.scheduled_job('interval', hours=1)
def scrape_google_trends():
    """Roda a cada 1 hora"""
    scraper = GoogleTrendsScraper()
    
    # Busca publicações ativas
    publications = db.get_active_publications()
    
    for pub in publications:
        config = pub['active_sources']
        
        if 'google_trends' in config:
            category = pub.get('category')
            trends = scraper.fetch_trending_topics(category=category)
            scraper.save_to_db(pub['id'], trends)
            print(f"✓ Google Trends scraped for {pub['name']}")

@scheduler.scheduled_job('interval', hours=2)
def scrape_reddit():
    """Roda a cada 2 horas"""
    scraper = RedditScraper()
    
    publications = db.get_active_publications()
    
    for pub in publications:
        config = pub['active_sources']
        
        if 'reddit' in config and config['reddit'].get('subreddits'):
            subreddits = config['reddit']['subreddits']
            posts = scraper.fetch_hot_topics(subreddits)
            scraper.save_to_db(pub['id'], posts)
            print(f"✓ Reddit scraped for {pub['name']}")

@scheduler.scheduled_job('interval', hours=3)
def scrape_rss_feeds():
    """Roda a cada 3 horas"""
    scraper = RSSFeedScraper()
    
    publications = db.get_active_publications()
    
    for pub in publications:
        config = pub['active_sources']
        
        if 'rss_feeds' in config:
            feeds = config['rss_feeds']['urls']
            keywords = pub.get('keywords', [])
            entries = scraper.fetch_feeds(feeds, keywords)
            scraper.save_to_db(pub['id'], entries)
            print(f"✓ RSS feeds scraped for {pub['name']}")

if __name__ == '__main__':
    print("🚀 Scraper scheduler started...")
    scheduler.start()
```

## Cliente Supabase (Python)

```python
# utils/db.py
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

class SupabaseClient:
    def __init__(self):
        self.client: Client = create_client(
            os.getenv('SUPABASE_URL'),
            os.getenv('SUPABASE_SERVICE_KEY')  # Service key para acesso total
        )
    
    def get_active_publications(self):
        """Busca publicações ativas"""
        response = self.client.table('publications')\
            .select('*')\
            .eq('status', 'active')\
            .execute()
        return response.data
    
    def insert(self, table, data):
        """Insere dados"""
        return self.client.table(table).insert(data).execute()
    
    def get_scraped_data(self, publication_id, source_type=None, limit=100):
        """Busca dados raspados"""
        query = self.client.table('scraped_data')\
            .select('*')\
            .eq('publication_id', publication_id)\
            .order('fetched_at', desc=True)\
            .limit(limit)
        
        if source_type:
            query = query.eq('source_type', source_type)
        
        return query.execute().data
```

## Deploy Python Service

### Opção 1: Docker + Railway/Render

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Playwright browsers (se usar)
RUN playwright install chromium
RUN playwright install-deps

COPY . .

CMD ["python", "scheduler/cron_jobs.py"]
```

### Opção 2: Separar em Celery Workers

```python
# Melhor para escala
# task_queue.py
from celery import Celery

app = Celery('scrapers', broker='redis://localhost:6379')

@app.task
def scrape_google_trends_task(publication_id):
    # ... código do scraper
    pass

# Rodar workers:
# celery -A task_queue worker --loglevel=info
```

## Integração Next.js ↔ Python

O Next.js não chama Python diretamente. A comunicação acontece via Supabase:

1. **Python scrapers** → Salvam dados no Supabase
2. **Next.js** → Lê dados do Supabase e exibe no dashboard
3. **Next.js API** → Pode disparar webhooks para forçar scraping manual (opcional)

```typescript
// app/api/trigger-scrape/route.ts
export async function POST(req: Request) {
  const { publicationId, source } = await req.json()
  
  // Opção 1: Insere job na fila (Celery/Redis)
  await redis.lpush('scrape_queue', JSON.stringify({
    publicationId,
    source,
    timestamp: Date.now()
  }))
  
  // Opção 2: Webhook para serviço Python
  await fetch('https://your-python-service.com/scrape', {
    method: 'POST',
    body: JSON.stringify({ publicationId, source })
  })
  
  return Response.json({ status: 'queued' })
}
```

Fontes Essenciais
Google Trends & Trending Topics

Tendências de busca por região/categoria
Comparação de termos ao longo do tempo
Queries relacionadas e em ascensão

Redes Sociais

Twitter/X: trending topics, hashtags populares
Reddit: subreddits relevantes, posts em alta
Instagram: hashtags trending (via API oficial)
TikTok: sons e hashtags virais

Agregadores de Notícias

Google News (com cautela legal)
Feedly ou APIs similares
NewsAPI para notícias categorizadas

Fontes Especializadas por Nicho
Comunidades e Fóruns

Stack Overflow (tech)
Quora (diversos temas)
Fóruns especializados de cada vertical

Repositórios de Dados Públicos

Dados.gov.br e portais governamentais
APIs de institutos de pesquisa (IBGE, etc.)
Calendários de eventos públicos

Concorrência

RSS feeds de veículos do mesmo nicho
Sitemap.xml de competidores
Newsletters populares da área

Fontes Complementares
Plataformas de Conteúdo

YouTube trending (por categoria)
Medium publications
LinkedIn pulse

Calendário Editorial

Datas comemorativas
Eventos sazonais
Lançamentos de produtos/filmes/séries

SEO & Keywords

AnswerThePublic
AlsoAsked
Google Search Console (próprio)

Recomendações Técnicas
Considere usar APIs oficiais sempre que possível em vez de scraping direto, para evitar problemas legais e bloqueios. Muitas plataformas oferecem APIs com quotas gratuitas razoáveis.
Para cada nicho do seu portfólio, você pode criar "perfis de raspagem" customizados que priorizam fontes mais relevantes para aquela vertical específica.