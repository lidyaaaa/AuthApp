Ini project paling sukses 

## Alhamdulillah Sukses

git clone https://github.com/lidyaaaa/AuthApp.git

cd AuthApp

npm install 

buat file .env

DATABASE_URL="postgresql://postgres:password@localhost:5432/namadatabase"
NEXTAUTH_SECRET="isi sendiri"
NEXTAUTH_URL="http://localhost:3000"

npx prisma generate

npx prisma migrate dev --name init

npx prisma db seed

npm run dev 

login admin:

admin@mail.com
admin123