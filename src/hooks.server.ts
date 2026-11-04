// src/hooks.server.ts
import { redirect, error } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import Contest from  '$lib/server/database/contest'
import { get_session_user } from '$lib/server/auth'

async function authentication({ event, resolve }) {
  event.locals.user = await get_session_user(event.cookies)
  return resolve(event)
}

async function authorization({ event, resolve }) {

  if (event.url.pathname.startsWith('/auth') && event.locals.user) {
    const pathname = event.url.pathname
    if(pathname == '/auth/login' || pathname == '/auth/register')
      throw redirect(303, '/')
  }

  if(event.url.pathname.includes('/organizer') && event.params.contest_id){
    // if user is not logged in, redirect to login page
    if(!event.locals.user) throw redirect(303, '/auth/login')
    const access_response = await Contest.get_contest_access(event.params.contest_id, event.locals.user.id)
    if(!access_response.success){
      throw error(500, "Internal Server Error")
    }
    const access = access_response.data[0].access
    if(access.access != 'organizer') throw error(403, "Forbidden")
    
  }


  return resolve(event)
}

export const handle = sequence(authentication, authorization)
