import { Flex, SimpleGrid } from '@chakra-ui/react';
import React, { useState } from 'react'
import request from 'superagent';
import { BiImageAdd } from "react-icons/bi";
import UploadStatus from './PhotoUploaderStatus'

const PhotoUploader = () => {

	const [uploadedPhotos, setUploadedPhotos] = useState<any>([])
	const [photoId, setPhotoId] = useState(0)

	const onPhotoUploadProgress = (data: any) => {
		setUploadedPhotos((prev: any) => {
			let photoIndex = -1;
			const updatedPhotos = prev.map((photo: any, index: number) => {
				if (photo.photoId === data.photoId) {
					photoIndex = index;
					return { ...photo, ...data };
				}
				return photo;
			})

			if (photoIndex !== -1) {
				return updatedPhotos
			} else {
				return [data, ...updatedPhotos]
			}
		})
	}

	const upload = (files: any) => {
		try {
			const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`;

			for (let file of files) {

				setPhotoId(photoId + 1)

				const fileName = file.name;
				request.post(url)
					.field('upload_preset', process.env?.REACT_APP_UPLOAD_PRESET || "")
					.field('file', file)
					.field('multiple', true)
					.field('tags', fileName) // ? `myphotoalbum,${title}` : 'myphotoalbum')
					.field('context', `photo=${fileName}`)
					.on('progress', (progress: any) => {
						console.log('photoId', photoId)
						onPhotoUploadProgress({ photoId, fileName: file.name, progress })
					})
					.end((error, response) => {
						console.log("-------------------//-------------------")
						onPhotoUploadProgress({ photoId, fileName: file.name, response })
					});
			}
		} catch (error) {
			console.log(error)
		}
	}

	const onDeleted = (delete_token: string) => {
		setUploadedPhotos((prev: any) => {
			const filt = prev.filter((t: any) => {
				try {
					if (t.response.body.delete_token === delete_token) {
						return false
					}
					return true;
				} catch (error) {
					return false
				}
			});
			return [...filt]

		});

	}

	return (
		<Flex w="100%" direction="column">
			<label htmlFor="file-upload"	>

				<span> <BiImageAdd fontSize="50px" color="teal" /> (	{uploadedPhotos.length}	 )			</span>

			</label>
			<input id="file-upload" type="file" accept="image/*" onChange={(e) => {
				if (uploadedPhotos.length < 5) {
					upload(e.target.files)
				} else {
					console.log('Maximum upload files');
				}
			}
			} style={{ display: 'none', }} />

			<hr />
			<SimpleGrid columns={{ base: 3, sm: 1, md: 3, lg: 4 }} spacing="3" >

				{uploadedPhotos.map((uploadedPhoto: any, index: number) => {
					return (
						<UploadStatus key={index}
							uploadedPhoto={uploadedPhoto}
							onDeleted={(delete_token: any) => onDeleted(delete_token)} />
					);
				})}
			</SimpleGrid>
		</Flex>
	);
}
export default PhotoUploader
