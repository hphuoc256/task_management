## Setup Project

```sh
cp .env.example .env 
# Install Package
npm install
# Generate key
node ace generate:key
# Run migrate
node ace migration:run
# Run seeder
node ace db:seed 
# Run serve local
npm run dev
# Build server
node ace build --production
```
