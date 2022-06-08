FROM node:14
WORKDIR /usr/src/app
COPY package.json ./
RUN apt update
RUN apt upgrade -y
RUN npm install\
  && npm install typescript -g
ADD . /usr/src/app 
RUN tsc
CMD ["node","out/index.js"]