import java.io.PrintWriter;
import java.util.Date;

public class Logger {
    public static void log(String message) {
        MyFileReader.write("admin.txt", true, new MyFileReader.CallbackWrite() {
            @Override
            public void success(PrintWriter br) {
                br.println(new Date().toString() + " " + message);
            }
        });
    }
}
