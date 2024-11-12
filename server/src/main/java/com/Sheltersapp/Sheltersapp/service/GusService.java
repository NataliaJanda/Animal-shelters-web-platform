package com.Sheltersapp.Sheltersapp.service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class GusService {

    private final String endpointUrl = "https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc";
    private final String userKey = "abcde12345abcde12345";

    private String sessionId;

    public String login() throws Exception {
        if (sessionId == null || !checkSessionStatus(sessionId)) {
            String loginRequestPayload = createLoginRequest();
            String response = sendSoapRequest(loginRequestPayload, "http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj");
            sessionId = extractSessionId(response);
        }
        return sessionId;
    }

    private String createLoginRequest() {
        return "<soapenv:Envelope xmlns:soapenv=\"http://www.w3.org/2003/05/soap-envelope\" " +
                "xmlns:ns=\"http://CIS/BIR/PUBL/2014/07\" xmlns:wsa=\"http://www.w3.org/2005/08/addressing\">" +
                "   <soapenv:Header>" +
                "      <wsa:To>https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc</wsa:To>" +
                "      <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj</wsa:Action>" +
                "      <wsa:MessageID>urn:uuid:" + java.util.UUID.randomUUID().toString() + "</wsa:MessageID>" +
                "      <wsa:ReplyTo>" +
                "         <wsa:Address>http://www.w3.org/2005/08/addressing/anonymous</wsa:Address>" +
                "      </wsa:ReplyTo>" +
                "   </soapenv:Header>" +
                "   <soapenv:Body>" +
                "      <ns:Zaloguj>" +
                "         <ns:pKluczUzytkownika>" + userKey + "</ns:pKluczUzytkownika>" +
                "      </ns:Zaloguj>" +
                "   </soapenv:Body>" +
                "</soapenv:Envelope>";
    }

    private String extractSessionId(String response) {
        return response.substring(response.indexOf("<ZalogujResult>") + 15, response.indexOf("</ZalogujResult>"));
    }

    public boolean verifyRegonExists(String regon) throws Exception {
        login();

        String searchRequestPayload = createRegonSearchRequest(regon);
        String response = sendSoapRequest(searchRequestPayload, "http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty");

        String result = extractDaneSzukajPodmiotyResult(response);

        if (result.contains("<ErrorCode>")) {
            System.out.println("Odpowiedź z serwera: \n" + response);
            throw new IllegalArgumentException("Nie znaleziono schroniska o podanym numerze REGON w bazie GUS.");
        }

        System.out.println("Znaleziono dane: \n" + result);
        return true;
    }

    private String extractDaneSzukajPodmiotyResult(String response) {
        String startTag = "<DaneSzukajPodmiotyResult>";
        String endTag = "</DaneSzukajPodmiotyResult>";
        int startIndex = response.indexOf(startTag) + startTag.length();
        int endIndex = response.indexOf(endTag);

        if (startIndex > 0 && endIndex > startIndex) {
            String encodedXml = response.substring(startIndex, endIndex);
            return encodedXml.replace("&lt;", "<").replace("&gt;", ">");
        }
        return "";
    }

    private boolean checkSessionStatus(String sessionId) throws Exception {
        String statusRequestPayload = "<soapenv:Envelope xmlns:soapenv=\"http://www.w3.org/2003/05/soap-envelope\" " +
                "xmlns:ns=\"http://CIS/BIR/PUBL/2014/07\" xmlns:wsa=\"http://www.w3.org/2005/08/addressing\">" +
                "   <soapenv:Header>" +
                "      <wsa:To>https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc</wsa:To>" +
                "      <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/GetValue</wsa:Action>" +
                "   </soapenv:Header>" +
                "   <soapenv:Body>" +
                "      <ns:GetValue>" +
                "         <ns:pNazwaParametru>StatusSesji</ns:pNazwaParametru>" +
                "      </ns:GetValue>" +
                "   </soapenv:Body>" +
                "</soapenv:Envelope>";

        return sendSoapRequest(statusRequestPayload, "http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/GetValue")
                .contains("<GetValueResult>1</GetValueResult>");
    }

    private String createRegonSearchRequest(String regon) {
        return "<soapenv:Envelope xmlns:soapenv=\"http://www.w3.org/2003/05/soap-envelope\" " +
                "xmlns:ns=\"http://CIS/BIR/PUBL/2014/07\" xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" " +
                "xmlns:dat=\"http://CIS/BIR/PUBL/2014/07/DataContract\">" +
                "   <soapenv:Header>" +
                "      <wsa:To>https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc</wsa:To>" +
                "      <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty</wsa:Action>" +
                "   </soapenv:Header>" +
                "   <soapenv:Body>" +
                "      <ns:DaneSzukajPodmioty>" +
                "         <ns:pParametryWyszukiwania>" +
                "            <dat:Regon>" + regon + "</dat:Regon>" +
                "         </ns:pParametryWyszukiwania>" +
                "      </ns:DaneSzukajPodmioty>" +
                "   </soapenv:Body>" +
                "</soapenv:Envelope>";
    }

    private String sendSoapRequest(String xmlPayload, String action) throws Exception {
        URL url = new URL(endpointUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/soap+xml; charset=utf-8");
        connection.setRequestProperty("SOAPAction", action);
        connection.setRequestProperty("Host", "wyszukiwarkaregontest.stat.gov.pl");

        if (!action.contains("Zaloguj")) {
            connection.setRequestProperty("sid", sessionId);
        }

        connection.setDoOutput(true);

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = xmlPayload.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        int responseCode = connection.getResponseCode();
        InputStream stream = (responseCode == HttpURLConnection.HTTP_OK) ?
                connection.getInputStream() : connection.getErrorStream();
        StringBuilder response = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(stream, "utf-8"))) {
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
        }

        if (responseCode != HttpURLConnection.HTTP_OK) {
            throw new IOException("Server returned HTTP response code: " + responseCode + " with message: " + response.toString());
        }

        return response.toString();
    }

}
