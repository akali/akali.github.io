import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.PrintWriter;

/**
 * Created by aqali on 11/2/17.
 */
public class MyFileReader {

    interface CallbackRead {
        void success(BufferedReader br);
    }
    interface CallbackWrite {
        void success(PrintWriter br);
    }
    public static void read(String filename, CallbackRead callback) {
        try {
            BufferedReader br = new BufferedReader(new FileReader(filename));
            callback.success(br);
            br.close();
        } catch (Exception ignored) {

        }
    }
    public static void write(String filename, boolean toAppend, CallbackWrite callback) {
        try {
            PrintWriter pr = new PrintWriter(new FileOutputStream(filename, toAppend));
            callback.success(pr);
            pr.close();
        } catch (Exception ignored) {

        }
    }
}
