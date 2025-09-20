var cacheName = 'the-ghosts-of-the-wesenberg-quarter';
var criticalCacheName = 'the-ghosts-critical-assets'; // Новый кэш для важных файлов

// Список URL ваших видеофайлов для предзагрузки
var criticalAssets = [
  // Замените на реальные пути к вашим видеофайлам относительно корня вашего сайта
  './game/images/anim/12.mp4',
  './game/images/anim/animcon1.mp4',
  './game/images/anim/animcon3.mp4'
  // Добавьте другие критически важные ресурсы
];

/* Start the service worker and cache all of the app's content or use the existing one */
self.addEventListener('install', function (e) {
    console.log('Service worker installed.');
    // Открываем критический кэш и добавляем в него важные файлы
    e.waitUntil(
        caches.open(criticalCacheName)
            .then(function(cache) {
                console.log('Предзагрузка критических ресурсов...');
                return cache.addAll(criticalAssets);
            })
            .catch(function(error) {
                console.error('Не удалось предзагрузить критические ресурсы:', error);
                // Не блокируем установку SW из-за ошибки предзагрузки
            })
    );
    // self.skipWaiting(); // Можно оставить, если хотите немедленно активировать новый SW
});

self.addEventListener('activate', function (e) {
    console.log('Service worker activated.');
    // Здесь можно удалить старые кэши, если имена изменились
    // e.waitUntil(clients.claim()); // clients.claim() нужно вызывать после self.clients.claim()
    return self.clients.claim(); // Даем SW контроль над страницей немедленно
});


/**
 * True if the service worker should add the request to a persistent cache.
 */
let addToCache = false;

/**
 * Serves the cached version of the request if it exists, otherwise fetches the
 * request from the network and caches it. Fetch is used in the default mode,
 * which will use the cache for most network requests, freshening the cache
 * as required.
 */
async function fetchAndCache(request) {
    // Проверяем сначала критический кэш
    const criticalCache = await caches.open(criticalCacheName);
    let cachedResponse = await criticalCache.match(request);

    // Если не нашли в критическом кэше, проверяем основной
    if (!cachedResponse) {
        const cache = await caches.open(cacheName);
        cachedResponse = await cache.match(request);
    }


    try {

        if (request.url.endsWith("?cached")) {
            request = new Request(request.url.replace("?cached", "?uncached"), request);
            let rv = await (await caches.open(criticalCacheName)).match(request) || await (await caches.open(cacheName)).match(request);

            if (rv == null) {
                rv = new Response("Not found in cache.", { status: 404, statusText: "Not found in cache." });
            }

            return rv;
        }

        // Логика If-Modified-Since / ETag обычно не нужна при cache-first для статики
        // но оставим для совместимости, если она важна для динамических запросов
        if (cachedResponse) {
            if (cachedResponse.headers.get('Last-Modified')) {
                request.headers.set('If-Modified-Since', cachedResponse.headers.get('Last-Modified'));
            }
            if (cachedResponse.headers.get('ETag')) {
                request.headers.set('If-None-Match', cachedResponse.headers.get('ETag'));
            }
        }

        const response = await fetch(request);

        if (cachedResponse && response.status == 304) {
            return cachedResponse;
        }

        // Кэшируем в основном кэше, если addToCache true и файл не в критическом кэше
        if (addToCache && response.status == 200) {
             // Проверяем, не находится ли файл уже в критическом кэше
            const isCritical = await criticalCache.match(request);
            if(!isCritical) {
                 const cache = await caches.open(cacheName);
                 await cache.put(request, response.clone());
                 console.log('Кэширован в основном кэше:', request.url);
            } else {
                 console.log('Уже в критическом кэше, не кэшируем в основном:', request.url);
            }
        }

        return response;

    } catch (e) {

        if (cachedResponse) {
            console.log('Served from cache: ' + request.url);
            return cachedResponse;
        }

        console.log('Not found in cache: ' + request.url);
        // В случае ошибки сети и отсутствия в кэше, можно вернуть fallback ответ
        // Например, пустой ответ или страницу ошибки
        // throw e;
         return new Response('Network error and not in cache', { status: 503, statusText: 'Offline' });
    }
}


/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
    e.respondWith(fetchAndCache(e.request));
});

self.addEventListener('message', function (e) {
    if (e.data && e.data.command === "clearCache") { // Проверяем структуру сообщения
        // Удаляем только основной кэш, оставляя критический
        e.waitUntil(
            caches.delete(cacheName)
                .then(function(deleted) {
                    if (deleted) {
                        console.log("Основной кэш (" + cacheName + ") очищен.");
                    } else {
                         console.log("Основной кэш (" + cacheName + ") не найден для удаления.");
                    }
                    addToCache = false;
                })
                .catch(function(error) {
                     console.error("Ошибка при очистке основного кэша:", error);
                     addToCache = false; // На всякий случай сбрасываем флаг
                })
        );
    } else if (e.data && e.data.command === "loadCache") { // Проверяем структуру сообщения
        addToCache = true;
        console.log("Флаг addToCache установлен в true.");
    } else if (e.data && e.data.command === "cacheSpecificAssets") {
        // Пример команды для кэширования произвольных ресурсов по запросу
         const urlsToCache = e.data.urls || [];
         if(urlsToCache.length > 0) {
              e.waitUntil(
                  caches.open(cacheName)
                      .then(function(cache) {
                           console.log('Кэширование дополнительных ресурсов:', urlsToCache);
                           return cache.addAll(urlsToCache); // Используем addAll для кэширования списка
                      })
                      .catch(function(error) {
                          console.error('Не удалось кэшировать дополнительные ресурсы:', error);
                      })
              );
         }
    }
    // Отправляем ответ обратно в основной поток (опционально)
     e.ports[0]?.postMessage({ status: 'Message received', command: e.data?.command });
});

// Опционально: Обработка ошибок установки
self.addEventListener('error', function(e) {
  console.error('Service Worker error:', e.error);
});