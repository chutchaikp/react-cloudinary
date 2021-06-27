import { Button } from '@chakra-ui/react';
import React from 'react'
import request from 'superagent';

const PhotoUploaderStatus = (props: any) => {

	const uploadedPhoto = props.uploadedPhoto;
	const response = uploadedPhoto.response;
	const data = response && response.body;
	const percent = uploadedPhoto.progress ? Math.floor(uploadedPhoto.progress.percent) : 100;

	const deletePhoto = (delete_token: string) => {
		request
			.post(
				`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/delete_by_token`
			)
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				token: delete_token,
			})
			.then(() => {
				props.onDeleted(delete_token)
			})
			.catch((error) => {
				debugger;

			});
	}

	return (
		<div>
			{/* <h3>{uploadedPhoto.fileName}</h3> */}
			<div className="status">
				{!response && <div>Uploading... {percent}%</div>}
				{!response && <div>In progress</div>}
				{/* {response && (
					<div className="status-code">
						Upload completed with status code {response.status}
					</div>
				)} */}
			</div>
			<div className="progress-bar">
				<div
					className="progress"
					role="progressbar"
					style={{ width: percent + '%' }}
				/>
			</div>
			{data && (
				<div className="info">
					<img width="250px" src={data.url} alt={data.original_filename} />
					{/* <table>
						<tbody>
							{Object.keys(data).map(key => {
								return (
									<tr key={key}>
										<td>{key}</td>
										<td>{JSON.stringify(data[key])}</td>
									</tr>
								);
							})}
						</tbody>
					</table> */}
				</div>
			)}

			{data &&
				data.delete_token && (
					<Button size="xs" colorScheme="red" variant="outline" rounded="none" mt="0.5rem" onClick={() => { deletePhoto(data.delete_token) }}>delete!</Button>
				)}
		</div>
	);
}

export default PhotoUploaderStatus
