-- Insert default welcome message if not exists
INSERT INTO bot_settings (key, value, description)
VALUES ('welcome_message', 
  'Assalomu alaykum! BazarPlus do''koniga xush kelibsiz! 🛒

Quyidagi tugmalardan birini tanlang:',
  'Telegram bot uchun xush kelibsiz xabari')
ON CONFLICT (key) DO NOTHING;

-- Insert default site about if not exists
INSERT INTO site_settings (key, value, description)
VALUES ('site_about',
  'BazarPlus - bu onlayn do''kon platformasi bo''lib, mijozlar va sotuvchilar uchun qulay xizmat ko''rsatadi.

Bizning saytimiz orqali:
✅ Turli mahsulotlarni topish va sotib olish
✅ Tez va qulay yetkazib berish
✅ Xavfsiz to''lov tizimi
✅ 24/7 mijozlar xizmati',
  'Sayt haqida ma''lumot')
ON CONFLICT (key) DO NOTHING;

