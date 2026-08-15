import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

async function start(): Promise<void> {
  await prisma.$connect();
  app.listen(env.port, () => {
    process.stdout.write(`Gamlish DBMS API listening on http://localhost:${String(env.port)}\n`);
  });
}

void start().catch((error: unknown) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
