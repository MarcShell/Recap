import './post.scss';
import { getProfileImage } from '../../getProfileImage';

// Formatiert ein Datum als DD.MM.YYYY
const formatDate = (dateString) => {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
};

const Post = ({ post }) => {
	//TEMPORARY
	const liked = false;

	return (
		<div className="post">
			<div className="container">
				<div className="user">
					<div className="userInfo">
						<img src={getProfileImage(post.profile)} alt="" />
						<div className="details">
							<span className="name">{post.username}</span>
						</div>
					</div>
					<span className="date">{formatDate(post.createdAt)}</span>
				</div>
				<div className="content">
					<p>{post.desc}</p>
					<img src={post.img} alt="" />
				</div>
			</div>
		</div>
	);
};

export default Post;
