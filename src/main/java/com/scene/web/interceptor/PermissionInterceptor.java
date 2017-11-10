package com.scene.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.scene.web.annotation.Permission;
import com.scene.web.component.UserManager;

public class PermissionInterceptor implements HandlerInterceptor {
	
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception) throws Exception {
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		if (handler instanceof HandlerMethod) {
			HandlerMethod handlerMethod = (HandlerMethod) handler;
			Permission permissionAnnotation = handlerMethod.getMethodAnnotation(Permission.class);
			if (permissionAnnotation != null) {
				HttpSession session = request.getSession();
				System.out.println("session=="+session);
				int value = permissionAnnotation.value();
				int[] roles =permissionAnnotation.roles();
				if (value != -1) {

				} else {

				}
			}
		}
		return true;
	}
}
