import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;

import java.awt.Color;
import java.io.IOException;


public class LoginFrame extends JFrame{
    
    LoginFrame(){

        JLabel loginTitle = new JLabel("Please login with your google account.");
        loginTitle.setHorizontalAlignment(JLabel.CENTER);
        loginTitle.setBounds(75,50,250,50);
        loginTitle.setBorder(BorderFactory.createLineBorder(Color.black, 1));

        JButton loginButton = new JButton("LOGIN");
        loginButton.setFocusable(false);
        loginButton.setBounds(150,200,100,50);
        loginButton.addActionListener(e -> {
            try {
                ProcessBuilder pb = new ProcessBuilder("server.bat");
                pb.start();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        });

        this.setSize(420, 420);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setVisible(true);
        this.setResizable(false);
        this.setTitle("Login");
        this.add(loginTitle);
        this.add(loginButton);
        this.setLayout(null);
    }

}
