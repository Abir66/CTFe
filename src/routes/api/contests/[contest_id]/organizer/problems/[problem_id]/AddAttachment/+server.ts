import {json} from '@sveltejs/kit'
import organizer from '$lib/server/database/organizer';
import { AZURE_STORAGE_CONNECTION_STRING } from '$env/static/private';
import { BlobSASPermissions, BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import crypto from 'crypto';
import { error } from "@sveltejs/kit"

export async function POST({ locals,params,request}) {

   const data= await request.formData();
   const files = data.getAll('files') as File[];
   const variation_id = data.get('id');
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
         return json(result);
        
    } catch (e) {
        console.log("error");
        throw error(500, "Fileuploadfaild");
        
    }
}
}

//    console.log(data);
   
//    const score = data.get('score');
//    const name = data.get('description');
//     console.log(score);
//     console.log(name);
//    let has_penalty;
//    if(score==0 || score=='' || score=='0'){
//        has_penalty = false;
//     }
//     else{
//         has_penalty = true;
//     }
//     console.log(params.problem_id);
    
//    const result = await organizer.Add_hint(params.problem_id, name, has_penalty, score);
//     console.log(result);
    

    //  console.log(data.getAll('files'));
     
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



