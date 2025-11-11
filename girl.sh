cd native
./girl.sh
cd ..
bun install
bun run build
bun run src/setupDB.ts
bun run src/index.ts