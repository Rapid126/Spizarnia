# Nazwa kursu
Testowanie i Jakość Oprogramowania

# Autor
Dawid Filipak (nr indeksu: 37680)

# Temat projektu
Aplikacja do zarządzania domową spiżarnią i terminami ważności produktów

# Opis projektu
Aplikacja webowa umożliwiająca ewidencję produktów przechowywanych w domowej spiżarni oraz monitorowanie ich terminów ważności. System automatycznie wylicza liczbę dni pozostałych do upływu daty ważności i przypisuje odpowiedni status:
- **FRESH** – produkt świeży (więcej niż 3 dni do terminu),
- **EXPIRING_SOON** – kończy się termin ważności (0–3 dni),
- **EXPIRED** – produkt przeterminowany.

Główne funkcjonalności aplikacji:
- dodawanie produktów ręcznie lub poprzez wyszukiwanie po **kodzie kreskowym EAN** (integracja z API Open Food Facts),
- edycja, usuwanie oraz zużywanie produktów (zmniejszanie ilości z automatycznym usunięciem po zużyciu ostatniej sztuki),
- podsumowanie stanu spiżarni w formie kart statystyk (wszystkie, świeże, kończące się, przeterminowane),
- wyszukiwanie produktów po nazwie oraz filtrowanie listy po kategorii i statusie ważności.

# Uruchomienie projektu
Wymagania: **Node.js 18+** oraz **npm**.

1. Uruchomienie backendu (REST API):

cd backend
npm install
npm start

2. Uruchomienie frontendu (w drugim oknie terminala):

cd frontend
npm install
npm run dev