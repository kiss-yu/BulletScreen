package com.scene.web.interceptor;

import java.beans.PropertyDescriptor;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.SqlCommandType;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.scene.web.annotation.CreationOperator;
import com.scene.web.annotation.CreationTimestamp;
import com.scene.web.annotation.UpdateOperator;
import com.scene.web.annotation.UpdateTimestamp;
import com.scene.web.component.UserManager;

@Intercepts({@Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class})})
public class AuditingInterceptor implements Interceptor {
	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		MappedStatement mappedStatement = (MappedStatement) invocation.getArgs()[0];
		SqlCommandType sqlCommandType = mappedStatement.getSqlCommandType();
		
		if (SqlCommandType.INSERT == sqlCommandType) {
//			System.out.println("INSERT!!");
			Date now = new Date();
			
//			Integer userId = WebManager.getUserId();
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			HttpSession session = request.getSession();
			Integer userId = (Integer) session.getAttribute(UserManager.USER_ID);
			
			Object object = invocation.getArgs()[1];
			doInjection(object, CreationTimestamp.class, now);
			doInjection(object, CreationOperator.class, userId);
		} else if (SqlCommandType.UPDATE == sqlCommandType) {
//			System.out.println("UPDATE!!");
			Date now = new Date();
			
//			Integer userId = WebManager.getUserId();
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			HttpSession session = request.getSession();
			Integer userId = (Integer) session.getAttribute(UserManager.USER_ID);
			
			Object object = invocation.getArgs()[1];
			doInjection(object, UpdateTimestamp.class, now);
			doInjection(object, UpdateOperator.class, userId);
		}
		return invocation.proceed();
	}
	
	@Override
	public Object plugin(Object target) {
		if (target instanceof Executor) {
			return Plugin.wrap(target, this);
		} else {
			return target;
		}
	}
	
	@Override
	public void setProperties(Properties properties) {
	}
	
	private boolean doInjection(Object object, Class<? extends Annotation> annotationClass, Object injectData) {
		try {
			Class<?> objectClass = object.getClass();
			Field[] fields = objectClass.getDeclaredFields();
			for (Field field : fields) {
//				System.out.println(field.getName());
				if (field.getAnnotation(annotationClass) != null) {
					PropertyDescriptor propertyDescriptor = new PropertyDescriptor(field.getName(), objectClass);
					Method writeMethod = propertyDescriptor.getWriteMethod();
					writeMethod.invoke(object, injectData);
				}
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}
