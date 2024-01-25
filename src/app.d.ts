// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { SupabaseClient, Session } from '@supabase/supabase-js'


declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient
			getSession(): Promise<Session | null>,
			user? : {
				id : number,
				username : string,
				email : string,
				auth_id : string,
				[key: string]: any;
			} | any
		}
		interface PageData {
			session? : Session | null,
		}
		interface PageState {
			path : string | null,
			data : any | null,
		}
		// interface Platform {}
	}
}

export {};
