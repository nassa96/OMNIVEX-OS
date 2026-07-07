export async function logEvent(sb, type, payload) {
  try {
    await sb.from('events').insert({
      type,
      payload,
      created_at: new Date().toISOString()
    })
  } catch (e) {
    console.error('[EVENT_LOG_ERROR]', e.message)
  }
}
