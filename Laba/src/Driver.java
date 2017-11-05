import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Vector;

public class Driver {
    BufferedReader br;
    PrintWriter pr;
    public Driver(BufferedReader br, PrintWriter pr) {
        this.br = br;
        this.pr = pr;
    }

    public static void main(String argv[]) {
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            PrintWriter pr = new PrintWriter(System.out);
            Driver driver = new Driver(br, pr);
            pr.println("a for admin, b for user");
            pr.flush();
            driver.init();
            if (br.readLine().equals("a"))
                driver.admin();
            else
                driver.user();

            pr.close();
            br.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void init() {
        MyFileReader.write("admin.text", false, new MyFileReader.CallbackWrite() {
            @Override
            public void success(PrintWriter br) {
                br.println("root");
                br.println("root".hashCode());
            }
        });
    }

    private void user() {
        while (true) {
            Textbook.setTextbooks((Vector<Textbook>) SerializableObject.Deserialize("textbooks.out"));
            Instructor.setInstructors((Vector<Instructor>) SerializableObject.Deserialize("instructors.out"));
            Course.setCourses((Vector<Course>) SerializableObject.Deserialize("courses.out"));
            pr.println("Enter number of course for more info or q to quit");
            pr.flush();
            int cnt = 0;
            for (Course c : Course.getCourses()) {
                pr.println(cnt++ + ". " + c.getTitle());
            }
            pr.flush();

            String cmd = null;
            try {
                cmd = br.readLine();
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (cmd.equals("q")) break;
            pr.println(Course.getCourses().get(Integer.parseInt(cmd)));
            pr.flush();
        }
    }

    String adminUsername, adminPassword;
    private void admin() throws IOException {
        MyFileReader.read("admin.text", br -> {
            try {
                adminUsername = br.readLine();
                adminPassword = br.readLine();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        while(true) {
            String username = null, password = null;
            pr.println("Username: ");
            pr.flush();
            username = br.readLine();
            pr.println("Password: ");
            pr.flush();
            password = br.readLine();
            if (adminUsername.equals(username) && adminPassword.equals(Integer.toString(password.hashCode()))) break;
        }
        Textbook.setTextbooks((Vector<Textbook>) SerializableObject.Deserialize("textbooks.out"));
        Instructor.setInstructors((Vector<Instructor>) SerializableObject.Deserialize("instructors.out"));
        Course.setCourses((Vector<Course>) SerializableObject.Deserialize("courses.out"));
        Logger.log("Admin logged in");
        while (true) {
            pr.println("1. Add textbook");
            pr.println("2. Add instructor");
            pr.println("3. Add course");
            pr.println("q. Quit");
            pr.flush();
            boolean end = false;
            switch (br.readLine()) {
                case "1": Textbook.getTextbooks().add((Textbook) Textbook.create(br, pr)); break;
                case "2": Instructor.getInstructors().add((Instructor) Instructor.create(br, pr)); break;
                case "3": Course.getCourses().add((Course) Course.create(br, pr)); break;
                case "q": end = true; break;
            }
            if (end) break;
        }
        SerializableObject.Serialize(Textbook.getTextbooks(), "textbooks.out");
        SerializableObject.Serialize(Instructor.getInstructors(), "instructors.out");
        SerializableObject.Serialize(Course.getCourses(), "courses.out");
    }
}

