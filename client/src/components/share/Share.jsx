import './share.scss';
import { useContext, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/authContext';
import { getProfileImage } from '../../getProfileImage';
import { makeRequest } from '../../axios';

const Share = () => {
	const [desc, setDesc] = useState('');
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (newPost) => makeRequest.post('/posts', newPost),
		onSuccess: () => {
			// Feed neu holen, damit der neue Post sofort sichtbar ist
			queryClient.invalidateQueries(['posts']);
		},
	});

	const handleClick = async (e) => {
		e.preventDefault();
		if (!desc.trim()) return;

		try {
			await mutation.mutateAsync({ desc, img: null });
			setDesc('');
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="share">
			<div className="container">
				<div className="top">
					<div className="left">
						<img src={getProfileImage(currentUser.profile)} alt="" />
						<input
							type="text"
							placeholder={`What's on your mind ${currentUser.username}?`}
							onChange={(e) => setDesc(e.target.value)}
							value={desc}
						/>
					</div>
				</div>
				<hr />
				<div className="bottom">
					<div className="right">
						<button onClick={handleClick} disabled={mutation.isPending}>
							{mutation.isPending ? 'Sharing...' : 'Share'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Share;
