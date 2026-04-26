FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ /app/src/
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV PORT=3000
ENV DATA_ARCHIVE=/data/archive.tar.xz

EXPOSE 3000

CMD ["/app/startup.sh"]
