FROM node:14
RUN mkdir -p /src/user/app
WORKDIR /src/user/app
COPY package*json ./
copy . .
RUN npm install
EXPOSE 2302
CMD ["node", "src/app"]
