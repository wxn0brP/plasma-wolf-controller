cd native
./girl.sh
cd ..
bun install
bun run build:front
bun run build:joy
bun run src/setupDB.ts
bun run src/index.ts
