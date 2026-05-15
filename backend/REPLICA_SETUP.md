Goal

Provide a reproducible single-node MongoDB replica set for local development so Prisma transactions work.

Options

1) Docker (recommended)

- Install Docker Desktop for Windows: https://www.docker.com/get-started
- From the `backend` folder, run (PowerShell/CMD):

```powershell
docker compose -f docker-compose.mongo.yml up -d
```

- Then run the init script to initiate the replica set and verify status:

```powershell
node ./scripts/initReplicaSet.js mongodb://localhost:27018 rs0
```

- Copy the replica env file and restart the backend:

```powershell
Copy-Item .env.replica .env -Force
npm run dev
```

- Test registration (using your frontend or curl). Verify user exists with:

```powershell
node scripts/checkUser.js test@example.com
```

2) Manual mongod (if you already have MongoDB installed)

- Stop the service if running and start `mongod` with `--replSet`:

```powershell
Stop-Service mongod
& 'C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe' --dbpath 'C:\data\db' --replSet rs0 --bind_ip_all
```

- In another terminal, run:

```powershell
& 'C:\Program Files\MongoDB\Server\6.0\bin\mongosh.exe' --eval "rs.initiate()"
```

- Then restart the backend and test registration as above.

Notes

- The helper script `scripts/initReplicaSet.js` attempts common hostnames if the first attempt fails.
- If you prefer I run the Docker commands for you, install Docker Desktop and reply "run docker" and I'll start the container and initiate the replica set.
