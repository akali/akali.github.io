import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.util.Vector;

public class Instructor extends InteractivelyCreatableObject implements Serializable{
    private String firstName, lastName, department, email;
    private static Vector<Instructor> instructors;

    public static Vector<Instructor> getInstructors() {
        return instructors;
    }

    public static void setInstructors(Vector<Instructor> instructors) {
        if (instructors == null) instructors = new Vector<>();

        Instructor.instructors = instructors;
    }

    @Override
    public String toString() {
        return "Instructor{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", department='" + department + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Instructor that = (Instructor) o;

        if (firstName != null ? !firstName.equals(that.firstName) : that.firstName != null) return false;
        if (lastName != null ? !lastName.equals(that.lastName) : that.lastName != null) return false;
        if (department != null ? !department.equals(that.department) : that.department != null) return false;
        return email != null ? email.equals(that.email) : that.email == null;
    }

    @Override
    public int hashCode() {
        int result = firstName != null ? firstName.hashCode() : 0;
        result = 31 * result + (lastName != null ? lastName.hashCode() : 0);
        result = 31 * result + (department != null ? department.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        return result;
    }

    public Instructor(String firstName, String lastName, String department, String email) {

        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.email = email;
    }

    public String getFirstName() {

        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static Object create(BufferedReader br, PrintWriter pw) throws IOException {
        pw.println("First name: "); pw.flush(); String firstName = br.readLine();
        pw.println("Last name: "); pw.flush(); String lastName = br.readLine();
        pw.println("Department: "); pw.flush(); String department = br.readLine();
        pw.println("Email: "); pw.flush(); String email = br.readLine();
        Instructor instructor = new Instructor(firstName, lastName, department, email);
        Logger.log("Admin created " + instructor);
        return instructor;
    }
}

