import UserClasses from "../../components/GetUserClasses"
import { useParams } from "react-router-dom"

const GetUserClasses = () => {
	const { openId } = useParams()
	return (
		<UserClasses openId={openId ? openId : ""}/>
	)
}

export default GetUserClasses