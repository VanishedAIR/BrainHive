# BrainHive 🐝

**Hive Together, Thrive Together.**  
_A platform for students to easily find, join, and manage study groups - Developed for educational purposes_

**Team**:  
[<img src="https://img.shields.io/badge/Vansh_Patel-000?style=flat&logo=github" height="20">](https://github.com/VanishedAIR)
[<img src="https://img.shields.io/badge/Jesus_Santiago-000?style=flat&logo=github" height="20">](https://github.com/Jesus-29)
[<img src="https://img.shields.io/badge/Karan_Verma-000?style=flat&logo=github" height="20">](https://github.com/KViruz2750)
[<img src="https://img.shields.io/badge/Eloisa_Vera-000?style=flat&logo=github" height="20">](https://github.com/eloisavera)
[<img src="https://img.shields.io/badge/Kaden_Jefferson-000?style=flat&logo=github" height="20">](https://github.com/KadenJ13)

**Repository**: [![GitHub Repo](https://img.shields.io/badge/BrainHive-000?style=for-the-badge&logo=github)](https://github.com/VanishedAIR/BrainHive)

---

## 🚀 Features

- **🔐 Secure Authentication**  
  Login/Logout with [Clerk](https://clerk.com) & password recovery flow
- **👥 Study Groups**
  - Create/delete groups
  - Advanced search with subject/location
- **🔄 Real-Time Feed**  
  Post updates and resources with chronological sorting
- **📅 Meeting Sync**  
  Integrate with [When2Meet](https://www.when2meet.com) for optimal scheduling
- **📱 Mobile Support**  
  Responsive website providing full website support to smaller devices

---

## 🔧 Installation & Setup

1. **Clone the repository**

   ```
   git clone https://github.com/VanishedAIR/BrainHive.git
   cd BrainHive
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with:

   ```
   DATABASE_URL="your_postgres_database_url"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   ```

4. **Set up the database**

   ```
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```
   npm run dev
   ```

## 🧪 Testing

Run tests with Jest:

```
npm run test
```

To run tests in watch mode:

```
npm run test:watch
```

---

## ⚠️ Academic Disclaimer

This student project was created at California State University - Long Beach for educational purposes. It is not a commercial product and is not intended for production use. Some features may be simplified or incomplete compared to professional applications.

## Third-Party Services Notice

This project integrates with external services, including:

- **Clerk** (Authentication)
- **Postgresql** (Database)
- **Prisma** (Data Modeling)
- **Neon** (Serverless Postgres Platform)
- **When2Meet** (Scheduling)

Each service operates under its terms of use and privacy policy. This project does not claim ownership or responsibility for these third-party services.
