import java.io.*;

public class SerializableObject {
    public static void Serialize(Object obj, String filename) {
        try {
            ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filename));
            oos.writeObject(obj);
            oos.close();
        } catch (IOException e) {
//            e.printStackTrace();
        }
    }

    public static Object Deserialize(String filename) {
        Object result = null;
        try {
            ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filename));
            result = ois.readObject();
            ois.close();
        } catch (IOException | ClassNotFoundException e) {
//            e.printStackTrace();
        }

        return result;
    }
}
