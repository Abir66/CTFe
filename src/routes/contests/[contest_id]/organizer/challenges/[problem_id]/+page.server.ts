import { error } from '@sveltejs/kit';
import organizer from '$lib/server/database/organizer';
import type { Actions } from './$types';

import { AZURE_STORAGE_CONNECTION_STRING } from '$env/static/private';

import { fail } from '@sveltejs/kit';
import { BlobSASPermissions, BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import crypto from 'crypto';
import categories from '$lib/categories';

export const load = async ({url,params,locals:{supabase}}) => {
  
    
    const  problem_id = params.problem_id;
    const contest_id = params.contest_id;
    const problems = await supabase.from('contest_problems').select("*").eq('contest_id',contest_id);
	// console.log("hehe\n");
	
	// 
	
	// console.log("hehe\n");



    //get the problem details

    let res = await supabase.from('contest_problems').select("*").eq('id',problem_id);
    console.log(res);
    if(res.error){
        console.error(res.error);
        return error(500, "something went wrong");
    }
  
   
    //get the hints

    let res1 = await supabase.from('hints').select("*").eq('problem_id',problem_id);
    console.log(res1);
    if(res1.error){
        console.error(res1.error);
        return error(500, "something went wrong");
    }

    //get the requirements
    
    let res2 = await organizer.get_requirements(problem_id);
    if(res2.error){
        console.error(res2.error);
        return error(500, "something went wrong");
    }

   

    // get problem variations

    // let res3 = await supabase.from('problem_variations').select("*").eq('problem_id',problem_id);
    //  console.log(res3);
	let res3 = await organizer.get_variations(problem_id);
	console.log(res3);
	
     
    if(res3.error){
        console.error(res3.error);
        return error(500, "something went wrong");
    }
	
    return {
        problem: res.data[0],
        hints: res1.data,
        requirements: res2.data,
        contest_id:params.contest_id,
        problems: problems.data,
        variations: res3.data
    };
    
}


export const actions: Actions = {

    addvariation: async ({ request, url, locals, params }) => {
		const contest_id = params.contest_id;
		const formdata = await request.formData();
		const files = formdata.getAll('files') as File[];
		const body = Object.fromEntries(formdata);
     const problem_id = params.problem_id;
			let result = await organizer.Add_variations(body, problem_id);
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
		

	}








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
