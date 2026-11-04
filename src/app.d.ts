// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user? : {
				id : number,
				username : string,
				email : string,
				[key: string]: any;
			} | any
		}
		interface PageData {
			team? : any,
			user? : any,
			contest? : any,
		}
		interface PageState {
			path : string | null,
			data : any | null,
		}
		// interface Platform {}
	}
}

export {};
