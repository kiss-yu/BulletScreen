package com.scene.service;

import com.scene.model.DataSource;
import org.springframework.stereotype.Service;

/**
 * Created by 11723 on 2017/2/6.
 */
@Service
public class RootService {
    public String getMessage() throws InterruptedException {
        return DataSource.getFirstMessage();
    }

    public void addMessage(String message){
        if (message.length() > 35 || message.length() < 1)
            return;
        DataSource.addOneMessage(message);
        DataSource.sendMessage();
    }
}
