/**
 * OPTYMALIZACJA FUNKCJI Google Apps Script:
 * Integruje arkusz Google Apps Script z Listmonk API używając Double Opt-In.
 */

const LISTMONK_API_URL = "https://twoj-listmonk.com/api/subscribers";
const LISTMONK_API_USER = "TWOJ_LISTMONK_WEBHOOK_USER"; 
const LISTMONK_API_PASS = "TWOJ_LISTMONK_WEBHOOK_PASS"; // Hasło API lub wygenerowany Token Autoryzacji
const LISTMONK_LIST_ID = [1]; // ID docelowej listy (jako cyfra wg dokumentacji) 

/**
 * Funkcja wywoływana, gdy rekord przejdzie w status "TAK" (Aktywny).
 * Wysłanie do systemu Listmonk żądania POST z danymi subskrybenta.
 * 
 * @param {string} email Email użytkownika z arkusza
 * @param {string} name Imię użytkownika (bądź opcjonalne)
 */
function dodajDoListmonk(email, name) {
  // Zabezpieczenie minimalnego wymogu
  if (!email || email.trim() === '') {
    console.error("BRAK EMAILA - Przerwano syny Listmonk");
    return { success: false, error: 'Brak adresu e-mail' };
  }

  // Budowa nagłówka basic auth lub Bearer (Zależnie od tego czy używamy admin / pass czy Tokenu)
  // Jeśli Listmonk wymaga Basic Auth: 'Basic ' + Utilities.base64Encode(LISTMONK_API_USER + ":" + LISTMONK_API_PASS);
  // Jeśli używasz API Key pluginów lub reverse proxy "Bearer ...":
  const authHeader = 'Basic ' + Utilities.base64Encode(LISTMONK_API_USER + ":" + LISTMONK_API_PASS);
  
  const payload = {
    email: email.trim(),
    name: name ? name.trim() : email.split('@')[0],
    status: "enabled", // W Listmonk włączony, ponieważ Double Opt-in przeszedł przez G.A.S
    lists: LISTMONK_LIST_ID, 
    preconfirm_subscriptions: true // Omijamy opt-in samego Listmonk, jako że załatwił to już Apps Script
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      "Authorization": authHeader
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // Bardzo ważne, by script nie sypał błędami "Exception: Request failed", lecz byśmy odnotowali error 
  };

  try {
    const response = UrlFetchApp.fetch(LISTMONK_API_URL, options);
    const statusCode = response.getResponseCode();
    const resultText = response.getContentText();

    if (statusCode === 200 || statusCode === 201) {
      console.log(`SUKCES: Subskrybent ${email} wprowadzony do Listmonk.`);
      return { success: true, code: statusCode, response: resultText };
    } else {
      console.error(`BŁĄD LISTMONK (${statusCode}): ${resultText}`);
      // Obsługa ewentualnego nadpisywania (Listmonk zwraca inny code na duplikaty), zależnie od konfiguracji
      if(resultText.includes("already exists") || statusCode === 409) {
          return { success: true, remark: 'already_exists' };
      }
      return { success: false, code: statusCode, error: resultText };
    }
  } catch (error) {
    console.error(`KRYTYCZNY BŁĄD SIECI G.A.S -> Listmonk: ${error.toString()}`);
    return { success: false, error: error.toString() };
  }
}

/**
 * --------------------------------------------------------------------------------------
 * INSTRUKCJA WDRAZANIA DO OBECNEGO KODU - KROK (B) "WYzwalacz Akceptacji"
 * --------------------------------------------------------------------------------------
 * 
 * Gdy pracownik albo trigger kliknie "TAK" w kolumnie "Aktywowano",
 * w funkcji onChange / onEdit lub webHook(e) musisz zawołać powyzszą metodę:
 * 
 * function potwierdzZapis(e) {
 *   // ... [Twój kod zmieniający cell na "TAK"] ...
 *   
 *   // Po zmianie statusu wywołaj:
 *   const listmonkResponse = dodajDoListmonk(emailZKomorki, imieZKomorki);
 *   
 *   if(listmonkResponse.success) {
 *     // Oznacz w arkuszu kolumnę (np "Dodano: TAK")
 *     sheet.getRange(row, colListmonkFlag).setValue("Zsynchronizowano");
 *   } else {
 *     // Oznacz błąd żeby administrator widział
 *     sheet.getRange(row, colListmonkFlag).setValue("BŁĄD: " + listmonkResponse.error);
 *   }
 * }
 */
