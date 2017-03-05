package com.scene.service;

import com.scene.model.DataSource;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/WebSocket/message")
public class MessageWebSocket {

    @OnOpen
    public void onOpen(Session session) {
        DataSource.sessions.put(session,false);
    }

    @OnClose
    public void onClose(Session session) {
        DataSource.sessions.remove(session);
    }

    @OnMessage
    public void onMessage(String message,Session session) {
        boolean bo = message.equals("start") ? DataSource.sessions.put(session,true) : DataSource.sessions.put(session,false);
    }

    @OnError
    public void onError(Session session, Throwable error) {
        DataSource.sessions.remove(session);
        System.out.println("连接错误");
    }
}