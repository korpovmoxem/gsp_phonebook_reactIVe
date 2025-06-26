
const PROD_API = "http://172.16.153.53:8001";
const TEST_API = "http://172.16.153.53:8001";
const MOCK_API = "http://localhost:5000";

/**
 * Определяет, какой API использовать в зависимости от окружения и доступности серверов.
 */
async function getAvailableApiBase(): Promise<string> {
  if (process.env.NODE_ENV === "production") {
    return PROD_API;
  }

  try {
    const ping = await fetch(`${TEST_API}/ping`, { method: "GET" });
    if (ping.ok) {
      console.info("Используется тестовый API");
      return TEST_API;
    }
  } catch (e) {
    console.warn("Тестовый API недоступен, переключение на мок-сервер");
  }

  return MOCK_API;
}

export default getAvailableApiBase;
