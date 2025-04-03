import { useParams } from "react-router-dom";
import GetUserClassDetailComponent from "../../components/GetUserClassDetail";

const GetUserClassDetail = () => {
	const { openId, memberId } = useParams()
	const data = {
		openId: openId ? openId : "",
		memberId: memberId ? memberId : ""
	}
	
	return (
		<div>
			<GetUserClassDetailComponent data={data} />
		</div>
	)
}

export default GetUserClassDetail