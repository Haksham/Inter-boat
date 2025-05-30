# 🚤 Inter-Boat

A full-stack platform for managing client-submitted articles, with host moderation, built using **React**, **Express**, **MySQL**, and **Redis** for server-side and client-side caching.

---

## 📁 Folder Structure

<details>
<summary>Click to view folder structure</summary>

```
inter-boat/
├── .gitignore
├── LICENSE
├── README.md
├── requirements.txt
├── sql_sample_data.txt
├── backend/
│   ├── middleware/
│   │   └── session.js
│   ├── routes/
│   │   ├── clientRoute.js
│   │   └── dataRoute.js
│   ├── package.json
│   ├── requirements.txt
│   ├── server.js
│   ├── .env
│   ├── redisClient.js
│   └── node_modules/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── Add.jsx
│   │       ├── Client.jsx
│   │       ├── Edit.jsx
│   │       ├── Footer.jsx
│   │       ├── Header.jsx
│   │       ├── Home.jsx
│   │       ├── Host.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── Login.jsx
│   │       ├── NotFoundPage.jsx
│   │       ├── Signup.jsx
│   │       └── StatusFilter.jsx
│   ├── index.html
│   ├── package.json
│   ├── requirements.txt
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── .env
│   └── node_modules/
```
</details>

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/inter-boat.git
cd inter-boat
```

---

### 2. Backend Setup

#### a. Install Dependencies

```bash
cd backend
npm install
```

#### b. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=inter_boat
SESSION_SECRET=your_session_secret
EXPRESS_PORT=8000
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

#### c. Set Up the Database

- Create the database and tables using the following SQL:

```sql
CREATE DATABASE inter_boat;
USE inter_boat;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('host', 'client') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  client_id INT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE article_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  updated_by INT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

- Optionally, seed with some users and articles using [`sql_sample_data.txt`](sql_sample_data.txt).

#### d. Start Redis Server

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
redis-cli ping  # Should return: PONG
```

#### e. Start the Backend Server

```bash
npm run dev
```
_or_
```bash
npm start
```

---

### 3. Frontend Setup

#### a. Install Dependencies

```bash
cd ../frontend
npm install
```

#### b. Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

#### c. Start the Frontend Dev Server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🗄️ Database Tables

- **users**: Stores user credentials and roles (`host` or `client`)
- **articles**: Stores articles submitted by clients
- **article_status**: Tracks the status (`pending`, `accepted`, `rejected`) of each article and who updated it

---

## ⚙️ Environment Variables

**Backend `.env` example:**

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=inter_boat
SESSION_SECRET=your_session_secret
EXPRESS_PORT=8000
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

**Frontend `.env` example:**

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📦 Dependencies

### Backend

See [`backend/package.json`](backend/package.json):

- express, cors, dotenv, mysql2, express-session, express-mysql-session  
- ioredis, react-icons, nodemon (dev)

### Frontend

See [`frontend/package.json`](frontend/package.json):

- react, react-dom, react-router-dom, axios, tailwindcss  
- @tailwindcss/vite, vite, vite-plugin-qrcode, react-icons  
- @tanstack/react-query, eslint (dev), @vitejs/plugin-react (dev)

---

## 🛠️ Features

- **Client Registration & Login**
- **Host & Client Dashboards**
- **Article Submission, Editing, Deletion**
- **Host Moderation (Accept/Reject/Pending)**
- **Status Filtering & Article Expansion**
- **Session-based Authentication**
- **Responsive UI with TailwindCSS**
- **Role-based Access Control**
- **Persistent MySQL-backed Sessions**
- **Server-side caching with Redis**
- **Client-side caching with React Query**
- **Live QR code for dev server (via vite-plugin-qrcode)**
- **404 Not Found Page**
- **Reusable Header & Footer**
- **Loading Spinners for Data Fetching**
- **ESLint and code quality tools**

---

## 💡 Tips

- Make sure MySQL and Redis are running and accessible with the credentials you provide.
- Use different browsers or incognito mode to test host and client roles simultaneously.
- For production, use hashed passwords and secure session management.
- Environment files (`.env`) are ignored by git for security.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 🤝 Contributing

Pull requests and suggestions are welcome! Please open an issue first to discuss what you would like to change.

---

## 👤 Author

- [Harsh_V_M](mailto:harsh924hashvm@gmail.com)
- [GitHub](https://github.com/haksham)

---

Enjoy using **Inter-Boat**!