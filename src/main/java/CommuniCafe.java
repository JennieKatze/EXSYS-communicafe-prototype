import static spark.Spark.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.json.JSONArray;
import org.json.JSONObject;
//import com.google.cloud.translate.*;
//____________new_______________
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.io.InputStreamReader;
import java.io.BufferedReader;



public class CommuniCafe {
    public static void main(String[] args) {
        port(8080);

        JSONArray translationList = new JSONArray();
        String directoryPath;
        //Translate translate = TranslateOptions.getDefaultInstance().getService();

        File directory = new File("./src/main/resources");
        try {
            directoryPath = directory.getCanonicalPath();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        staticFiles.externalLocation( directoryPath + "/client/public/");

        Path filePath = Path.of(directoryPath + "/client/translation.html");
        try {
            String html = Files.readString(filePath);
            get("/", (req, res) -> html);
            Path settingsPath = Path.of(directoryPath + "/client/settings.html");
            get("/settings", (req, res) -> Files.readString(settingsPath));
            Path staffPath = Path.of(directoryPath + "/client/staff.html");
            get("/staff", (req, res) -> Files.readString(staffPath));
            Path personPath = Path.of(directoryPath + "/client/person.html");
            get("/person", (req, res) -> Files.readString(personPath));
            Path learningPath = Path.of(directoryPath + "/client/learningD.html");
            get("/learningD", (req, res) -> Files.readString(learningPath));
        } catch (Exception e) {
            System.out.println(e);
        }

        get("/translation", (req, res) -> translationList);

        post("/translation", (req, res) -> {
            JSONObject requestData = new JSONObject(req.body());
            String inputText = requestData.getString("translation");
            String sourceLang = requestData.getString("sourceLang");
            String targetLang = requestData.getString("targetLang");

            String translatedText = translation(inputText, sourceLang, targetLang);

            JSONObject translationJson = new JSONObject();
            translationJson.put("translation", translatedText);
            translationJson.put("id", 0);

            translationList.remove(0);
            translationList.put(translationJson);

            return translationJson;
        });
    }

    public static String translation(String text, String sourceLang, String targetLang) throws Exception {
        String urlStr = "https://translate.googleapis.com/translate_a/single?client=gtx" +
                        "&sl=" + sourceLang +
                        "&tl=" + targetLang +
                        "&dt=t&format=text&q=" + URLEncoder.encode(text, "UTF-8");

        HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
        conn.setRequestProperty("User-Agent", "Mozilla/5.0");

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        StringBuilder response = new StringBuilder();
        String inputLine;
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        String raw = response.toString();

        JSONArray outer = new JSONArray(raw);
        JSONArray inner = outer.getJSONArray(0);

        StringBuilder finalText = new StringBuilder();
        for (int i = 0; i < inner.length(); i++) {
            JSONArray part = inner.getJSONArray(i);
            finalText.append(part.getString(0));
        }

        return finalText.toString();
    }


}
