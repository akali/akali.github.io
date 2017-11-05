import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.util.Vector;

/**
 * Created by aqali on 11/2/17.
 */
public class Textbook extends InteractivelyCreatableObject implements Serializable {
    private String title, isbn, author;
    private static Vector<Textbook> textbooks;

    public static Vector<Textbook> getTextbooks() {
        return textbooks;
    }

    public static void setTextbooks(Vector<Textbook> textbooks) {
        if (textbooks == null) textbooks = new Vector<>();
        Textbook.textbooks = textbooks;
    }

    @Override
    public String toString() {
        return "Textbook{" +
                "title='" + title + '\'' +
                ", isbn='" + isbn + '\'' +
                ", author='" + author + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Textbook textbook = (Textbook) o;

        if (title != null ? !title.equals(textbook.title) : textbook.title != null) return false;
        if (isbn != null ? !isbn.equals(textbook.isbn) : textbook.isbn != null) return false;
        return author != null ? author.equals(textbook.author) : textbook.author == null;
    }

    @Override
    public int hashCode() {
        int result = title != null ? title.hashCode() : 0;
        result = 31 * result + (isbn != null ? isbn.hashCode() : 0);
        result = 31 * result + (author != null ? author.hashCode() : 0);
        return result;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Textbook(String title, String isbn, String author) {

        this.title = title;
        this.isbn = isbn;
        this.author = author;
    }

    public static Object create(BufferedReader br, PrintWriter pw) throws IOException {
        pw.println("Title: "); pw.flush(); String title = br.readLine();
        pw.println("ISBN: "); pw.flush(); String isbn = br.readLine();
        pw.println("Author(s): "); pw.flush(); String author = br.readLine();
        Textbook textbook = new Textbook(title, isbn, author);
        Logger.log("Admin created " + textbook);
        return textbook;
    }

}

