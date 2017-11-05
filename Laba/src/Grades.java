import java.io.*;
import java.util.StringTokenizer;
import java.util.TreeSet;

/**
 * Created by aqali on 11/2/17.
 */
public class Grades {
    static class Student implements Comparable{
        String name, surname;
        int score;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getSurname() {
            return surname;
        }

        public void setSurname(String surname) {
            this.surname = surname;
        }

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public Student(String name, String surname, int score) {
            this.name = name;
            this.surname = surname;
            this.score = score;
        }

        @Override
        public String toString() {
            return "Student{" +
                    "name='" + name + '\'' +
                    ", surname='" + surname + '\'' +
                    ", score=" + score +
                    '}';
        }

        @Override
        public int compareTo(Object o) {
            return -Integer.compare(score, ((Student) o).getScore());
        }
    }

    public static void main(String argv[]) {
        TreeSet<Student> set = new TreeSet<>();
        int sum = 0, cnt = 0;
        try {
            BufferedReader bf = new BufferedReader(new FileReader("grades.txt"));
            for (Object obj : bf.lines().toArray()) {
                String line = (String) obj;
                if (line.length() == 0) continue;
                ++cnt;
                StringTokenizer st = new StringTokenizer(line);
                String name = st.nextToken(), surname = st.nextToken();
                int score = Integer.parseInt(st.nextToken());
                set.add(new Student(name, surname, score));
                sum += score;
            }
            bf.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        int max = set.first().getScore(), min = set.last().getScore();
        PrintWriter pr = null;
        try {
            pr = new PrintWriter(new File("scores.txt"));
            for (Student s : set) {
                String grade = "F";
                if (s.getScore() >= max - 10) grade = "A";
                else if (s.getScore() >= max - 20) grade = "B";
                else if (s.getScore() >= max - 30) grade = "C";
                else if (s.getScore() >= max - 40) grade = "D";
                pr.println(s + grade);
            }
            pr.close();

            pr = new PrintWriter(new FileOutputStream("grades.txt", true));
            pr.println();
            pr.println("Max - " + max);
            pr.println("Min - " + min);
            pr.println("Average - " + (sum / cnt));

            pr.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
}
