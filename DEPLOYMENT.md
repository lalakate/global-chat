# 🚀 Инструкция по деплою

## Краткий план
1. Задеплоить бэкенд на Render.com
2. Обновить URL бэкенда в конфигурации фронтенда
3. Задеплоить фронтенд на GitHub Pages

---

## 📋 Пошаговая инструкция

### 1. Деплой бэкенда на Render.com

1. **Зарегистрируйтесь на [render.com](https://render.com)**
   - Используйте GitHub аккаунт для входа

2. **Создайте новый Web Service**:
   - Нажмите "New +" → "Web Service"
   - Подключите ваш GitHub репозиторий
   - Выберите репозиторий `global-chat`

3. **Настройте параметры**:
   ```
   Name: global-chat-backend (или любое другое)
   Root Directory: homework-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Нажмите "Deploy Web Service"**
   - Дождитесь завершения деплоя (2-3 минуты)
   - Скопируйте URL (например: `https://global-chat-backend-xyz.onrender.com`)

### 2. Обновление конфигурации фронтенда

Обновите файл `.github/workflows/deploy.yml`:

```yaml
# В секции Build замените URL на ваш:
env:
  VITE_API_BASE_URL: https://your-actual-backend-url.onrender.com
```

### 3. Коммит и пуш

```bash
git add .
git commit -m "Add backend deployment config"
git push origin main
```

### 4. Настройка GitHub Pages

1. **Зайдите в настройки репозитория на GitHub**
2. **Перейдите в Settings → Pages**
3. **В разделе Source выберите "GitHub Actions"**
4. **Дождитесь завершения деплоя** (в разделе Actions)

### 5. Результат

- **Фронтенд**: `https://ваш-username.github.io/global-chat/`
- **Бэкенд**: `https://ваш-backend-url.onrender.com`

---

## 🔧 Альтернативные варианты

### Если Render.com не подходит:

#### Railway.app
1. Зарегистрируйтесь на [railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Выберите папку `homework-backend`
4. Railway автоматически настроит деплой

#### Heroku (платно после бесплатного периода)
1. Создайте аккаунт на [heroku.com](https://heroku.com)
2. Установите Heroku CLI
3. В папке `homework-backend`:
   ```bash
   heroku create your-app-name
   git subtree push --prefix homework-backend heroku main
   ```

---

## 🐛 Решение проблем

### Фронтенд не может подключиться к бэкенду
- Проверьте URL бэкенда в `.github/workflows/deploy.yml`
- Убедитесь, что бэкенд запущен и отвечает
- Проверьте CORS настройки в бэкенде

### Бэкенд не запускается
- Проверьте логи в Render.com Dashboard
- Убедитесь, что все зависимости установлены
- Проверьте, что используется правильная версия Node.js

### GitHub Actions падает с ошибкой
- Проверьте синтаксис в `.github/workflows/deploy.yml`
- Убедитесь, что GitHub Pages включены в настройках

---

## 📝 Полезные ссылки

- [Render.com Documentation](https://render.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
