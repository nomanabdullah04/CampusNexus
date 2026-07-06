import { Server } from 'http';
import app from './app';
import { envVars } from './config/env';
import { sequelize } from './config/database';

// Import associations — registers all model relationships
import './models/index';

let server: Server;

const startServer = async () => {
  try {
    console.log(`Environment: ${envVars.NODE_ENV}`);

    // Authenticate connection
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL (XAMPP)');

    // Disable strict zero-date mode GLOBALLY for this MySQL session
    // This lets Sequelize ALTER existing tables that have rows without crashing
    await sequelize.query(
      "SET GLOBAL sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'"
    );
    await sequelize.query(
      "SET SESSION sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'"
    );
    console.log('✅ SQL mode configured (relaxed for sync)');

    // Sync models — only creates tables that don't exist yet
    // Use force: true ONLY once to drop & recreate all tables from scratch
    await sequelize.sync({ force: false });
    console.log('✅ All tables synced successfully');

    server = app.listen(envVars.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${envVars.PORT}`);
    });

  } catch (error: any) {
    console.error('❌ Failed to start server:', error?.message || error);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection. Shutting down:", err);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception. Shutting down:", err);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  if (server) server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully");
  if (server) server.close(() => process.exit(0));
});