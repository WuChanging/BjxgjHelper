import { useParams } from "react-router-dom"
import UserScores from "../../components/UserScores"

const ShowScores = () => {
	const { examId, openId, scoreId } = useParams()
	const data = {
		examId: examId ? examId : "",
		openId: openId ? openId : "",
		scoreId: scoreId ? scoreId : ""
	}
	
	return (
		<UserScores data={data}/>
	)
}

export default ShowScores