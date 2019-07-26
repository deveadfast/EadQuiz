(function(){

  /*
    * The game have many NOTE's and TODO's
    * Some Comments are temporary
    * The function App is the main method's, others are Sub Method's
  */

  // CLASS APPLICATION
  function App() {

    // METHOD START
    var congrats_point = 0;
    this.start = (timeToStart) => {
      const splashScreen = document.querySelector('.splash-screen');
      const progressBar = document.querySelector('.progress__container progress');
      const progressBarExtras = document.querySelector('.game-progress progress');
      const progressText = document.querySelector('.game-progress p');
      const btnSettings = document.querySelectorAll('.__btn-setting');
      const languages = {
        'html5': 'HTML',
        'css3': 'CSS',
        'js': 'JS',
        'algoritmo': 'Algoritmo',
        'php': 'PHP',
        'c#': 'C#'
      }

      const storage = localStorage.gameState;

      // NOTE: Load the game state when the user return to game
      if (storage !== undefined) {
        let gameState = JSON.parse(storage);
        var value = 0, progressValue = 0;
        const congrats = document.querySelector('.img__emoji');
        const stage = document.querySelector('.stage');
        Array.from(gameState).forEach( (element, index) => {
          if (element.answered.length > 0) {
            value += element.answered.length + 6.6;
            progressBarExtras.value = value;
            progressText.innerText = `Progresso do Jogo: ${Math.round(value)}%`;
            if (value > 99) {
              congrats.classList.remove('hide');
              stage.innerHTML = `<p>Parabéns você venceu todos os desafios!</p><button class='__btn-intern' rel='noopener' onclick='location.href="https://educacional.eadfast.com/stages/final_score=300"'>Estagiar</button>`;
            }
          }
          if (element.answered.length !== 10) {
            btnChooseLanguage[gameState[index].indice].innerHTML =
            `${element.language} <br> ${element.answered.length} / 10`;
          } else {
              btnChooseLanguage[gameState[index].indice].innerHTML =
              `${element.language} <br> V`;
              btnChooseLanguage[gameState[index].indice].readonly = true;
              congrats_point += 60;
          }
          btnSettings[gameState[index].indice].innerHTML = `${languages[element.language]}: ${(element.answered.length / 100) * 1000}%`;
        });
      }

      const loadProgressBar = setInterval( () => {
        progressBar.value++;
        progressBar.innerHTML = progressBar.value + "%";
        if (progressBar.value == 100) {
          clearInterval(loadProgressBar);
          splashScreen.classList.add('hide');
          this.menu(true);
        }
      }, timeToStart);

    }

    // METHOD SETTING
    this.setting = (showSettings) => {
      const screenSetting = document.querySelector('.screen-setting');
      if (showSettings){
        screenSetting.classList.remove('hide');
      } else {
        screenSetting.classList.add('hide');
      }
    }

    this.extras = (showExtras) => {
      const game = document.querySelector('.game');
      const screenExtras = document.querySelector('.screen-extras');
      const screenEnd = document.querySelector('.screen-end');
      let timeOfGameState = document.querySelector('.time-of-game-state');
      timeOfGameState.value = false;
      game.classList.add('hide');
      screenEnd.classList.add('hide');
      if (showExtras) {
        screenExtras.classList.remove('hide');
      } else {
        screenExtras.classList.add('hide');
      }
    }

    // METHOD RESET GAME
    this.resetGame = () => {
      const btnChooseLanguage = document.querySelectorAll('.__btn-languege');
      const btnSettings = document.querySelectorAll('.__btn-setting');
      const languages = ['HTML', 'CSS', 'JS', 'Algoritmo', 'PHP', 'C#'];
      localStorage.removeItem('gameState');
      localStorage.removeItem('gameLanguages');
      Array.from(btnSettings).forEach((element, index) => {
        element.innerText = `${languages[index]}: 0%`;
        btnChooseLanguage[index].innerText = `${languages[index]}`;
      });
    }

    // METHOD MENU
    this.menu = (showMenu) => {
      const mainMenu = document.querySelector('.menu');
      this.setting(false);
      if (showMenu) {
        mainMenu.classList.remove('hide');
      } else {
        mainMenu.classList.add('hide');
      }
    }

    const languages = document.querySelector('.languages');
    const container = document.querySelector('main');
    const game = document.querySelector('.game');
    const score = document.querySelector('.scores b');
    const time_left = document.querySelector('.__progress-time-left progress');
    const NumberQuestionAnswered = document.querySelector('.__asking b');
    const screenEnd = document.querySelector('.screen-end');

    // METHOD NEW GAME
    const questions = [];
    const answers = [];
    this.newGame = (language) => {
      const gameState = JSON.parse(localStorage.gameState);
      const score = document.querySelector('.scores b');
      const final_score = document.querySelector('.nota-game h1');
      const questHeader = document.querySelector('.quest');
      const timeOfGameState = document.querySelector('.time-of-game-state');
      questHeader.title = language;
      screenEnd.classList.add('hide');
      var found = false;
      gameState.forEach(element => {
        if (element.language === language && !found) {
          score.innerText = element.score;
          NumberQuestionAnswered.innerText = element.answered.length;
          questionAnswered.push(...element.answered); found = true;
        }
      });
      languages.classList.add('hide');
      container.style.background = "none";
      game.classList.remove('hide');

      const timeToChangeQuestion = setInterval(() => {
        time_left.value--;
        time_left.innerText = time_left.value + "%";
        if (time_left.value == 0) {
          final_score.innerText = score.innerText;
          clearInterval(timeToChangeQuestion);
          app.gameOver();
          app.saveGame();
        }
        if (timeOfGameState.value === 'false') {
          clearInterval(timeToChangeQuestion);
        }

      }, 100); // NOTE: Time of game, ~10 seconds
    }

    // METHOD ADD NEW QUESTION
    this.addNewQuestion = (question, answer) => {
      questions.push(...question);
      answers.push(...answer);
    }

    // METHOD RANDOM NUMBERS
    this.getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // METHOD QUESTIONS SETTLED
    var questionSettled = [];
    this.questionSettled = (questions) => {
      questionSettled.push(questions);
    }

    // METHOD NEXT QUESTION
    const questHeader = document.querySelector('.quest');
    const btnAnswers = document.querySelectorAll('.__btn-answer');
    const img_challenge_container = document.querySelector('.img-challenge-container');
    const img_challenge = document.querySelectorAll('.__img-challenge');
    var questionAnswered = [], answerIndexes = [];

    this.nextQuestion = (language) => {
      if (questionAnswered.length === 10) {
        congrats_point += 60;
        app.saveGame();
        if (congrats_point === 360) {
          const progressBarExtras = document.querySelector('.game-progress progress');
          const progressText = document.querySelector('.game-progress p');
          const congrats = document.querySelector('.img__emoji');
          const stage = document.querySelector('.stage');
          const menu = document.querySelector('.menu');
          menu.classList.add('hide');
          congrats.classList.remove('hide');
          progressText.innerText = `Progresso do Jogo: 100%`;
          progressBarExtras.value = 100;
          stage.innerHTML = `<p>Parabéns você venceu todos os desafios!</p><button class='__btn-intern' rel='noopener' onclick='location.href="https://educacional.eadfast.com/stages/final_score=300"'>Estagiar</button>`;
          app.chooseLanguage(false);
          app.extras(true);
        } else {
          app.chooseLanguage(true);  
        }
        
        return false;
      }

      let min = 0, max = 9;
      const indexes = {
        'html5' : [min, max],
        'css3' : [10, 19],
        'js' : [20, 29],
        'algoritmo' : [30, 39],
        'php' : [40, 49],
        'c#' : [50, 59]
      };

      min = indexes[language][0];
      max = indexes[language][1];

      answerIndexes = [];
      var getQuestionIndex = app.getRandomInt(min, max);
      var answer = answers[getQuestionIndex].split(',');
      while (questionAnswered.includes(getQuestionIndex)) {
        getQuestionIndex = app.getRandomInt(min, max);
        answer = answers[getQuestionIndex].split(',');
      }

      if (!questionAnswered.includes(getQuestionIndex)) {
        time_left.value = "100";
        questHeader.innerText = questions[getQuestionIndex];
        questHeader.name = getQuestionIndex;
        questionAnswered.push(getQuestionIndex);
        NumberQuestionAnswered.innerText++;
        var x = 0, answerLength = answer.length - 1;
        var answerIndex = (Math.random() * answerLength).toFixed(0);
        for (let i = 0, len = btnAnswers.length; i < len; i++) {

          if (answer.length === 4) {

            while (answerIndexes.includes(answerIndex)) {
              answerIndex = (Math.random() * answerLength).toFixed(0);
            }

            img_challenge_container.classList.add('hide');
            btnAnswers[i].classList.remove('hide');
            answerIndex === "0" ? btnAnswers[i].name = 1 : btnAnswers[i].name = 0;

            if (!answerIndexes.includes(answerIndex)) {
              btnAnswers[i].innerText = answer[answerIndex];
              answerIndexes.push(answerIndex);
            }

          } else {
            btnAnswers[i].classList.add('hide');
          }

        }

        for (let i = 0, len = img_challenge.length; i < len; i++) {
          if (answer.length !== 4) {
            while (answerIndexes.includes(answerIndex)) {
              answerIndex = (Math.random() * answerLength).toFixed(0);
            }

            img_challenge_container.classList.remove('hide');
            answerIndex === "0" ? img_challenge[i].name = 1 : img_challenge[i].name = 0;

            if (!answerIndexes.includes(answerIndex)) {
              img_challenge[i].src = `app/assets/img/challenge/${answer[answerIndex]}`;
              answerIndexes.push(answerIndex);
            }

          }

        }

      }


    }

    // METHOD CHOOSE LANGUAGE
    this.chooseLanguage = (showChooseLanguage) => {
      let timeOfGameState = document.querySelector('.time-of-game-state');
      timeOfGameState.value = false;
      if (showChooseLanguage) {
        languages.classList.remove('hide');
      } else {
        languages.classList.add('hide');
      }
      container.style.background = '';
      game.classList.add('hide');
      screenEnd.classList.add('hide');
      NumberQuestionAnswered.innerText = 0;
      questionSettled = [];
      questionAnswered = [];

    }

    // METHOD GAME OVER
    this.gameOver = () => {
      game.classList.add('hide');
      screenEnd.classList.remove('hide');
      container.style.background = "";
    }

    // METHOD SAVE GAME
    this.saveGame = () => {
      const gameState = JSON.parse(localStorage.gameState);
      gameState.forEach ( (element, index) => {
        if (element.language === questHeader.title) {
          element.score = score.innerText;
          element.answered.push(...questionSettled);
          localStorage.setItem("gameState", JSON.stringify(gameState));
          btnChooseLanguage[element.indice].innerHTML = `${element.language} <br> ${element.answered.length} / 10`;
        }
        if (element.answered.length !== 10) {
          btnChooseLanguage[gameState[index].indice].innerHTML =
          `${element.language} <br> ${element.answered.length} / 10`;
        } else {
            btnChooseLanguage[gameState[index].indice].innerHTML =
            `${element.language} <br> V`;
        }
      });
      questionSettled = [];
      questionAnswered = [];
    }


    // METHOD LOAD SAVED GAME
    this.loadSavedGame = (element, index) => {
      const storage = localStorage.gameState;
      const storage2 = localStorage.gameLanguages;
      const btnText = element.name;
      timeOfGameState.value = "";
      if (storage === undefined || storage === null) {

        let language = [{ state: "1", indice: index, language: btnText, score: 0, answered: [] }];
        localStorage.setItem('gameState', JSON.stringify(language));
        localStorage.setItem('gameLanguages', JSON.stringify([btnText]));
        languageChoosed = btnText;
        app.newGame(languageChoosed);
        app.nextQuestion(languageChoosed);

      } else {

        let gameState = JSON.parse(storage);
        let gameLanguages = JSON.parse(storage2);
        if (gameLanguages.includes(btnText)) {
          languageChoosed = btnText;
          app.newGame(languageChoosed);
          app.nextQuestion(languageChoosed);

        } else {

          gameState.push({ state: "1", indice: index, language: btnText, score: 0, answered: [] });
          gameLanguages.push(btnText);
          localStorage.setItem('gameState', JSON.stringify(gameState));
          localStorage.setItem('gameLanguages', JSON.stringify(gameLanguages));
          languageChoosed = btnText;
          app.newGame(languageChoosed);
          app.nextQuestion(languageChoosed);

        }

      }

    }



  }


  // PREVENT WINDOW RELOAD
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 116 || e.keyCode === 82 && e.ctrlKey === true) {
      //e.preventDefault();
    }
  });

  const app = new App();
  const btnStart = document.querySelector('#btn-start');
  const btnSettings = document.querySelector('#btn-setting');
  const btnExtras = document.querySelector('#btn-extras');
  const btnReset = document.querySelector('#btn-reset');
  const btnChooseLanguage = document.querySelectorAll('.__btn-languege');
  const btnBack = document.querySelectorAll('.__btn-back');
  const btnAnswers = document.querySelectorAll('.__btn-answer');
  const timeOfGameState = document.querySelector('.time-of-game-state');
  const img_challenge = document.querySelectorAll('.__img-challenge');
  const btnBackToMenu = document.querySelectorAll('.__btn-back-to-menu');
  const btnNextQuestion = document.querySelector('.__btn-next');
  const score = document.querySelector('.scores b');
  const final_score = document.querySelector('.nota-game h1');
  const btnPlayAgain = document.querySelector('.__btn-play-again');
  var languageChoosed;
  app.start(0); // Time of loading ProgressBar

  // NOTE: Regist a service worker in application, but is'nt working yet
  if (navigator.serviceWorker.controller) {
    console.log('[PWA Builder] active service worker found, no need to register');
  } else {

  //Register the ServiceWorker
    navigator.serviceWorker.register('sw.js', {
      scope: './'
    }).then(function(reg) {
      console.log('Service worker has been registered for scope:'+ reg.scope);
    });
  }

  btnStart.addEventListener('click', () => {
    app.menu(false);
    app.chooseLanguage(true);
  });

  btnSettings.addEventListener('click', () => {
    app.menu(false);
    app.setting(true);
  });

  btnExtras.addEventListener('click', () => {
    app.menu(false);
    app.extras(true);
  });

  btnReset.addEventListener('click', () => {
    app.resetGame();
    app.menu(true);
  });

  // NOTE: When the user choose a language, the game save the state
  Array.from(btnChooseLanguage).forEach( (element, index) => {
    element.addEventListener('click', () => {
      app.loadSavedGame(element, index);
    });
  });

  Array.from(btnBack).forEach(element => {
    element.addEventListener('click', () => {
      app.chooseLanguage(false);
      app.setting(false);
      app.extras(false);
      //app.menu(true);
      app.start(0);
    });
  });

  // NOTE: When users hit or miss the question
  function objectPushed (objectName) {
    return Array.from(objectName).forEach(element => {
      element.addEventListener('click', (event) => {
        if (event.target.name === '1') {
          // TODO: Write a callback if user hit the question
          const questHeader = document.querySelector('.quest');
          score.innerText = parseInt(score.innerText) + 5;
          app.questionSettled(questHeader.name);
          app.nextQuestion(languageChoosed);
        } else {
          // TODO: Write a callback if user miss the question
          timeOfGameState.value = false;
          final_score.innerText = score.innerText;
          app.gameOver();
          app.saveGame();
        }
      });
    });
  }

  objectPushed(btnAnswers);
  objectPushed(img_challenge);

  Array.from(btnBackToMenu).forEach (element => {
    element.addEventListener('click', () => {
      timeOfGameState.value = false;
      app.chooseLanguage(true);
    });
  });

  btnNextQuestion.addEventListener('click', () => {
    app.nextQuestion(languageChoosed);
  });

  btnPlayAgain.addEventListener('click', () => {
    timeOfGameState.value = "";
    app.newGame(languageChoosed);
    app.nextQuestion(languageChoosed);
  });

  window.addEventListener('haschange', function () {
    alert('Hey!');
  });

  // Question, answer => HTML
  app.addNewQuestion(
    [
      "Em que ano foi lançado o HTML5 ?",
      "Qual é a extensão de uma página HTML ?",
      "Das seguintes, quais tags foram instroduzidas no HTML5 ?",
      "O que significa SEO ?",
      "O que significa WWW ?",
      "Quais são as linguagens predominantes na Web ?",
      "Quais são as vantagens de um bom HTML ?",
      "Qual das seguintes representa uma estrutura básica de HTML ?",
      "Qual das Tags é usada para criar uma progress bar ?",
      "Qual desses são elementos em bloco ?"
    ],
    [
      "2009,1992,2005,2008",
      ".html,.xhtml,.html5,.xhtml5",
      "<header><section><article><footer>, <fieldset><div><mark><b>, <legend><h1><head><link>, <script><meta><body><center>",
      "search engine optimization,Search enity option,struct enter optimized,Signal engine opened",
      "World wide web, web wide wick, wick wide web, web webber webest",
      "HTML CSS JS, HTML e PHP, C# e VB, PHP e JAVA",
      "Semântica e acessibilidade, HTML não é importante, Código limpo, Performance",
      "html-basic-structure.png,js-code.png",
      "progress-tag.png,progressbar-tag.png",
      "block-elements.png,inline-elements.png"
    ]);

    // CSS questions
    app.addNewQuestion(
      [
        "Qual dos seguintes é uma propriedade em CSS ?",
        "Qual dos seguintes selectores tem prioridade ?",
        "Em espcificidade de CSS qual dos seguintes tem mais prioridade ?",
        "Dos seguintes selectores qual é o mais performático ?",
        "O que é OOCSS ?",
        "O que significa BEM ?",
        "Qual dessas é a sintaxe do CSS ?",
        "Qual das seguintes utiliza a metodologia BEM ?",
        "Qual dessas é a forma correcta de se criar uma váriavel em CSS ?",
        "Qual dos seguinte é o resultado da combinação das propriedades box-shadow e border-radius ?"
      ],
      [
        "display: flex,property: none,<video></video>,style.color='red'",
        "a#eadfast-link, a {}, a.link {}, div a",
        "Estilos inline,IDs,Classes,Elementos e pseudoelementos",
        "a.my-link{}, div a{}, #content *{}, #social a{}",
        "CSS orientado a objectos, Cascading style sheets, Organic Cascading style sheets, Oriented Organic CSS",
        "Block Element Modifier, Bad element model, Back Element model, Behaviour element model",
        "css-sintax.png,jquery-example.png",
        "bem-example.png,smacss-example.png",
        "css-variable.png,stylus-variable.png",
        "circle-rounded.png,square.png"
      ]);

      // JS questions
      app.addNewQuestion([
        "Qual desses recursos foram adicionados no ES6 ?",
        "Qual é a funcionalidade do método querySelector ?",
        "Qual é o resultado da comparação de 0 === '0' ",
        "O que significa JSON ?",
        "Qual dos seguintes métodos adiciona um novo elemento a um Array ?",
        "Qual é o significado de DOM ?",
        "JavaScript é uma linguagem...",
        "Qual dessas é a forma correcta de declarar uma váriavel em JS ?",
        "Qual das seguintes é uma estrutura de repetição ?",
        "Das seguintes situações qual delas resultará em bug ?"
      ],
      [
        "let e const,var e map,filter e reduce,array e forEach",
        "Seleccionar elementos do DOM,Nenhuma,Fazer consultas,Iterar elementos",
        "falso,verdadeiro,NaN,null",
        "javascript object notation,java oriented notation,Jx object notation,jquery system object note",
        "push,pop,shift,filter",
        "Document Object Model,Document orient method,Dynamic object model,Nenhuma das opções",
        "Client Side e Server Side,client side,server side,database",
        "js-variable-declaration.png,c-variable-declaration.png",
        "for-loop.png,foreach-method.png",
        "bug-situation.png,just-js-code.png"
      ]);

      // Algorithms questions
      app.addNewQuestion([
        "Algoritmo é...",
        "Definimos variável como...",
        "Qual das opções representam os tipos de dados de uma variável ?",
        "Qual das opções é a forma correcta de declarar uma variável ?",
        "Expressões lógicas são...",
        "Qual das seguintes é uma estrutura de decisão ?",
        "Qual dessas imagens representa a estrutura de um Algoritmo ?",
        "Qual das imagens representa declarações de variáveis ?",
        "Qual das seguintes imagens representa expressões lógicas ?",
        "Em Linguagem C qual é a função usada para imprimir dados ?"
      ],
      [
        "Sequência finita de passos,uma váriavel,linguagem marcação,teste de condição",
        "Nomes associados a dados em um programa de computador,Linguagens de programação,valores armazenados no monitor,estruturas de repetição",
        "Int; string; boolean; char, C; C++; C#; Java, HTML; CSS; JS; PHP, Num; var; data; name",
        "String nome;,constante nome;,end string;,main variable",
        "expressões que retornam verdadeiro ou falso,valores fixos,indispensáveis num programa,variáveis com valores complexos",
        "If,while,for,include",
        "algorithm.png,css-code.png",
        "variable-declarations.png,just-code.png",
        "logical-expression.png,matriz-table.png",
        "printf,scanf,include,main"
      ]);


      // PHP questions
      app.addNewQuestion([
        "Qual dos seguintes é um delimitador de código PHP ?",
        "Como declara-se uma variável em Php ?",
        "Qual das funções usa-se para conexões com Banco de dados ?",
        "Qual é a diferença entre a instrução include e require ?",
        "Qual é utilidade da função array_pop ?",
        "PHP é uma linguagem...",
        "Qual das imagens apresenta uma conexão válida a um banco de dados ?",
        "Qual dos seguintes códigos previne o uso de SQL injection ?",
        " Qual das imagens apresenta o uso correcto da função while ?",
        "Qual das seguintes imagens apresenta uma classe em php ?"
      ],
      [
        "<? ?>, <% %>, <%php %>, <@ @>",
        "$var = 2;, var idade = 33;, int n1 = 1;, let idade = 12;",
        "pdo,db_connect,ajax,odb_connection",
        "Retorno de erro,nenhuma,Têm funções diferentes,Nenhuma das opções",
        "Remove o último elemento do array,Adiciona um elemento no array,imprimi o tamanho do array,cria um novo array",
        "Orientada a objectos,Client side,Orientada a prototipos,fortemente tipada",
        "pdo-connection.png,mysql-connection.png",
        "pdo-query.png,mysql-query.png",
        "while-correct-use.png,while-incorrect-use.png",
        "php-class.png,class.png"
      ]);


      // C# questions
      app.addNewQuestion([
        "Qual é a diferença entre C# e .Net ?",
        "Em uma aplicação ASP.Net em que arquivo encontra-se a tabela de roteamento ?",
        "O Que signifca IIS ?",
        "Em C# windows form, qual é o objectivo da classe System.Windows.Forms.MessageBox ?",
        "Em C# windows form, qual dos seguintes é um método estático ?",
        "O que signifca ADO ?",
        "O que significa ORM ?",
        "Window Azure é...",
        "Qual dos seguintes é uma classe em C# ?",
        "C# é uma linguagem de programação..."
      ],
      [
        "Linguagem e plataforma,Nenhuma,linguagens diferentes,procedimental e orientada objectos",
        "webApiConfig.cs,.htaccess,api.js,routerTable.cs",
        "Internet information service,Information intra service,intra service internet,inteligence internet service",
        "Gerar janelas informativas,criar uma classe,conectar com o banco de dados,tratamento de erros",
        "show(),messagebox,InitializeComponent(),staticMethod()",
        "ActiveX Data Object,Active document object,archive document order,asp.net document oriented",
        "Object relation model,oriented resolution model,order resource model,old resource model",
        "Plataforma de computação em nuvem,uma linguagem de programação,sistema operativo,uma ide",
        "cs-class.png,js-class.png",
        "multiplataforma,orientada a prototipos,orientada a eventos,orientada a comportamentos"
      ]);



      //alert(window.innerHeight);
  // Time to ask the questions
  // ["HTML", "CSS", "JS", "C#", "PHP", "Algorithms"]
  // Every languages will get 10 questions
  // When the questions done, pass to next challenge
  // In the options you could reset the game
  // When you won some category without loose u'll be suggested to share your conquest
  // BABEL ES6 => ES5

})();
