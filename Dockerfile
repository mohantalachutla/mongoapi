FROM node:20-alpine

# setting the working directory
WORKDIR /app
# dev
ENV NODE_ENV=development
# copying package.json into the container
COPY ./package.json .
RUN npm update npm
# installing dependencies
RUN npm install --legacy-peer-deps --include=dev
# copying local files into the container 
COPY . .
# building the app
RUN npm run build
# expose port
EXPOSE 3001/tcp
# running the app
ENTRYPOINT [ "npm"]
CMD ["run", "start"]