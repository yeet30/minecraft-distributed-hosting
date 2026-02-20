import java.awt.Color;
import java.io.IOException;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class Frame extends JFrame{
    Frame(){

        JButton button = new JButton("Start Server");
        button.setBounds(260,120,120,30);
        button.setFocusable(false);
        button.addActionListener(e -> {
            try {
                ProcessBuilder pb = new ProcessBuilder("server.bat");
                pb.start();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        });

        JLabel membersTitle = new JLabel("Members");
        membersTitle.setBounds(30, 10, 100,30);

        JPanel membersPanel = new JPanel();
        membersPanel.setBounds(520,0,120,420);
        membersPanel.setBackground(Color.gray);
        membersPanel.setLayout(null);
        membersPanel.add(membersTitle);

        this.setSize(640, 420);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setVisible(true);
        this.setResizable(false);
        this.setTitle("Launcher");
        this.setLayout(null);
        this.add(button);
        this.add(membersPanel);
    }
}
