echo "client"
cd ./apps/client
npm run stuffer build

cd ..

echo "admin"
cd ./admin
npm run stuffer build
