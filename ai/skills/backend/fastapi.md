<!-- Source: https://skills.sh/wshobson/agents/fastapi-templates -->
<!-- Installed via: npx skills add wshobson/agents@fastapi-templates -->
---
name: fastapi-templates
description: Create production-ready FastAPI projects with async patterns, dependency injection, and comprehensive error handling. Use when building new FastAPI applications or setting up backend API projects.
---

# FastAPI Project Templates

Production-ready FastAPI project structures with async patterns, dependency injection, middleware, and best practices for building high-performance APIs.

## When to Use This Skill

- Starting new FastAPI projects from scratch
- Implementing async REST APIs with Python
- Building high-performance web services and microservices
- Creating async applications with PostgreSQL, MongoDB
- Setting up API projects with proper structure and testing

## Core Concepts

### 1. Project Structure

**Recommended Layout:**

```
app/
â”œâ”€â”€ api/                    # API routes
â”‚   â”œâ”€â”€ v1/
â”‚   â”‚   â”œâ”€â”€ endpoints/
â”‚   â”‚   â”‚   â”œâ”€â”€ users.py
â”‚   â”‚   â”‚   â”œâ”€â”€ auth.py
â”‚   â”‚   â”‚   â””â”€â”€ items.py
â”‚   â”‚   â””â”€â”€ router.py
â”‚   â””â”€â”€ dependencies.py     # Shared dependencies
â”œâ”€â”€ core/                   # Core configuration
â”‚   â”œâ”€â”€ config.py
â”‚   â”œâ”€â”€ security.py
â”‚   â””â”€â”€ database.py
â”œâ”€â”€ models/                 # Database models
â”‚   â”œâ”€â”€ user.py
â”‚   â””â”€â”€ item.py
â”œâ”€â”€ schemas/                # Pydantic schemas
â”‚   â”œâ”€â”€ user.py
â”‚   â””â”€â”€ item.py
â”œâ”€â”€ services/               # Business logic
â”‚   â”œâ”€â”€ user_service.py
â”‚   â””â”€â”€ auth_service.py
â”œâ”€â”€ repositories/           # Data access
â”‚   â”œâ”€â”€ user_repository.py
â”‚   â””â”€â”€ item_repository.py
â””â”€â”€ main.py                 # Application entry
```

### 2. Dependency Injection

FastAPI's built-in DI system using `Depends`:

- Database session management
- Authentication/authorization
- Shared business logic
- Configuration injection

### 3. Async Patterns

Proper async/await usage:

- Async route handlers
- Async database operations
- Async background tasks
- Async middleware

## Detailed worked examples and patterns

Detailed sections (starting with `## Implementation Patterns`) live in `references/details.md`. Read that file when the navigation summary above is insufficient.

## Testing

```python
# tests/conftest.py
import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import get_db, Base

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def db_session():
    engine = create_async_engine(TEST_DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    AsyncSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with AsyncSessionLocal() as session:
        yield session

@pytest.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

# tests/test_users.py
import pytest

@pytest.mark.asyncio
async def test_create_user(client):
    response = await client.post(
        "/api/v1/users/",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
```

