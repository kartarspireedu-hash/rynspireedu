# RynSpireEdu — single container serving both the API and the built website.
# Deploys to Google Cloud Run (or any container platform that provides a $PORT).

FROM python:3.12-slim

WORKDIR /app

# System deps needed to build a couple of Python packages, then remove build tools
RUN apt-get update && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements-prod.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Backend code + the already-built frontend (backend/static)
COPY backend/server.py ./server.py
COPY backend/static ./static

# Cloud Run injects $PORT at runtime (defaults to 8080 if unset, e.g. for local testing)
ENV PORT=8080
EXPOSE 8080

CMD exec uvicorn server:app --host 0.0.0.0 --port ${PORT}
