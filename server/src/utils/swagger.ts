import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crime Tracker BD API",
      version: "1.0.0",
      description: "API documentation for Crime Tracker BD - A crime reporting and visualization platform for Bangladesh",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Crimes",
        description: "Crime report endpoints",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
