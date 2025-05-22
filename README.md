# 🚤 Inter-Boat

A full-stack platform for managing client-submitted articles, with host moderation, built using **React**, **Express**, and **MySQL**.

---

## 📁 Folder Structure

```
inter-boat/
├── backend/
│   ├── middleware/
│   ├── routes/
│   │   ├── clientRoute.js
│   │   └── dataRoute.js
│   ├── package.json
│   ├── requirements.txt
│   └── server.js
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
│   │       ├── Login.jsx
│   │       ├── NotFoundPage.jsx
│   │       └── Signup.jsx
│   ├── index.html
│   ├── package.json
│   ├── requirements.txt
│   └── vite.config.js
├── LICENSE
├── README.md
├── requirements.txt
└── learn.txt
```

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
MYSQL_USERNAME=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=inter_boat
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

- Optionally, seed with some users:

```sql
INSERT INTO users (username, password, role) VALUES
('host_user', 'pass0', 'host'),
('client1', 'pass1', 'client'),
('client2', 'pass2', 'client');
```

#### d. Start the Backend Server

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

#### b. Start the Frontend Dev Server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🛠️ Features

- Client Registration & Login
- Host & Client Dashboards
- Article Submission, Editing, Deletion
- Host Moderation (Accept/Reject/Pending)
- Status Filtering & Article Expansion
- Responsive UI with TailwindCSS

---

## ⚙️ Environment Variables

**Backend `.env` example:**

```env
MYSQL_HOST=localhost
MYSQL_USERNAME=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=inter_boat
```

---

## 💡 Tips

- Make sure MySQL is running and accessible with the credentials you provide.
- Use different browsers or incognito mode to test host and client roles simultaneously.
- For production, use hashed passwords and secure session management.

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

Enjoy using **Inter-Boat**! 🚤