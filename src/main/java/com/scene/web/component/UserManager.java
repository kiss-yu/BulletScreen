package com.scene.web.component;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserManager {
	public static final String USER_ID = "$userId";
	public static final String USER_ROLE = "$userRole";

	@Autowired
	private HttpServletRequest request;

	public void login(Integer userId,Integer userRole) {
//		List<HttpSession> sessions=new ArrayList<HttpSession>();
		HttpSession session = getSession();
		session.setAttribute(USER_ID, userId);
		session.setAttribute(USER_ROLE, userRole);
//		sessions.add(session);
	}
	
	public void logout() {
		HttpSession session = getSession();
		session.invalidate();
	}

	public Integer getUserId() {
		HttpSession session = getSession();
		return (Integer) session.getAttribute(USER_ID);
	}
	
	public Integer getUserRole() {
		HttpSession session = getSession();
		return (Integer) session.getAttribute(USER_ROLE);
	}
	
	private HttpSession getSession() {
		return request.getSession();
	}
}
