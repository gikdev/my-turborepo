echo "client"
cd ./apps/client
npm run stuffer url

cd ..

echo "admin"
cd ./admin
npm run stuffer url

cd ../..

echo "shared"
cd ./packages/shared
npm run stuffer url
