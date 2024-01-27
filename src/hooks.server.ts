// src/hooks.server.js
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { redirect, error } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

async function supabase({ event, resolve }) {
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event,
  })

  /**
   * a little helper that is written for convenience so that instead
   * of calling `const { data: { session } } = await supabase.auth.getSession()`
   * you just call this `await getSession()`
   */
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    return session
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    },
  })
}

async function authorization({ event, resolve }) {

  let user = null;
  const session = await event.locals.getSession()
  if (session) {
    const uid = session.user.id
    const { data } = await event.locals.supabase
      .from('users')
      .select('*')
      .eq('auth_id', uid)
      .single()
    
      if(data) user = data
  }

  console.log(user)
  console.log(session)

  event.locals.user = user

  if (event.url.pathname.startsWith('/auth') && session!=null) {
   
    const pathname = event.url.pathname
    if(pathname == '/auth/login' || pathname == '/auth/register')
      throw redirect(303, '/')
  }

  return resolve(event)
}

export const handle = sequence(supabase, authorization)