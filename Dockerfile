FROM node:alpine

ARG NODE_ENV=development
ARG REACT_APP_GMAPS_KEY=unset_in_development
ARG REACT_APP_STRIPE_PUBLIC_KEY=unset_in_development
ARG REACT_APP_CONFIGCAT_SDK_KEY=unset_in_development
ARG REACT_APP_CONFIGCAT_WEWORK_SDK_KEY=unset_in_development
ARG REACT_APP_SEGMENT_KEY=unset_in_development
ARG REACT_APP_CONFIGCAT_ALPACA_SDK_KEY=unset_in_development
ARG REACT_APP_INSTAGRAM_TOKEN=unset_in_development

WORKDIR /app
COPY ./package*.json ./
RUN if [ "$NODE_ENV" = "production" ]; then npm ci ; else npm install; fi
COPY ./ ./
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi
CMD ["npm", "start"]
#COPY ./build ./build
#RUN yarn global add serve

#CMD ["serve", "-s", "build"]
