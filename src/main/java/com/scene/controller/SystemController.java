package com.scene.controller;

import com.scene.model.DataSource;
import com.scene.service.RootService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by 11723 on 2017/2/6.
 */
@Controller
@RequestMapping("/system")
public class SystemController {

    @Autowired
    private RootService service;

    @ResponseBody
    @RequestMapping(value = "/get",method = RequestMethod.GET)
    public Map<String,Object> getMessage(){
        Map<String, Object> jsonMap = new HashMap<>();
        try {
            jsonMap.put("message",service.getMessage());
            jsonMap.put("session-size", DataSource.sessions.size());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jsonMap;
    }


    @ResponseBody
    @RequestMapping(value = "/add",method = RequestMethod.GET)
    public void addMessage(@RequestParam(value = "message",defaultValue = "")String message){
        service.addMessage(message);
    }
}
