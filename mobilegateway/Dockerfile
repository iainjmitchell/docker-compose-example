FROM node:4.4.3

RUN apt-get install libstdc++6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY MobileEditorialTimelineGateway.js /usr/src/app/
COPY Queue.js /usr/src/app/
RUN npm install

EXPOSE 8080

COPY . /usr/src/app
CMD [ "node", "MobileEditorialTimelineGateway.js" ]


