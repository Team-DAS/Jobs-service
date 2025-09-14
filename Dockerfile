# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en la aplicación
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto que la aplicación usa
EXPOSE 3002

# El comando para iniciar la aplicación en modo de desarrollo (compilación al vuelo)
CMD ["npm", "run", "start:dev"]