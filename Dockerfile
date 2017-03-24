# Node environment---USES DEBIAN
FROM node:latest

# Install JAVA
RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee /etc/apt/sources.list.d/webupd8team-java.list && \
    echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886 && \
    apt-get update && \
    echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections && \
    apt-get install oracle-java8-installer -y && \
    java -version && \
    apt-get install oracle-java8-set-default

# Gulp4
RUN npm install gulpjs/gulp-cli -g && \
    npm install gulpjs/gulp#4.0 --save-dev

# Working directory
WORKDIR /automate

# Copy files from path
COPY . /automate/

# install dependencies
RUN npm install

# port
EXPOSE 4000
  
# run command
CMD gulp
