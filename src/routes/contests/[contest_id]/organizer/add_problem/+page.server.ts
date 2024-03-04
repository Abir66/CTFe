import { AZURE_STORAGE_CONNECTION_STRING } from '$env/static/private';
import type { Actions } from './$types';
import organizer from '../../../../../lib/server/database/organizer';
import { fail } from '@sveltejs/kit';
import { BlobSASPermissions, BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import crypto from 'crypto';
import categories from '$lib/categories';


export const load = async ({params, locals:{supabase}}) => {
	
	const contest_id = params.contest_id;
	const problems = await supabase.from('contest_problems').select("*").eq('contest_id',contest_id);
	// console.log("hehe\n");
	
	// 
	
	// console.log("hehe\n");

	let data = {
		problems: problems.data,
	}

	

    

	return data;

}


export const actions: Actions = {
	ProblemCreation: async ({ request, url, locals, params }) => {
		const contest_id = params.contest_id;
		const formdata = await request.formData();
		const files = formdata.getAll('files') as File[];
		const body = Object.fromEntries(formdata);
        const links= JSON.stringify(formdata.getAll('links'));
		console.log(links);
		const hints = JSON.parse(formdata.getAll('hints')[1]);
		console.log(hints);
		const requirements= JSON.parse(formdata.getAll('requirements')[1]);
		console.log(requirements);
		if (!body.category || !categories.includes(body.category as string)) {
			return fail(400, { category: true });
		}
		let result = await organizer.Add_problem(body, locals.user.id, contest_id);

		if (result.success) {

			const problem_id = result.data[0].id;
			for (const hint of hints) {
				if(hint.hint!==''){
				let has_penalty;
				if (hint.penalty == '' || hint.penalty == '0') {
					has_penalty = false;
				}
				else {
					has_penalty = true;
				}
				result = await organizer.Add_hint(problem_id, hint.hint, has_penalty, hint.penalty);
				if (!result.success) {
					return fail(400, {HintAddFailed: true });
				}
			}
			}
			for (const requirement of requirements) {
				
				result = await organizer.Add_requirement(problem_id, requirement.id);
				if (!result.success) {
					return fail(400, { RequirementAddFailed: true });
				}
			}
			
			result = await organizer.Add_variations(body, problem_id);
			console.log(result);
			if (result.success) {
				const variation_id = result.data[0].id;
				console.log(files.length);
				console.log(files);
				for (const file of files) {
					if(file.name!==''){
					const fileName = file.name;
					const fileBuffer = await file.arrayBuffer();
					let fileextension = fileName.split('.').pop() as string;
					const sasUrl = await getSasUrl(variation_id, "problems", fileextension);
					const blockBlobClient = new BlockBlobClient(sasUrl);
					try {
						const uploadBlobResponse = await blockBlobClient.uploadData(fileBuffer);
						const url = uploadBlobResponse._response.request.url.split('?')[0];
						let result = await organizer.Add_attachments(url, variation_id, fileName);
						if (!result.success) {
							return fail(400, { Addattachmentfaild: true });
						}
						console.log(url);
					} catch (error) {
						console.log("error");
						return fail(400, { Fileuploadfailed: true });
					}
				}
			}

			}
			else {
				return fail(400, { variationaddfailed: true });
			}
		}
		else {
			return fail(400, { problemcreationfailed: true });
		}

	}

  
};

async function getSasUrl(folders: string, containerName: string, fileextension: string) {
	const containerClient = getContainerClient(containerName);

	// 特定のパスを指定
	const blockBlobClient = containerClient.getBlockBlobClient(
		folders + '/' + crypto.randomUUID() + "." + fileextension
	);

	return blockBlobClient.generateSasUrl({

		// 書き込みを許可
		permissions: BlobSASPermissions.from({
			write: true
		}),

		// 有効期間は1時間
		expiresOn: new Date(new Date().setHours(new Date().getHours() + 1))
	});
}

function getContainerClient(containerName: string) {
	const blobServiceClient = getBlobServiceClient();
	const containerClient = blobServiceClient.getContainerClient(containerName);
	return containerClient;
}

function getBlobServiceClient() {



	if (!AZURE_STORAGE_CONNECTION_STRING) {
		throw Error('Azure Storage Connection string not found');
	}
	const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
	return blobServiceClient;
}
