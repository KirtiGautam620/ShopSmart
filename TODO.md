# TODO: Fix /api/health 404 Issue

## Steps:
- [x] 1. Create client/nginx.conf with /api proxy to server:5001
- [x] 2. Update client/Dockerfile to COPY nginx.conf
- [x] 3. Add /api/health endpoint to server/src/app.js  
- [ ] 4. docker-compose build --no-cache client server
- [ ] 5. docker-compose up -d
- [ ] 6. Test curl localhost:8080/api/health
