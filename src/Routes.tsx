import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Index from './pages/Index'
import GetClassWorksByStudent from './pages/GetClassWorksByStudent'
import GetClassWorksByTeacher from './pages/GetClassWorksByTeacher'
import GetUserClasses from './pages/GetUserClasses'
import GetUserClassDetail from './pages/GetUserClassDetail'
import ShowWorks from './pages/ShowWorks'
import ShowScores from './pages/ShowScores'
import UpdateLogs from './pages/UpdateLogs'
import PermissionDenied from './components/PermissionDenied'
import ErrorPage from './pages/ErrorPage'
import Verify from './pages/Verify'

const MainRoutes = () => {
	const location = useLocation()
	const nodeRef = React.useRef(null);
	return (
		<TransitionGroup component={null}>
			<CSSTransition key={location.key} classNames="fade" timeout={300} nodeRef={nodeRef}>
				<Routes location={location}>
					<Route path="/" element={<Navigate replace to="/index" />} />
					<Route path="/verify" element={<Verify />} />
					<Route path="/showWorks/:openId/:homeworkId/:classId/:workType" element={<ShowWorks />} />
					{(localStorage.getItem('authorizationCode') && localStorage.getItem('classList')) ? (
						<>
							<Route path="/index" element={<Index />} />
							<Route path="/classList" element={<Index />} />
							<Route path="/getClassWorksByStudent/:openId/:memberId/:cid?" element={<GetClassWorksByStudent />} />
							<Route path="/getClassWorksByTeacher/:openId/:classId?" element={<GetClassWorksByTeacher />} />
							<Route path="/getUserClasses/:openId" element={<GetUserClasses />} />
							<Route path="/getUserClassDetail/:openId/:memberId" element={<GetUserClassDetail />} />
							<Route path="/showScores/:openId/:examId/:scoreId" element={<ShowScores />} />
							<Route path="/updateLogs" element={<UpdateLogs />} />
							<Route path="/denied" element={<PermissionDenied />} />
							<Route path='*' element={<ErrorPage />} />
						</>
					) : (
						<Route path='*' element={<Navigate replace to="/verify" />} />
					)
					}
				</Routes>
			</CSSTransition >
		</TransitionGroup >
	)
}

export default MainRoutes;