import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { delete_session } from "$lib/server/auth"

export const POST: RequestHandler = async ({ cookies }) => {
	await delete_session(cookies)
	throw redirect(303, "/")
}
