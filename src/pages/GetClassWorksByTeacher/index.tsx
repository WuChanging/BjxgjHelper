import { useParams, useLocation } from "react-router-dom"
import GetClassWorksByTeacherComponent from '../../components/GetClassWorksByTeacher/'

const GetClassWorksByTeacher = () => {
	const { openId, classId } = useParams();
	const { state } = useLocation(); // the state is an array of classId
	const workData = {
		openId: openId ? openId : "",
		classId: state ? ["All classes", ...state] : (classId ? ["All classes", classId] : ["All classes"]),
		defaultClass: classId ? classId : "All classes",
		page: 0,
		size: 10
	}

	return (
		<GetClassWorksByTeacherComponent data={workData} />
	)
}

export default GetClassWorksByTeacher