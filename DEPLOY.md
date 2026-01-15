# Инструкция по деплою на Railway

Этот проект состоит из трех компонентов:
1. **Frontend** (Next.js) - веб-приложение
2. **Bot** (Telegram бот) - отдельный процесс
3. **Database** - Supabase (внешний сервис)

## Вариант 1: Деплой как два отдельных сервиса (Рекомендуется)

### Шаг 1: Подготовка Supabase

1. Создайте проект на [Supabase](https://supabase.com)
2. Примените все миграции из папки `supabase/migrations/`:
   - 001_initial_schema.sql
   - 002_allow_guest_orders.sql
   - 003_admin_settings.sql
   - 004_store_bot_settings.sql
   - 005_product_categories.sql
   - 006_storage_setup.sql
   - 007_bot_welcome_message.sql
3. Создайте Storage bucket:
   - Перейдите в Storage → Create Bucket
   - Название: `images`
   - Public: `true`
   - Настройте политики доступа

### Шаг 2: Деплой Frontend на Railway

1. Создайте новый проект на [Railway](https://railway.app)
2. Добавьте GitHub репозиторий или загрузите код
3. Railway автоматически определит Next.js проект
4. Настройте переменные окружения:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=https://your-app.railway.app
   NODE_ENV=production
   ```
5. Railway автоматически соберет и задеплоит приложение
6. Получите URL вашего приложения (например: `https://bazarplus.railway.app`)

### Шаг 3: Деплой Bot на Railway

1. В том же проекте Railway создайте новый сервис
2. Выберите "Empty Service" или добавьте еще один репозиторий
3. Настройте команду запуска: `npm run bot`
4. Настройте переменные окружения:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=https://your-app.railway.app
   NODE_ENV=production
   ```
5. Убедитесь, что бот запущен и работает

### Шаг 4: Обновление URL в Supabase

1. Обновите `NEXT_PUBLIC_SITE_URL` в обоих сервисах с финальным URL
2. Перезапустите сервисы

## Вариант 2: Деплой как один сервис с несколькими процессами

### Использование PM2 или аналогичного менеджера процессов

1. Установите `pm2`:
   ```bash
   npm install -g pm2
   ```

2. Создайте `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'frontend',
         script: 'npm',
         args: 'start',
         env: {
           NODE_ENV: 'production'
         }
       },
       {
         name: 'bot',
         script: 'npm',
         args: 'run bot',
         env: {
           NODE_ENV: 'production'
         }
       }
     ]
   }
   ```

3. Обновите `package.json`:
   ```json
   "start": "pm2-runtime start ecosystem.config.js"
   ```

## Переменные окружения

### Frontend
- `NEXT_PUBLIC_SUPABASE_URL` - URL проекта Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon ключ Supabase
- `NEXT_PUBLIC_SITE_URL` - URL вашего сайта
- `NODE_ENV=production`

### Bot
- `TELEGRAM_BOT_TOKEN` - Токен Telegram бота
- `NEXT_PUBLIC_SUPABASE_URL` - URL проекта Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role ключ Supabase
- `NEXT_PUBLIC_SITE_URL` - URL вашего сайта
- `NODE_ENV=production`

## Получение Telegram Bot Token

1. Откройте [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен в переменные окружения

## Проверка деплоя

1. **Frontend**: Откройте URL вашего приложения в браузере
2. **Bot**: Отправьте `/start` боту в Telegram
3. **Database**: Проверьте подключение через Supabase Dashboard

## Мониторинг

Railway предоставляет:
- Логи в реальном времени
- Метрики использования
- Автоматические перезапуски при сбоях

## Обновление

При пуше в репозиторий Railway автоматически:
1. Обнаружит изменения
2. Пересоберет проект
3. Задеплоит новую версию

## Troubleshooting

### Бот не запускается
- Проверьте `TELEGRAM_BOT_TOKEN`
- Проверьте логи в Railway Dashboard
- Убедитесь, что бот запущен как отдельный процесс

### Frontend не подключается к Supabase
- Проверьте переменные окружения
- Убедитесь, что RLS политики настроены правильно
- Проверьте CORS настройки в Supabase

### Изображения не загружаются
- Убедитесь, что Storage bucket создан
- Проверьте политики доступа к Storage
- Проверьте `SUPABASE_SERVICE_ROLE_KEY`

