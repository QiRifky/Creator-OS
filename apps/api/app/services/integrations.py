import httpx
from app.core.config import settings


class IntegrationConfigError(RuntimeError):
    pass


async def fetch_youtube_channel_stats(channel_id: str):
    if not settings.youtube_api_key:
        raise IntegrationConfigError('YouTube API key missing')
    url = 'https://www.googleapis.com/youtube/v3/channels'
    params = {'part': 'statistics', 'id': channel_id, 'key': settings.youtube_api_key}
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()


async def fetch_x_trends(woeid: int = 1):
    if not settings.x_bearer_token:
        raise IntegrationConfigError('X bearer token missing')
    # Official v2 does not expose public trends endpoint globally; organizations typically use paid endpoints/data providers.
    # This implementation targets recent search as trend proxy with policy-compliant API access.
    url = 'https://api.x.com/2/tweets/search/recent'
    headers = {'Authorization': f'Bearer {settings.x_bearer_token}'}
    params = {'query': 'lang:en -is:retweet', 'max_results': 50}
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(url, params=params, headers=headers)
        response.raise_for_status()
        return response.json()


async def fetch_openai_idea(prompt: str):
    if not settings.openai_api_key:
        raise IntegrationConfigError('OpenAI API key missing')
    url = 'https://api.openai.com/v1/responses'
    headers = {
        'Authorization': f'Bearer {settings.openai_api_key}',
        'Content-Type': 'application/json',
    }
    payload = {
        'model': 'gpt-4.1-mini',
        'input': prompt,
    }
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
