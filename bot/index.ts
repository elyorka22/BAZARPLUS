import { Telegraf, Markup } from 'telegraf'
import { createClient } from '@supabase/supabase-js'

// Get environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!TELEGRAM_BOT_TOKEN) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN is not set!')
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: Supabase credentials are not set!')
  process.exit(1)
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Main menu keyboard with permanent reply buttons
const mainKeyboard = Markup.keyboard([
  ['🌐 Sayt haqida', '🏪 Sotuvchi bo\'lish']
]).resize().persistent()

// Start command
bot.start(async (ctx) => {
  try {
    // Get welcome message from database
    const { data: welcomeData } = await supabase
      .from('bot_settings')
      .select('value')
      .eq('key', 'welcome_message')
      .single()

    const welcomeMessage = welcomeData?.value || 
      'Assalomu alaykum! BazarPlus do\'koniga xush kelibsiz! 🛒\n\n' +
      'Quyidagi tugmalardan birini tanlang:'

    await ctx.reply(welcomeMessage, mainKeyboard)
  } catch (error) {
    console.error('Error in start command:', error)
    await ctx.reply(
      'Assalomu alaykum! BazarPlus do\'koniga xush kelibsiz! 🛒\n\n' +
      'Quyidagi tugmalardan birini tanlang:',
      mainKeyboard
    )
  }
})

// Handle "Sayt haqida" button
bot.hears('🌐 Sayt haqida', async (ctx) => {
  try {
    // Get site info from database
    const { data: siteInfo } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'site_about')
      .single()

    const aboutText = siteInfo?.value || 
      'BazarPlus - bu onlayn do\'kon platformasi bo\'lib, mijozlar va sotuvchilar uchun qulay xizmat ko\'rsatadi.\n\n' +
      'Bizning saytimiz orqali:\n' +
      '✅ Turli mahsulotlarni topish va sotib olish\n' +
      '✅ Tez va qulay yetkazib berish\n' +
      '✅ Xavfsiz to\'lov tizimi\n' +
      '✅ 24/7 mijozlar xizmati\n\n' +
      'Sayt: ' + (process.env.NEXT_PUBLIC_SITE_URL || 'https://bazarplus.uz')

    await ctx.reply(aboutText, mainKeyboard)
  } catch (error) {
    console.error('Error getting site info:', error)
    await ctx.reply(
      'BazarPlus - bu onlayn do\'kon platformasi. Batafsil ma\'lumot uchun saytimizga tashrif buyuring.',
      mainKeyboard
    )
  }
})

// Handle "Sotuvchi bo'lish" button
bot.hears('🏪 Sotuvchi bo\'lish', async (ctx) => {
  try {
    // Get "become seller" page content from database
    const { data: sellerPage } = await supabase
      .from('become_seller_page')
      .select('title, content, image_url')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (sellerPage) {
      let message = `*${sellerPage.title}*\n\n${sellerPage.content}`
      
      if (sellerPage.image_url) {
        await ctx.replyWithPhoto(sellerPage.image_url, {
          caption: message,
          parse_mode: 'Markdown',
          ...mainKeyboard
        })
      } else {
        await ctx.reply(message, {
          parse_mode: 'Markdown',
          ...mainKeyboard
        })
      }
    } else {
      const defaultMessage = 
        '🏪 *Sotuvchi bo\'lish*\n\n' +
        'Bizning platformamizda o\'z mahsulotlaringizni sotishni boshlang!\n\n' +
        'Afzalliklari:\n' +
        '✅ Bepul ro\'yxatdan o\'tish\n' +
        '✅ Oson mahsulot qo\'shish\n' +
        '✅ Keng auditoriyaga yetish\n' +
        '✅ Xavfsiz to\'lov tizimi\n\n' +
        'Ro\'yxatdan o\'tish uchun saytimizga tashrif buyuring:\n' +
        (process.env.NEXT_PUBLIC_SITE_URL || 'https://bazarplus.uz') + '/auth/register'

      await ctx.reply(defaultMessage, {
        parse_mode: 'Markdown',
        ...mainKeyboard
      })
    }
  } catch (error) {
    console.error('Error getting seller page:', error)
    await ctx.reply(
      'Sotuvchi bo\'lish uchun saytimizga tashrif buyuring va ro\'yxatdan o\'ting.',
      mainKeyboard
    )
  }
})

// Handle any other text messages
bot.on('text', async (ctx) => {
  await ctx.reply(
    'Iltimos, quyidagi tugmalardan birini tanlang:',
    mainKeyboard
  )
})

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err)
  ctx.reply('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', mainKeyboard)
})

// Start bot
if (process.env.TELEGRAM_BOT_TOKEN) {
  bot.launch()
  console.log('Telegram bot started!')
} else {
  console.error('TELEGRAM_BOT_TOKEN is not set!')
}

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

