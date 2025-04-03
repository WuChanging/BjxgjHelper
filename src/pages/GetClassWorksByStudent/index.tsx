import { useParams } from "react-router-dom"
import GetClassWorksByStudentComponent from '../../components/GetClassWorksByStudent'

const GetClassWorksByStudent = () => {
	const { openId, memberId, cid } = useParams();
	const workData = {
		openId: openId ? openId : "",
		memberId: memberId ? memberId : "",
		cid: cid ? cid : "",
		page: 0,
		size: 10
	}
	
	return (
		<div>
			<GetClassWorksByStudentComponent data={workData} />
		</div>
	)
}

export default GetClassWorksByStudent