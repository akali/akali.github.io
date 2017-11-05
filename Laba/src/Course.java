import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.util.Vector;

public class Course extends InteractivelyCreatableObject implements Serializable {
    private String title;
    private Instructor instructor;
    private Textbook textbook;

    private static Vector<Course> courses;

    public static Vector<Course> getCourses() {
        return courses;
    }

    public static void setCourses(Vector<Course> courses) {
        if (courses == null) courses = new Vector<>();
        Course.courses = courses;
    }

    @Override
    public String toString() {
        return "Course{" +
                "title='" + title + '\'' +
                ", instructor=" + instructor +
                ", textbook=" + textbook +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Course course = (Course) o;

        if (title != null ? !title.equals(course.title) : course.title != null) return false;
        if (instructor != null ? !instructor.equals(course.instructor) : course.instructor != null) return false;
        return textbook != null ? textbook.equals(course.textbook) : course.textbook == null;
    }

    @Override
    public int hashCode() {
        int result = title != null ? title.hashCode() : 0;
        result = 31 * result + (instructor != null ? instructor.hashCode() : 0);
        result = 31 * result + (textbook != null ? textbook.hashCode() : 0);
        return result;
    }

    public String getTitle() {

        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Instructor getInstructor() {
        return instructor;
    }

    public void setInstructor(Instructor instructor) {
        this.instructor = instructor;
    }

    public Textbook getTextbook() {
        return textbook;
    }

    public void setTextbook(Textbook textbook) {
        this.textbook = textbook;
    }

    public Course(String title, Instructor instructor, Textbook textbook) {
        this.title = title;
        this.instructor = instructor;
        this.textbook = textbook;
    }

    public static Object create(BufferedReader br, PrintWriter pw) throws IOException {
        pw.println("Title: "); pw.flush(); String title = br.readLine();
        pw.println("Choose instructor: ");
        int cnt = 0;
        for (Instructor i : Instructor.getInstructors()) {
            pw.println(cnt++ + ". " + i);
        }
        pw.flush();
        Instructor instructor = Instructor.getInstructors().get(Integer.parseInt(br.readLine()));

        pw.println("Choose textbook: ");
        cnt = 0;
        for (Textbook i : Textbook.getTextbooks()) {
            pw.println(cnt++ + ". " + i);
        }
        pw.flush();
        Textbook textbook = Textbook.getTextbooks().get(Integer.parseInt(br.readLine()));

        Course course = new Course(title, instructor, textbook);;
        Logger.log("Admin created " + course);
        return course;
    }
}

