package com.scene.model;

import sun.applet.Main;

import javax.websocket.Session;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by 11723 on 2017/2/6.
 */
public class DataSource {
    private static List<String> messages = new ArrayList<>();
    public static Map<Session,Boolean> sessions = new HashMap<>();
//    public static List<Session> sessions = new ArrayList<>();

    public static String getFirstMessage(){
        String firstMessage = messages.size() == 0 ? null : messages.get(0);
        if (firstMessage != null)
            messages.remove(0);
        return firstMessage;
    }

//    public static String getFirstMessage(){
//        String firstMessage = "";
//        if (messages.size() == 0){
//            init();
//        }
//        firstMessage = messages.get(0);
//        if (firstMessage.length() != 0)
//            messages.remove(0);
//        return firstMessage;
//    }
    public static void addOneMessage(String message){
        messages.add(message);
    }

    private static void init(){
        try {
            File file = new File("message.txt");
            FileReader fr = new FileReader(file);
            BufferedReader br = new BufferedReader(fr);
            String str;
            StringBuffer stringBuffer = new StringBuffer();
            while((str = br.readLine()) != null){
                stringBuffer.append(str);
            }
            String[] strings = stringBuffer.toString().split("-");
            for (int i = 0;i < strings.length ;i ++)
                messages.add(strings[i]);
            br.close();
            fr.close();
        }catch (Exception e){
            System.out.println("错误");
            e.printStackTrace();
        }
    }
//    public static void sendMessage(){
//        try {
//            String message = DataSource.getFirstMessage();
//            if (message != null){
//                for (Session session:DataSource.sessions){
//                    System.out.println("发送=="+session);
//                    session.getBasicRemote().sendText(message);
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
public static void sendMessage(){
    try {
        String message = DataSource.getFirstMessage();
        if (message != null){
            new Thread() {
                @Override
                public void run(){
                    for (Map.Entry<Session,Boolean> session:DataSource.sessions.entrySet()){
                        if (session.getValue()){
                            try {
                                session.getKey().getBasicRemote().sendText(message);
                            }catch (Exception e){
                                sessions.remove(session.getKey());
                            }
                        }
                    }
                }
            }.start();
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}

}
