# GitHub Webhook Listener 🚀

This project is a **Webhook Listener** built with **Node.js (Express)** that listens to **GitHub** webhooks and executes specific scripts when a push is made to the `master` branch. It supports multiple repositories (API and Frontend) and automatically updates the code on the server.

---

## 🛠️ Features

- ✅ Secure webhook verification using HMAC signatures.
- ✅ Supports multiple repositories (API and Frontend).
- ✅ Executes custom scripts based on the repository.
- ✅ Filters events to trigger actions **only** on the `master` branch.
- ✅ Handles `ping` and `push` events.
- ✅ Uses **PM2** to keep the service running.
- ✅ Clear and detailed logging.

---

## 📁 Project Structure

```
/github-webhooks
│
├── server.js                # Main Express server
├── ecosystem.config.js      # PM2 configuration
├── .env                     # Environment variables
├── package.json             # Dependencies
├── logs/                    # Output and error logs
│   ├── error.log
│   └── output.log
└── scripts/                 # Custom scripts for repos
    ├── script-api.sh
    └── script-front.sh
```

---

## 🚀 Installation

### 1️⃣ **Clone the repository**

```bash
git clone https://github.com/axbegue/github-webhooks.git
cd github-webhooks
```

### 2️⃣ **Install dependencies**

```bash
npm install
```

### 3️⃣ **Configure environment variables**

Create a **`.env`** file in the project root:

```env
PORT=3000
GITHUB_SECRET=your_github_secret

API_REPO_NAME=api-repo-name
API_SCRIPT_PATH=/path/to/your/script-api.sh

FRONT_REPO_NAME=front-repo-name
FRONT_SCRIPT_PATH=/path/to/your/script-front.sh
```

- **`GITHUB_SECRET`**: The secret set in your GitHub webhook.
- **`API_REPO_NAME`** and **`FRONT_REPO_NAME`**: Exact names of the repositories.
- **`API_SCRIPT_PATH`** and **`FRONT_SCRIPT_PATH`**: Absolute paths to your deployment scripts.

### 4️⃣ **Prepare deployment scripts**

Example for **`script-api.sh`**:

```bash
#!/bin/bash

cd /path/to/your/api-project || exit 1
git reset --hard
output=$(git pull 2>&1)

if [[ "$output" == *"Already up to date."* ]]; then
  echo "✅ Repository is already up to date."
  exit 0
fi

echo "$output"

npm install
echo "🚧 Building the application..."
nest build

echo "🚀 Restarting the server..."
pm2 restart proyect-name

echo "✅ Update completed successfully."
```

Make the scripts executable:

```bash
chmod +x /path/to/your/script-api.sh
chmod +x /path/to/your/script-front.sh
```

---

## ⚡ Usage

### 🏃‍♂️ **Run locally**

```bash
node server.js
```

Access at **http://localhost:3000/webhook**.

---

## ⚙️ Deploy with PM2

### 1️⃣ **Install PM2**

```bash
npm install pm2 -g
```

### 2️⃣ **Use `ecosystem.config.js`**

```bash
pm2 start ecosystem.config.js
```

---

## 🔗 GitHub Webhook Configuration

1. Go to your repository on **GitHub**.
2. **Settings > Webhooks > Add webhook**.
3. **Payload URL**: `http://your-server/webhook`.
4. **Content type**: `application/json`.
5. **Secret**: Use the same value as **`GITHUB_SECRET`** in `.env`.
6. **Events**: Select **Just the push event**.
7. Save the webhook and push code to test it.

---

## 🛡️ Security

- HMAC signature verification to ensure webhooks come from GitHub.
- Branch filtering: **only triggers scripts on `master`**.
- Error and execution logs for debugging.

---

## ✨ Contributing

Contributions are welcome! Feel free to open an **issue** or submit a **pull request** to improve the project.

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🚀 Author

Developed by Antonio Begue(https://github.com/axbegue) 🚀

```

```
