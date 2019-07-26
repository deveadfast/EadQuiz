(function() {

  //This is the service worker with the Cache-first network
  var CACHE = 'precache';
  var precacheFiles = [
        /* Add an array of files to precache for your app */
        '/EadQuiz',
        '/EadQuiz/',
        'index.html',
        'app/css/main.css',
        'app/js/main.min.js',
        'app/assets/img/logo.png',
        'app/assets/fonts/Arsenal/Arsenal-regular.ttf',
        'app/assets/img/emoji.gif'
  ];

  var img_files = [
    'app/assets/img/challenge/cs-class.png',
    'app/assets/img/challenge/algorithm.png',
    'app/assets/img/challenge/html-basic-structure.png',
    'app/assets/img/challenge/bem-example.png',
    'app/assets/img/challenge/block-elements.png',
    'app/assets/img/challenge/bug-situation.png',
    'app/assets/img/challenge/circle-rounded.png',
    'app/assets/img/challenge/class.png',
    'app/assets/img/challenge/css-sintax.png',
    'app/assets/img/challenge/css-variable.png',
    'app/assets/img/challenge/c-variable-declaration.png',
    'app/assets/img/challenge/foreach-method.png',
    'app/assets/img/challenge/css-code.png',
    'app/assets/img/challenge/for-loop.png',
    'app/assets/img/challenge/html-basic-structure.png',
    'app/assets/img/challenge/inline-elements.png',
    'app/assets/img/challenge/jquery-example.png',
    'app/assets/img/challenge/js-class.png',
    'app/assets/img/challenge/js-code.png',
    'app/assets/img/challenge/js-variable-declaration.png',
    'app/assets/img/challenge/just-code.png',
    'app/assets/img/challenge/just-js-code.png',
    'app/assets/img/challenge/logical-expression.png',
    'app/assets/img/challenge/matriz-table.png',
    'app/assets/img/challenge/mysql-connection.png',
    'app/assets/img/challenge/mysql-query.png',
    'app/assets/img/challenge/pdo-connection.png',
    'app/assets/img/challenge/pdo-query.png',
    'app/assets/img/challenge/php-class.png',
    'app/assets/img/challenge/progressbar-tag.png',
    'app/assets/img/challenge/progress-tag.png',
    'app/assets/img/challenge/smacss-example.png',
    'app/assets/img/challenge/square.png',
    'app/assets/img/challenge/stylus-variable.png',
    'app/assets/img/challenge/variable-declarations.png',
    'app/assets/img/challenge/while-correct-use.png',
    'app/assets/img/challenge/while-incorrect-use.png'
  ];

  precacheFiles.push(...img_files);

  //Install stage sets up the cache-array to configure pre-cache content
  self.addEventListener('install', function(evt) {
    console.log('[PWA Builder] The service worker is being installed.');
    evt.waitUntil(precache().then(function() {
      console.log('[PWA Builder] Skip waiting on install');
      return self.skipWaiting();
    }));
  });


  //allow sw to control of current page
  self.addEventListener('activate', function(event) {
    console.log('[PWA Builder] Claiming clients for current page');
    return self.clients.claim();
  });

  self.addEventListener('fetch', function(evt) {
    console.log('[PWA Builder] The service worker is serving the asset.'+ evt.request.url);
    evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
    evt.waitUntil(update(evt.request));
  });


  function precache() {
    return caches.open(CACHE).then(function (cache) {
      return cache.addAll(precacheFiles);
    });
  }

  function fromCache(request) {
    //we pull files from the cache first thing so we can show them fast
    return caches.open(CACHE).then(function (cache) {
      return cache.match(request).then(function (matching) {
        return matching || Promise.reject('no-match');
      });
    });
  }

  function update(request) {
    //this is where we call the server to get the newest version of the
    //file to use the next time we show view
    return caches.open(CACHE).then(function (cache) {
      return fetch(request).then(function (response) {
        return cache.put(request, response);
      });
    });
  }

  function fromServer(request){
    //this is the fallback if it is not in the cache to go to the server and get it
    return fetch(request).then(function(response){ return response});
  }


}());
