import React from 'react'
import './index.css'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { navigations } from '../../configs'

const TopMenu = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const turnBackPage = () => {
		navigate(-1)
	}
	// <div className={location.pathname.includes("/verify") ? "active" : ""}>
	return (
		<div>
			<div className="top-menu">
				{location.pathname.includes("/index") ? "" : (
					<div className='back' onClick={turnBackPage}><i className='icon turn-back' /></div>
				)}

				<div className='top-menu-navigations'>
					<Link to="/index" className={"nav" + (location.pathname.includes("/index") ? " active" : "")} key="班级列表">
						<i className='icon index' />班级列表
					</Link>
					{navigations.topMenu.map((e) => (
						location.pathname.includes(e.to) ? (
							<div className={"nav right-navs" + (location.pathname.includes(e.to) ? " active" : "")} key={e.name}>
								{e.icon ? (<i className={"icon " + e.icon} />) : ''}
								{e.name}
							</div>
						) : ""
					))}
				</div>
			</div>
			<div className="top-menu-placeholder" />
		</div>
	);
}
export default TopMenu