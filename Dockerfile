FROM denoland/deno:alpine-2.1.5

WORKDIR /app

COPY . .
RUN rm -rf node_modules
RUN deno cache --reload --allow-import main.ts
RUN chmod -R 777 /app
RUN deno task build

USER deno
EXPOSE 8000

CMD ["run", "-A", "--unstable-cron", "--unstable-kv", "main.ts"]