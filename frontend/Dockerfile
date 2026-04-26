FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb* package-lock.json* ./
RUN bun install

COPY . .

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "4321"]
