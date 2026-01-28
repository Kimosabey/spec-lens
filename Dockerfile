# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir spacy fastapi uvicorn

# Download spaCy language models (English, French, German)
RUN python -m spacy download en_core_web_lg && \
    python -m spacy download fr_core_news_lg && \
    python -m spacy download de_core_news_lg

# Copy NLP scripts
COPY nlp/ /app/nlp/

# Set Python to run in unbuffered mode
ENV PYTHONUNBUFFERED=1

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI server
CMD ["python", "nlp/server.py"]
