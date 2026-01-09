module.exports = {
  apps: [
    {
      name: "barrelborn",
      script: "./dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
        MONGODB_URI: "mongodb+srv://abarrelborn_db_user:xTl95RKaa9k9MagM@barrelborn.fllyeem.mongodb.net/barrelborn?appName=BarrelBorn",
        SESSION_SECRET: "your_random_session_secret_here"
      }
    }
  ]
};
