;'use strict';

var untApp = angular.module('untApp', [
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngSanitize',
    'ui.router',
    'md.data.table',
    'jkAngularRatingStars'
    ])
    .directive('dynamic', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    })
    .directive('focusMe',
    ['$timeout',
        function ($timeout) {
            return {
                link: {
                    pre: function preLink(scope, element, attr) {
                        // ...
                    },
                    post: function postLink(scope, element, attr) {
                        $timeout(function () {
                            element[0].focus();
                        }, 1000);
                    }
                }
            }
        }]);

untApp.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    // Extend the red theme with a few different colors
    var testcenterColorMap = $mdThemingProvider.extendPalette('cyan', {
        '500': '127989',
        'contrastDefaultColor': 'light'
    });
    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('testcenterPalette', testcenterColorMap);
    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
        .primaryPalette('testcenterPalette');

    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('login', {
            url: "/login",
            template: "<login></login>"
        })
        .state('checkin', {
            url: "/checkin/:email/:password",
            template: "<checkin></checkin>"
        })
        .state('test', {
            url: "/test",
            template: "<test></test>"
        })
        .state('subject', {
            url: "/subject",
            template: "<subject></subject>"
        })
        .state('card', {
            url: "/card",
            template: "<card></card>"
        });
});

;'use strict';
angular.module('untApp')
    .factory('$localStorage', function ($window) {
        return {
            setData: function (key, val) {
                $window.localStorage && $window.localStorage.setItem(key, angular.toJson(val));
                return this;
            },
            getData: function (key) {
                return $window.localStorage && angular.fromJson($window.localStorage.getItem(key));
            },
            removeData: function (key) {
                $window.localStorage && $window.localStorage.removeItem(key);
            }
        };
    })
    .factory('$sessionStorage', function ($window) {
        return {
            setData: function (key, val) {
                $window.sessionStorage && $window.sessionStorage.setItem(key, angular.toJson(val));
                return this;
            },
            getData: function (key) {
                return $window.sessionStorage && angular.fromJson($window.sessionStorage.getItem(key));
            },
            removeData: function (key) {
                $window.sessionStorage && $window.sessionStorage.removeItem(key);
            }
        };
    })
    .factory('$appFactory', function ($http, $state, $sessionStorage, $localStorage) {
        var ipAddress  =  './'; //'http://prob-nqt.debug.testcenter.kz/'; //
        var appFactory = {
            appData: {
                loading : false,
                slovar : [
                   	/*0*/['Ұлттық біліктілік тестілеуінің байқау сынағы', 'Пробное Национальное квалификационное тестирование'],
                    /*1*/['Тестіленушілер тізімі:', 'Список тестируемых:'],
                    /*2*/['Тестіленуші мәліметі:', 'Данные тестируемого:'],
                    /*3*/['ТАӘ', 'ФИО'],
                    /*4*/['Тест тапсыру тілі', 'Язык сдачи тестирования'],
                    /*5*/['Тестілеуді бастау', 'Начать тестирование'],
                    /*6*/['Назар аударыңыз!', 'Внимание!'],
                    /*7*/['Өзіңіздің ЖСН-ды енгізіңіз:', 'Введите свой ИИН:'],
                    /*8*/['Кейбір деректер толтырылған жоқ!', 'Некоторые поля не заполнены!'],
                    /*9*/['ЖСН', 'ИИН'],
                    /*10*/['Пароль', 'Пароль'],
                    /*11*/['Әрі қарай', 'Далее'],
                    /*12*/['Болдырмау', 'Отмена'],
                    /*13*/['Қабылдаймын', 'Принимаю'],
                    /*14*/['Бас тартамын', 'Отказываюсь'],
                    /*15*/['Шарттармен таныстым', 'Я прочитал условия'],
                    /*16*/['Тест шарттарынан бас тарту', 'Отказ от принятия условий тестирования'],
                    /*17*/['Егер сіз тест тапсыру шарттарынан бас тартқан жағдайда кіру бетіне өтесіз', 'Если вы откажетесь от условий прохождения тестирования, то вы будете переведены на страницу входа'],
                    /*18*/['Бас тарту', 'Отказ'],
                    /*19*/['Қате', 'Ошибка'],
                    /*20*/['Тестілеуді жалғастыру үшін «Шарттармен таныстым» белгісін қойыңыз', 'Для продолжения тестирования поставьте отметку "Я прочитал условия"'],
                    /*21*/['Түсінікті', 'Ясно'],
                    /*22*/['Жалғастырғым келеді', 'Я хочу продолжить'],
                    /*23*/['Мен бас тартамын', 'Я отказываюсь'],
                    /*24*/['Сіздің бас тартуыңыз қабылданды. Сіз тестілеуге қатыса алмайсыз', 'Ваш отказ принят. Вы не можете участвовать в тестировании'],
                    /*25*/['Жабу', 'Закрыть'],
                    /*26*/['Тестілеу пәндері:', 'Предметы тестирования:'],
                    /*27*/['Сұрақтар саны:', 'Количество вопросов:'],
                    /*28*/['Ескерту', 'Предупреждение'],
                    /*29*/['Өту мүмкін емес. "Тест тапсырмаларының аяғы":', 'Переход невозможен. Вы в конце'],
                    /*30*/['Өту мүмкін емес, "Тест тапсырмаларының басы":', 'Переход невозможен. Вы в начале'],
                    /*31*/['Тестілеуді аяқтағыңыз келе ме?', 'Хотите завершить тестирование?'],
                    /*32*/['Тестілеуді аяқтағаннан кейін сіз сұрақтарға жауап бере алмайсыз. Егер тестілеуді аяқтауға сенімді болсаңыз, төмендегі жерге сандарды қосу операциясының нәтижесін енгізіңіз.',
                        'После завершения вы не сможете отвечать на вопросы. Если вы уверены, что хотите завершить тестирование, то введите в поле ниже результат операции сложения чисел'],
                    /*33*/['Аяқтау', 'Завершить'],
                    /*34*/['Тестілеуді жалғастыру', 'Продолжить тестирование'],
                    /*35*/['Тестілеуді аяқтау', 'Завершить тестирование'],
                    /*36*/['Сервердің жауабын күтіңіз!', 'Дождитесь ответа от сервера!'],
                    /*37*/['Үзіліс', 'Пауза'],
                    /*38*/['ТЕСТІЛЕУ ПӘНДЕРІ', 'ПРЕДМЕТЫ ТЕСТИРОВАНИЯ'],
                    /*39*/['Орындалып жатқан пән: ', 'Текущий предмет: '],
                    /*40*/['Сома', 'Сумма'],
                    /*41*/['Нәтиже қате!', 'Неверный результат!'],
                    /*42*/['Тестілеу үзіліс тәртібінде', 'Тестирование находится в режиме паузы'],
                    /*43*/['Тестілеуді әрі қарай жүргізу үшін жалғастыру паролін енгізіңіз', 'Для продолжения тестирования введите пароль на продолжение:'],
                    /*44*/['Жалғастыру паролі', 'Пароль на продолжение'],
                    /*45*/['Тестілеуді үзіліске қойғыңыз келе ме?', 'Хотите поставить тестирование на паузу?'],
                    /*46*/['Ағымдағы сұрақ нөмірі:', 'Номер текущего вопроса:'],
                    /*47*/['Таныстым', 'Ознакомлен'],
                    /*48*/['Жауап берілмеген тапсырмалар саны:', 'Количество неотвеченных заданий:'],
                    /*49*/['Нұсқаулық', 'Инструкция'],
                    /*50*/['Тестілеуді бастаудан бұрын міндетті түрде тестіленуші нұсқаулығымен танысыңыз!',
                        'Перед началом тестирования обязательно ознакомьтесь с инструкцией тестируемого!'],
                    /*51*/['Компьютерді тіркеу', 'Пройти регистрацию'],
                    /*52*/['Сізде браузердің ескі нұсқасы орнатылған, У вас установлена старая версия браузера ', '-'],
                    /*53*/['Жұмыс дұрыс атқарылуы үшін браузердің соңғы нұсқасына дейін жаңартыңыз', 'Для корректной работы обновите браузер до последней версии!'],
                    /*54*/['Сіз ескірген браузермен жұмыс жасаудасыз! Жұмыс дұрыс атқарылуы үшін Chrome немесе Firefox браузерлерінің соңғы нұсқасын енгізіңіз',
                        'Вы работаете с устаревшим браузером! Для корректной работы установите последнюю версию браузера Chrome или Firefox'],
                    /*55*/['Пәндерді таңдаңыз:', 'Выберите предметы:'],
                    /*56*/['Тіл', 'Язык'],
                    /*57*/['Қазақша', 'Русский'],
                    /*58*/['Пәнді таңдау қажет', 'Необходимо выбрать предмет'],
                    /*59*/['Басқа пәнді таңдағым келеді', 'Я хочу выбрать другой предмет'],
                    /*60*/['Растау', 'Подтверждение'],
                    /*61*/['Сіз пәнді таңдадыңыз: ', 'Вы выбрали предметы:'],
                    /*62*/['Таңдау пәнін ауыстыру', 'Сменить предмет по выбору'],
                    /*63*/['Шығу', 'Выйти'],
                    /*64*/[' Тестілеуден шыққыңыз келе ме? (аяқтамау, уақытша шығу)', 'Хотите выйти из тестирования? (не завершение, только выход)'],
                    /*65*/[' жауап №', '№ ответа'],
                    /*66*/['Тестіленушінің жауаптары', 'Ответы тестируемого'],
                    /*67*/['Балдар', 'Баллы'],
                    /*68*/['Балдар', 'Баллы'],
                    /*69*/['Жауаптарды талдау картасы', 'Карта анализа ответов'],
                    /*70*/['Тестілеу тілін таңдаңыз:', 'Выберите язык тестирования:'],
                    /*71*/['Балл сомасы', 'Сумма баллов'],
                    /*72*/[' Тестілеу мерзімі мен уақыты:', 'Дата и время тестирования:'],
                    /*73*/['Үміткердің жауабы', 'Ответ претендента'],
                    /*74*/['Тестілеу нәтижесі', 'Результат тестирования'],
                    /*75*/['Сұрақ нөмірі', 'Номер вопроса'],
                    /*76*/['Тестілеу тәртібін таңдаңыз:', 'Выберите режим тестирования:'],
                    /*77*/['Шектеусіз', 'без лимита'],
                    /*78*/['Шектеулі', 'с лимитом'],
                    /*79*/['Назар аударыңыз! «Тестілеуді бастау» батырмасын басқаннан кейін', 'Внимание! После нажатия кнопки "Начать тестирование"'],
                    /*80*/['Сіз тестілеу параметрлерін өзгерте алмайсыз', 'Вы не сможете изменить параметры тестирования'],
                    /*81*/['Тестіленушіге арналған сауалнама', 'Анкета для тестируемого'],
                    /*82*/['Сауалнама толтыру үшін бірнеше минутыңызды бөліңіз. Сіздің жауабыңыз Педагог қызметкерлердің ' +
                           'біліктілігін тестілеу (ПҚБТ) рәсімін одан әрі жетілдіру үшін маңызды. Сіздің жауабыңызға сай ' +
                           'қажетті дөңгелекшені таңдаңыз.',
                        'Уделите несколько минут на заполнение этой анкеты. Ваши ответы важны для совершенствования процедуры ' +
                        'Квалификационного тестирования педагогических работников (КТПР). Выберите кружок, соответствующий Вашему ответу.'],
                    /*83*/['Жауаптарыңызға рахмет!', 'Благодарим за Ваши ответы!'],
                    /*84*/['Ескерту: ', 'Примечание: '],
                    /*85*/['6-7 сұрақтар тек жаңа формат бойынша кешенді құрылымдағы тест тапсырушыларға арналған.', 'на вопросы 6-7 отвечают только сдающие комплексную структуру тестов по новому формату.'],
                    /*86*/['Сауалнаманы сақтаусыз жапқыңыз келе ме?', 'Хотите закрыть анкету без сохранения?'],
                    /*87*/['Сақтау', 'Сохранить'],
                    /*88*/['Сіз сауалнаманың барлық сұрақтарына жауап бермедіңіз', 'Вы не ответили на все вопросы анкеты'],
                    /*89*/['2 Таңдау пәнін таңдаңыз :', 'Выберите предмет по выбору 2:'],
                    /*90*/['Нұсқаны алып тастау', 'Сбросить вариант'],
                    /*91*/['Нәтижені жойып, қайта бастағыңыз келеді ме? ', 'Хотите анулировать результат и начать заново?'],
                    /*92*/['Жою', 'Анулировать'],
                    /*93*/['Бір дұрыс жауабы таңдалатын тапсырма', 'Задание с выбором одного правильного ответа'],
                    /*94*/['Бір немесе бірнеше дұрыс жауабы таңдалатын тапсырма', 'Задание с выбором одного или нескольких правильных ответов'],
                    /*95*/['Жағдаяттық тапсырма', 'Ситуационное задание'],
                    /*96*/['Сіз қаншалықты тестілеу сапасына қаңағаттанасыз?', 'Насколько вы удовлетворены качеством теста?'],
                    /*97*/['(дауыс беру)', '(голосовать)'],
                    /*98*/['из', 'из'],
                    /*99*/['Құпиясөзді ұмыттыныз ба?', 'Забыли пароль?'],
                    /*100*/['Әрі қарай жалғастыру үшін ЖСН енгізіңіз ', 'Для продолжения введите ИИН'],
                    /*101*/['Уақытша құпиясөз сіздің email-ге жіберіледі', 'Времменый пароль выслан на ваш email'],
                    /*102*/['дауыс беру', 'голосовать'],
                    /*103*/['Спасибо за оценку', 'Спасибо за оценку'],
                    /*104*/['Тестілеу түрін таңдаңыз:', 'Выберите тип тестирования:'],
                    /*105*/['Колледж мамандығын таңдаңыз: ', 'Выберите специальность колледжа: '],
                    /*106*/['ЖОО-ның мамандығын таңдаңыз:', 'Выберите специальность ВУЗа:'],
                    /*107*/['Сіздің таңдауыңыз: ', 'Ваш выбор:'],
                    /*108*/['Тегі', 'Фамилия'],
                    /*109*/['Аты', 'Имя'],
                    /*110*/['Әкесінің аты', 'Отчество'],
                ]
            },
            getCompId: function(){
                var fp2 = new Fingerprint().get();
                fp2=fp2+''+new Fingerprint({canvas: true}).get();
                return fp2;
            },
            getSpecColledzh: function(payload){
                return $http.post(ipAddress+'api/tester/college_spec_list', payload);
            },
            getSpecVuz: function(payload){
                return $http.post(ipAddress+'api/tester/institute_spec_list', payload);
            },
            getCompData: function () {
                return {
                    //compId: appFactory.getCompId(),
                    registeredId: $localStorage.getData('registerId')
                };
            },
            getCard: function(studentToken){
                var payload = {
                    //compData: appFactory.getCompData(),
                    studentToken: studentToken
                };
                return $http.post(ipAddress+'api/tester/card',payload);
            },
            getTimeLeft: function(compData, studentToken){
                var payload = {
                    compData: compData,
                    studentToken: studentToken
                };
                return $http.post(ipAddress+'api/tester/test_time_left', payload);
            },
            getStudentList: function(compData){
                return $http.post(ipAddress+'api/tester/student_list', {compData: compData});
            },
            setPause: function(compData, studentToken){
                return $http.post(ipAddress+'api/tester/pauseTest', { compData: compData, studentToken: studentToken });
            },
            setRatingStatus: function(studentToken, userRating){
                return $http.post(ipAddress+'api/tester/user_rating', { studentToken: studentToken, userRating: userRating});
            },
            resumeTest: function(compData, studentToken, password, studentPassword){
                return $http.post(ipAddress+'api/tester/resumeTest', { compData: compData, studentToken: studentToken, password: password, studentPassword: studentPassword});
            },
            exit: function(studentToken){
                return $http.post(ipAddress+'api/tester/exit', {studentToken: studentToken});
            },
            cleartest: function(studentToken){
                return $http.post(ipAddress+'api/tester/clear_test_data', {studentToken: studentToken});
            },
            login: function (studentData) {
                var payload = {
                    studentData: studentData
                };
                return $http.post(ipAddress+'api/tester/login', payload);
            },
            info: function (lang) {
                return $http.get(ipAddress+'api/tester/info/' + lang);
            },
            help: function (lang) {
                return $http.get(ipAddress+'api/tester/rules/' + lang);
            },
            agreementAccepted: function (compData, studentToken, confirmed) {
                var payload = {
                    compData: compData
                    ,studentToken: studentToken
                    //,confirmed: confirmed
                };
                return $http.post(ipAddress+'api/tester/confirm_read_rules', payload);
            },
            getSubjectList: function (requestParam) {
                var payload = {
                    studentToken: requestParam.studentToken,
                    testIdLang: requestParam.testIdLang
                };
                return $http.post(ipAddress+'api/tester/optional_subjects', payload);
            },
            getRecuverPass: function (requestParam) {
                return $http.get(ipAddress+'api/reg-test/email?email=' + requestParam);
            },
            setSubject: function (requestParam) {

                var payload = {
                    studentToken: requestParam.studentToken, /*ID сочетания ученик-тестирование*/
                    lastname: requestParam.lastname,
                    firstname: requestParam.firstname,
                    patronymic: requestParam.patronymic,
                    testIdLang: requestParam.testIdLang, /*Код языка тестирования*/
                    optionalIdSubject: requestParam.optionalIdSubject /*Код профилирующего предмета*/
                };

                return $http.post(ipAddress+'api/tester/set_test_params', payload);
            },
            getTestSubjectList: function (inParam) {
                var param = {
                    //compData: inParam.compData,
                    studentToken: inParam.studentToken
                };
                return $http.post(ipAddress+'api/tester/subjects', param);
            },
            setAnketaAnswers: function (requestParam) {
                var payload = {
                    compData: appFactory.getCompData(),
                    studentToken: requestParam.studentToken,
                    answers: requestParam.answers
                };
                return $http.post(ipAddress+'api/tester/anketa', payload);
            },
            startTest: function (compData, studentToken) {
                var payload = {
                    //compData: compData,
                    studentToken: studentToken
                };
                return $http.post(ipAddress+'api/tester/start', payload);
            },
            closeTest: function (studentToken) {
                var payload = {
                    //compData: appFactory.getCompData(),
                    studentToken: studentToken
                };
                return $http.post(ipAddress+'api/tester/finish', payload);
            },
            setAnswer: function (studentToken, answer) {
                var payload = {
                    //compData: appFactory.getCompData(),
                    studentToken: studentToken,
                    answer: answer
                };
                return $http.post(ipAddress+'api/tester/answer', payload);
            },
            getItem: function (studentToken, subjectId, questionNum) {
                var payload = {
                    //compData: appFactory.getCompData(),
                    // idtoken "78869a29-8e6f-4128-8a9c-b0bee36efeaa"
                    studentToken: studentToken,
                    subjectId: subjectId,
                    questionNum: questionNum
                };
                return $http.post(ipAddress+'api/tester/question', payload);
            },
            initDataBrowser: function () {
                var browInf = {
                    browser: appFactory.searchString(this.dataBrowser) || "An unknown browser",
                    version: appFactory.searchVersion(navigator.userAgent) || appFactory.searchVersion(navigator.appVersion) || "an unknown version",
                    OS: appFactory.searchString(this.dataOS) || "an unknown OS"
                }
                return browInf;
            },
            searchString: function (data) {
                for (var i=0;i<data.length;i++) {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;
                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString) {
                        if (dataString.indexOf(data[i].subString) != -1)
                            return data[i].identity;
                    }
                    else if (dataProp)
                        return data[i].identity;
                }
            },
            searchVersion: function (dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) return;
                return parseFloat(dataString.substring(index + this.versionSearchString.length+1));
            },
            dataBrowser: [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                },
                { string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                },
                {
                    prop: window.opera,
                    identity: "Opera",
                    versionSearch: "Version"
                },
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                },
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                },
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                },
                {
                    /* For Newer Netscapes (6+) */
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                },
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Internet Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                },
                {
                    /* For Older Netscapes (4-) */
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ],
            dataOS : [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ]

        };
        return appFactory;
    });

;(function (name, context, definition) {
    if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
    else if (typeof define === 'function' && define.amd) { define(definition); }
    else { context[name] = definition(); }
})('Fingerprint', this, function () {
    'use strict';

    var Fingerprint = function (options) {
        var nativeForEach, nativeMap;
        nativeForEach = Array.prototype.forEach;
        nativeMap = Array.prototype.map;

        this.each = function (obj, iterator, context) {
            if (obj === null) {
                return;
            }
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === {}) return;
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === {}) return;
                    }
                }
            }
        };

        this.map = function(obj, iterator, context) {
            var results = [];
            // Not using strict equality so that this acts as a
            // shortcut to checking for `null` and `undefined`.
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
            this.each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list);
            });
            return results;
        };

        if (typeof options == 'object'){
            this.hasher = options.hasher;
            this.screen_resolution = options.screen_resolution;
            this.canvas = options.canvas;
            this.ie_activex = options.ie_activex;
        } else if(typeof options == 'function'){
            this.hasher = options;
        }
    };

    Fingerprint.prototype = {
        get: function(){
            var keys = [];
            keys.push(navigator.userAgent);
            keys.push(navigator.language);
            keys.push(screen.colorDepth);
            if (this.screen_resolution) {
                var resolution = this.getScreenResolution();
                if (typeof resolution !== 'undefined'){ // headless browsers, such as phantomjs
                    keys.push(this.getScreenResolution().join('x'));
                }
            }
            keys.push(new Date().getTimezoneOffset());
            keys.push(this.hasSessionStorage());
            keys.push(this.hasLocalStorage());
            keys.push(!!window.indexedDB);
            //body might not be defined at this point or removed programmatically
            if(document.body){
                keys.push(typeof(document.body.addBehavior));
            } else {
                keys.push(typeof undefined);
            }
            keys.push(typeof(window.openDatabase));
            keys.push(navigator.cpuClass);
            keys.push(navigator.platform);
            keys.push(navigator.doNotTrack);
            keys.push(this.getPluginsString());
            if(this.canvas && this.isCanvasSupported()){
                keys.push(this.getCanvasFingerprint());
            }
            if(this.hasher){
                return this.hasher(keys.join('###'), 31);
            } else {
                return this.murmurhash3_32_gc(keys.join('###'), 31);
            }
        },

        /**
         * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
         *
         * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
         * @see http://github.com/garycourt/murmurhash-js
         * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
         * @see http://sites.google.com/site/murmurhash/
         *
         * @param {string} key ASCII only
         * @param {number} seed Positive integer only
         * @return {number} 32-bit positive integer hash
         */

        murmurhash3_32_gc: function(key, seed) {
            var remainder, bytes, h1, h1b, c1, c2, k1, i;

            remainder = key.length & 3; // key.length % 4
            bytes = key.length - remainder;
            h1 = seed;
            c1 = 0xcc9e2d51;
            c2 = 0x1b873593;
            i = 0;

            while (i < bytes) {
                k1 =
                    ((key.charCodeAt(i) & 0xff)) |
                    ((key.charCodeAt(++i) & 0xff) << 8) |
                    ((key.charCodeAt(++i) & 0xff) << 16) |
                    ((key.charCodeAt(++i) & 0xff) << 24);
                ++i;

                k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
                h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
            }

            k1 = 0;

            switch (remainder) {
                case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
                case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
                case 1: k1 ^= (key.charCodeAt(i) & 0xff);

                    k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                    k1 = (k1 << 15) | (k1 >>> 17);
                    k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                    h1 ^= k1;
            }

            h1 ^= key.length;

            h1 ^= h1 >>> 16;
            h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= h1 >>> 13;
            h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
            h1 ^= h1 >>> 16;

            return h1 >>> 0;
        },

        // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
        hasLocalStorage: function () {
            try{
                return !!window.localStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        hasSessionStorage: function () {
            try{
                return !!window.sessionStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        isCanvasSupported: function () {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        },

        isIE: function () {
            if(navigator.appName === 'Microsoft Internet Explorer') {
                return true;
            } else if(navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)){// IE 11
                return true;
            }
            return false;
        },

        getPluginsString: function () {
            if(this.isIE() && this.ie_activex){
                return this.getIEPluginsString();
            } else {
                return this.getRegularPluginsString();
            }
        },

        getRegularPluginsString: function () {
            return this.map(navigator.plugins, function (p) {
                var mimeTypes = this.map(p, function(mt){
                    return [mt.type, mt.suffixes].join('~');
                }).join(',');
                return [p.name, p.description, mimeTypes].join('::');
            }, this).join(';');
        },

        getIEPluginsString: function () {
            if(window.ActiveXObject){
                var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
                    'AcroPDF.PDF', // Adobe PDF reader 7+
                    'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
                    'QuickTime.QuickTime', // QuickTime
                    // 5 versions of real players
                    'rmocx.RealPlayer G2 Control',
                    'rmocx.RealPlayer G2 Control.1',
                    'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
                    'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
                    'RealPlayer',
                    'SWCtl.SWCtl', // ShockWave player
                    'WMPlayer.OCX', // Windows media player
                    'AgControl.AgControl', // Silverlight
                    'Skype.Detection'];

                // starting to detect plugins in IE
                return this.map(names, function(name){
                    try{
                        new ActiveXObject(name);
                        return name;
                    } catch(e){
                        return null;
                    }
                }).join(';');
            } else {
                return ""; // behavior prior version 0.5.0, not breaking backwards compat.
            }
        },

        getScreenResolution: function () {
            return [screen.height, screen.width];
        },

        getCanvasFingerprint: function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // https://www.browserleaks.com/canvas#how-does-it-work
            var txt = 'http://valve.github.io';
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069";
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText(txt, 4, 17);
            return canvas.toDataURL();
        }
    };

    return Fingerprint;
});

;'use strict';
function CardCtrl ($state, $sessionStorage, $appFactory, $mdDialog) {

    var vm = this;
    vm.iSloading = $appFactory.appData.loading;

    vm.close = close;
    vm.getCard = getCard;
    vm.getAnswersDistr = getAnswersDistr;
    vm.restart = restart;
    vm.clickKZ = clickKZ;
    vm.clickRU = clickRU;
    vm.sumball = 0;

    activate();

    function activate(){
        vm.rs = $sessionStorage.getData('rs');
        vm.rs.slovar = $appFactory.appData.slovar;
        vm.userData = $sessionStorage.getData('studentData');
        if (vm.userData == null){
            $state.go("login");
        }
        getCard();
    }

    function restart(ev){
        var confirm = $mdDialog.confirm()
            .title(vm.rs.slovar[6][vm.rs.idLang])
            .textContent(vm.rs.slovar[91][vm.rs.idLang])
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok(vm.rs.slovar[92][vm.rs.idLang])
            .cancel(vm.rs.slovar[12][vm.rs.idLang]);

        $mdDialog.show(confirm).then(function() {
            $appFactory.cleartest(vm.userData.studentToken)
                .then(function (data) {
                        data = data.data;
                        if (data.errorCode == 0) {
                            $state.go("login");
                        } else {
                            if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                    .ok(vm.rs.slovar[21][vm.rs.idLang])
                            );
                        }
                    },
                    function (result){
                        vm.iSloading=false;
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(vm.rs.slovar[19][vm.rs.idLang])
                                .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                                .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                                .ok(vm.rs.slovar[21][vm.rs.idLang])
                        );
                    });
        }, function() {
        });
    }

    function clickRU() {
        vm.rs.idLang = 1;
        $sessionStorage.setData('rs',vm.rs);
    }

    function clickKZ() {
        vm.rs.idLang = 0;
        $sessionStorage.setData('rs',vm.rs);
    }

    function getAnswersDistr(){
        for (var p=0; p<vm.card.length; p++){
            for (var i=0; i<vm.card[p].receivedAnswers.length; i++){
                if (vm.card[p].receivedAnswers[i].questionType==2){
                    var tmpStringAns = "";
                    for (var a=0; a<vm.card[p].receivedAnswers[i].answer.length; a++){
                        tmpStringAns = tmpStringAns + vm.card[p].receivedAnswers[i].answer[a];
                    }
                    vm.card[p].receivedAnswers[i].answer = tmpStringAns;
                    if (vm.card[p].receivedAnswers[i].answer=="") vm.card[p].receivedAnswers[i].answer = "-"
                }else{
                    if (vm.card[p].receivedAnswers[i].answer=="") vm.card[p].receivedAnswers[i].answer = "-"
                }
            }
        }

        for (var i=0; i<vm.card.length; i++){
            if (vm.card[i].questionType==2){
                var tmpStringAns = '';
                for (var a=0; a<vm.card[i].answer.length; a++){
                    tmpStringAns = tmpStringAns + vm.subjectData[i].answer[a];
                }
                vm.subjectData[i].answer = tmpStringAns;
            }
        }
    }

    function getCard(){
        vm.iSloading=false;
        $appFactory.getCard(vm.userData.studentToken).then(function(data){
            data = data.data;
            vm.iSloading=true;
            if (data.errorCode==0){
                vm.testFinishDateTime = new Date(data.cardData.testFinishDateTime);
                vm.testFinishDateTime = vm.testFinishDateTime.toLocaleString();

                vm.card = data.cardData.subjects;
                for (var i=0; i<vm.card.length; i++){
                    var sumball=0;
                    for (var s=0; s<vm.card[i].receivedAnswers.length; s++){
                        sumball = sumball + vm.card[i].receivedAnswers[s].ball;
                        //if (vm.card[i].receivedAnswers[s].isAnswerCorrect==1) sumball++;
                    }
                    vm.card[i].sumball = sumball;
                    vm.sumball = vm.sumball + sumball;
                }
                vm.studentFullName = data.cardData.studentFullName;

                vm.testLangNameKaz = data.cardData.testLangNameKaz;
                vm.testLangNameRus = data.cardData.testLangNameRus;
                vm.testTypeNameKaz = data.cardData.testTypeNameKaz;
                vm.testTypeNameRus = data.cardData.testTypeNameRus;

                getAnswersDistr();
            }else{
                if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus};
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                        .textContent(vm.errorMsg)
                        .ariaLabel(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                        .ok(vm.rs.slovar[25][vm.rs.idLang])
                );
                if (data.errorCode==2 || data.errorCode==3){
                    $sessionStorage.removeData('studentData');
                    $sessionStorage.removeData('user');
                    $sessionStorage.removeData('time');
                    $state.go("login");
                }
            }
        }, function(result){
            vm.iSloading=false;
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(vm.rs.slovar[19][vm.rs.idLang])
                    .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                    .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                    .ok(vm.rs.slovar[21][vm.rs.idLang])
            );
        });
    }

    function close(){
        $sessionStorage.removeData('studentData');
        $sessionStorage.removeData('user');
        $sessionStorage.removeData('time');
        $state.go("login");
    }

////
};


angular.module('untApp').component('card', {
    templateUrl: 'app/card/card.html',
    controller: CardCtrl,
    controllerAs: 'vm'
});

;'use strict';
function CheckinCtrl($sessionStorage, $appFactory, $mdDialog, $mdMedia, $state, $stateParams) {
    var vm = this;

//    alert($stateParams.email+','+$stateParams.password);

    vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    vm.iSloading = true;

    vm.rs = {
        rootDomenName : 'regcomp', //'http://localhost:8000/';
        idLang : 0,
        slovar : []
    };

    vm.rs.slovar = $appFactory.appData.slovar;

    $sessionStorage.setData('rs',vm.rs);

    vm.user = {
        "username": '',
        "password": ''
    } ;

    vm.user.username = $stateParams.email;
    vm.user.password = $stateParams.password;

    vm.browserDetect = browserDetect;

    vm.passEnter = passEnter;

    activate();

    function activate() {
        browserDetect();
        passEnter();
        $sessionStorage.removeData('studentData');
        $sessionStorage.removeData('studentList');
        $sessionStorage.removeData('subjects');
        $sessionStorage.removeData('closeStatus');
        $sessionStorage.removeData('questions');
        $sessionStorage.removeData('time');
        $sessionStorage.removeData('sessionVop');
    }


    function passEnter(){
        var studentData =  {
            "username": vm.user.username
            ,"password": vm.user.password
        };
        $appFactory.login(studentData).then(function (data) {
                vm.iSloading = true;
                data = data.data;
                if (data.errorCode == 0) {
                    $sessionStorage.setData('studentData', data.studentData);
                    vm.errorLabel = '';
                    $sessionStorage.setData('rs',vm.rs);
                    //------------------------------------------
                    $sessionStorage.removeData('subjects');
                    $sessionStorage.removeData('questions');
                    //------------------------------------------
                    switch (data.studentData.idTestStatus){
                        case 1:
                            $sessionStorage.setData('time', 0);
                            $state.go('test');
                        break;
                        case 2:
                            $state.go("card");
                        break;
                        case 3:
                            $state.go("card");
                            break;
                        case 0:
                            vm.stopTime = 0;
                            $state.go("subject");
                        break;
                    }
                } else {
                    if (vm.rs.idLang==0){vm.errorLabel=data.errorMsgKaz}else{vm.errorLabel=data.errorMsgRus};
                }
            },
            function (result){
                vm.iSloading = true;
                vm.errorLabel = vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText;
            });


    }



    function browserDetect(){
        vm.browsInfo = "";
        vm.browsId = $appFactory.initDataBrowser();

        switch (vm.browsId.browser) {
            case "Chrome":
                if (vm.browsId.version<41){
                    vm.browsInfo = vm.rs.slovar[52][vm.rs.idLang]+vm.browsId.browser+' '+vm.rs.slovar[53][vm.rs.idLang];
                }
            break;
            case "Firefox":
                if (vm.browsId.version<44){
                    vm.browsInfo = vm.rs.slovar[52][vm.rs.idLang]+vm.browsId.browser+' '+vm.rs.slovar[53][vm.rs.idLang];
                }
            break;
            default:
                vm.browsInfo = vm.rs.slovar[54][vm.rs.idLang];
            break;
        }
        if (vm.browsInfo!=""){
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(vm.rs.slovar[6][vm.rs.idLang])
                    .textContent(vm.browsInfo)
                    .ariaLabel(vm.rs.slovar[6][vm.rs.idLang])
                    .ok(vm.rs.slovar[21][vm.rs.idLang])
            );
        }
    }
}

angular.module('untApp').component('checkin', {
    templateUrl: 'app/checkin/checkin.html',
    controller: CheckinCtrl,
    controllerAs: 'vm'
});



;'use strict';
function LoginCtrl($sessionStorage, $appFactory, $mdDialog, $mdMedia, $state) {
    var vm = this;

    vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    vm.iSloading = true;

    vm.rs = {
        rootDomenName : 'regcomp', //'http://localhost:8000/';
        idLang : 0,
        slovar : []
    };

    vm.rs.slovar = $appFactory.appData.slovar;

    $sessionStorage.setData('rs',vm.rs);

    vm.user = {
        "username": ''
        //,"password": ''
    } ;

    vm.clickKZ = clickKZ;
    vm.clickRU = clickRU;
    vm.browserDetect = browserDetect;
    vm.help = help;
    vm.cancel = cancel;
    vm.passEnter = passEnter;
    vm.getHelp = getHelp;
    vm.recuver = recuver;

    activate();

    function activate() {
        browserDetect();
        $sessionStorage.removeData('studentData');
        $sessionStorage.removeData('studentList');
        $sessionStorage.removeData('subjects');
        $sessionStorage.removeData('closeStatus');
        $sessionStorage.removeData('questions');
        $sessionStorage.removeData('time');
        $sessionStorage.removeData('sessionVop');
    }

    function recuver(ev){
        $mdDialog.show({
            controller: recoverCtrl,
            controllerAs: 'vm',
            templateUrl: 'app/component/recoverDialog/recoverDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        }).then(function() {
        }, function(){
            //
        })
    }

    function cancel(){
        vm.user.password = '';
        vm.errorLabel = '';
        vm.user.iin = '';
    }

    function getHelp(ev){
        $mdDialog.show({
            controller: HelpCtrl,
            controllerAs: 'vm',
            templateUrl: 'app/component/help/help.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }

    function passEnter(){
        var studentData =  {
            "username": vm.user.iin
            //,"password": vm.user.password
        };

        if ( vm.user.iin.length > 0 && vm.iSloading != false) {
            vm.iSloading = false;

            $appFactory.login(studentData).then(function (data) {
                    vm.iSloading = true;
                    data = data.data;
                    if (data.errorCode == 0) {
                        $sessionStorage.setData('studentData', data.studentData);
                        vm.errorLabel = '';
                        $sessionStorage.setData('rs',vm.rs);
                        //------------------------------------------
                        $sessionStorage.removeData('subjects');
                        $sessionStorage.removeData('questions');
                        //------------------------------------------
                        switch (data.studentData.idTestStatus){
                            case 1:
                                $sessionStorage.setData('time', 0);
                                $state.go('test');
                            break;
                            case 2:
                                $state.go("card");
                            break;
                            case 3:
                                $state.go("card");
                                break;
                            case 0:
                                vm.stopTime = 0;
                                $state.go("subject");
                            break;
                        }
                    } else {
                        if (vm.rs.idLang==0){vm.errorLabel=data.errorMsgKaz}else{vm.errorLabel=data.errorMsgRus};
                    }
                },
                function (result){
                    vm.iSloading = true;
                    vm.errorLabel = vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText;
                });

        } else {
            if (vm.iSloading != false){
                vm.errorLabel = vm.rs.slovar[8][vm.rs.idLang];
            }else {vm.errorLabel = vm.rs.slovar[36][vm.rs.idLang]}
        }
    }

    function help(ev){
        $mdDialog.show({
            controller: HelpCtrl,
            controllerAs: 'vm',
            templateUrl: 'app/component/help/help.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }

    function clickRU() {
        vm.rs.idLang = 1;
        $sessionStorage.setData('rs',vm.rs);
    }

    function clickKZ() {
        vm.rs.idLang = 0;
        $sessionStorage.setData('rs',vm.rs);
    }

    function browserDetect(){
        vm.browsInfo = "";
        vm.browsId = $appFactory.initDataBrowser();

        switch (vm.browsId.browser) {
            case "Chrome":
                if (vm.browsId.version<41){
                    vm.browsInfo = vm.rs.slovar[52][vm.rs.idLang]+vm.browsId.browser+' '+vm.rs.slovar[53][vm.rs.idLang];
                }
            break;
            case "Firefox":
                if (vm.browsId.version<44){
                    vm.browsInfo = vm.rs.slovar[52][vm.rs.idLang]+vm.browsId.browser+' '+vm.rs.slovar[53][vm.rs.idLang];
                }
            break;
            default:
                vm.browsInfo = vm.rs.slovar[54][vm.rs.idLang];
            break;
        }
        if (vm.browsInfo!=""){
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(vm.rs.slovar[6][vm.rs.idLang])
                    .textContent(vm.browsInfo)
                    .ariaLabel(vm.rs.slovar[6][vm.rs.idLang])
                    .ok(vm.rs.slovar[21][vm.rs.idLang])
            );
        }
    }
}

angular.module('untApp').component('login', {
    templateUrl: 'app/login/login.html',
    controller: LoginCtrl,
    controllerAs: 'vm'
});



;'use strict';
function SubjectCtrl($state, $sessionStorage, $appFactory, $mdDialog) {
    var vm = this;
    vm.optionalSubject = -1;

    vm.iSloading = $appFactory.appData.loading;

    vm.langTest = [
        { label: 'Қазақша', value: 1},
        { label: 'Русский', value: 2}
    ];


    vm.getSubjectById = getSubjectById;
    vm.proceed = proceed;
    vm.browserDetect = browserDetect;
    vm.radioClick = radioClick;
    vm.clickKZ = clickKZ;
    vm.clickRU = clickRU;
    vm.saveSessionStorage = saveSessionStorage;
    vm.close = close;
    vm.getHelp = getHelp;
    vm.getPredmsList = getPredmsList;
    vm.removeTestData = removeTestData;

    vm.selectEntSubject = selectEntSubject;

    activate();

    function  activate(){
        vm.rs = $sessionStorage.getData('rs');
        vm.rs.slovar = $appFactory.appData.slovar;

        vm.userData = $sessionStorage.getData('studentData');
        if (vm.userData == null){
            $state.go("login");
        }

        if (vm.userData.testIdLang!=2){vm.userData.testIdLang = 1};
        if (vm.userData.testIdType!=2){vm.userData.testIdType = 1}; // yia

        saveSessionStorage('studentData', vm.userData);
        if (vm.rs.idLang<1){vm.rs.idLang=0};
        saveSessionStorage('rs', vm.rs);
        getPredmsList();
    }

    function selectEntSubject(nameKaz,nameRus){
        if(vm.rs.idLang==0){
            vm.SubjectName = nameKaz;
        }else{
            vm.SubjectName = nameRus;
        }
    }

    function removeTestData(){
        $sessionStorage.removeData('studentData');
        $sessionStorage.removeData('user');
        $sessionStorage.removeData('time');
        //----------------------------------------
        $sessionStorage.removeData('subjects');
        $sessionStorage.removeData('questions');
        $sessionStorage.removeData('noUseVop');
        $sessionStorage.removeData('sessionVop');
    }

    function getPredmsList(){
       vm.subjectList = [];

        vm.requestParam = {
            studentToken: vm.userData.studentToken,
            testIdLang: vm.userData.testIdLang
        };

        $appFactory.getSubjectList(vm.requestParam).then(function (data) {
                data = data.data;
                if (data.errorCode == 0) {

                    vm.subjectList = data.subjects;
                } else {
                    if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.errorMsg)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );

                    if (data.errorCode == 3) {
                        removeTestData();
                        $state.go("login");
                    }

                }
            },
            function (result){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title(vm.rs.slovar[19][vm.rs.idLang])
                        .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                        .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                        .ok(vm.rs.slovar[21][vm.rs.idLang])
                );
            })
    }

    function radioClick(_val){
        if (_val==2){
            vm.userData.testIdLang = 2;
            saveSessionStorage('studentData', vm.userData);
        }
        else {
            vm.userData.testIdLang = 1;
            saveSessionStorage('studentData', vm.userData);
        }

        getPredmsList();
    }

    function getHelp(ev){
        $mdDialog.show({
            controller: HelpCtrl,
            controllerAs: 'vm',
            templateUrl: 'app/component/help/help.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }

    function close(ev){
        var confirm = $mdDialog.confirm()
            .title(vm.rs.slovar[6][vm.rs.idLang])
            .textContent(vm.rs.slovar[64][vm.rs.idLang])
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok(vm.rs.slovar[63][vm.rs.idLang])
            .cancel(vm.rs.slovar[12][vm.rs.idLang]);

        $mdDialog.show(confirm).then(function() {
            $appFactory.exit(vm.userData.studentToken)
                .then(function (data) {
                    data = data.data;
                    if (data.errorCode == 0) {
                        $state.go("login");
                    } else {
                        if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                .ok(vm.rs.slovar[21][vm.rs.idLang])
                        );
                    }
                },
                function (result){
                    vm.iSloading=false;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                });
        }, function() {
        });
    }

    function clickRU() {
        vm.rs.idLang = 1;
        saveSessionStorage('rs', vm.rs);
    }

    function clickKZ() {
        vm.rs.idLang = 0;
        saveSessionStorage('rs', vm.rs);
    }

     function getSubjectById(idSubject) {
        for (var i = 0; i < vm.subjectList.length; i++) {
            if (vm.subjectList[i].idSubject == idSubject) {
                if (vm.rs.idLang==1) {return vm.subjectList[i].subjectNameRus}else{return vm.subjectList[i].subjectNameKaz}
            }
        }
        return '';
    }

    function proceed (ev) {

        if (vm.optionalSubject >= 0 ) {
            var confirm = $mdDialog.confirm()
                .title(vm.rs.slovar[60][vm.rs.idLang])
                .textContent(vm.rs.slovar[107][vm.rs.idLang] + vm.SubjectName)
                .ariaLabel(vm.rs.slovar[60][vm.rs.idLang])
                .targetEvent(ev)
                .ok(vm.rs.slovar[5][vm.rs.idLang])
                .cancel(vm.rs.slovar[59][vm.rs.idLang]);
            $mdDialog.show(confirm).then(function () {
                vm.status = 'Согласен с выбором предмета';
                vm.requestParam = {
                    studentToken: vm.userData.studentToken, /*ID сочетания ученик-тестирование*/
                    lastname: vm.userData.lastname,
                    firstname: vm.userData.firstname,
                    patronymic: vm.userData.patronymic,
                    testIdLang: vm.userData.testIdLang, /*Код языка тестирования*/
                    optionalIdSubject: vm.optionalSubject /*Код профилирующего предмета*/
                }

                $appFactory.setSubject(vm.requestParam)
                    .then(function (data) {
                        data = data.data;
                        if (data.errorCode == 0) {
                            saveSessionStorage('studentData', vm.userData);
                            $state.go('test');
                        } else {
                            if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title(vm.rs.slovar[19][vm.rs.idLang])
                                    .textContent(vm.errorMsg)
                                    .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                                    .ok(vm.rs.slovar[21][vm.rs.idLang])
                                );
                        }
                    },
                    function (result){
                        vm.iSloading=false;
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(vm.rs.slovar[19][vm.rs.idLang])
                                .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                                .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                                .ok(vm.rs.slovar[21][vm.rs.idLang])
                        );
                    });
            }, function () {
                vm.status = 'Продолжил выбор предмета';
            });
        } else {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(vm.rs.slovar[19][vm.rs.idLang])
                    .textContent(vm.rs.slovar[58][vm.rs.idLang])
                    .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                    .ok(vm.rs.slovar[21][vm.rs.idLang])
                );
        }
    }

    function browserDetect(){
        vm.browsInfo = "";
        vm.browsId = $appFactory.initDataBrowser();

        switch (vm.browsId.browser) {
            case "Chrome":
                if (vm.browsId.version<41){
                    vm.browsInfo = vm.rs.slovar[52][vm.rs.idLang]+vm.browsId.browser+' '+vm.rs.slovar[53][vm.rs.idLang];
                }
                break;
            case "Firefox":
                if (vm.browsId.version<44){
                    vm.browsInfo = vm.rs.slovar[52][vm.rs.idLang]+vm.browsId.browser+' '+vm.rs.slovar[53][vm.rs.idLang];
                }
                break;
            default:
                vm.browsInfo = vm.rs.slovar[54][vm.rs.idLang];
                break;
        }
        if (vm.browsInfo!=""){
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(vm.rs.slovar[6][vm.rs.idLang])
                    .textContent(vm.browsInfo)
                    .ariaLabel(vm.rs.slovar[6][vm.rs.idLang])
                    .ok(vm.rs.slovar[21][vm.rs.idLang])
            );
        }
    }

    function saveSessionStorage(key, val){
        $sessionStorage.setData(key, val);
    }
}

angular.module('untApp').component('subject', {
    templateUrl: 'app/subject/subject.html',
    controller: SubjectCtrl,
    controllerAs: 'vm'
});

;'use strict';
function TestCtrl($sessionStorage, $appFactory, $mdDialog, $mdSidenav, $log, $state, $http, $timeout, $anchorScroll, $location) {
    var vm = this;
    vm.http = $http;
    vm.iSloading = $appFactory.appData.loading;

    vm.item = {};
    vm.questions = [];
    vm.subjectData = [];
    vm.NumVop = 0;
    vm.subjectId = 0;
    vm.timeLeft = 0;
    vm.testTime = "00 : 00";
    vm.stopTime = 0;
    vm.getTimeNow = 60;

    vm.start = start;
    vm.loadSubjects = loadSubjects;
    vm.loadItem = loadItem;
    vm.prev = prev;
    vm.next = next;
    vm.buildToggler = buildToggler;
    vm.getHttpText = getHttpText;
    vm.exitTest = exitTest;
    vm.getOrderById = getOrderById;
    vm.getAnswersDistr = getAnswersDistr;
    vm.getTimeForLeft = getTimeForLeft;
    vm.getTime = getTime;
    vm.TimerMan = TimerMan;
    vm.pauseTest = pauseTest;
    vm.closeDialog = closeDialog;
    vm.removeTestData = removeTestData;
    vm.saveSessionStorage = saveSessionStorage;
    vm.saveVopSession = saveVopSession;
    vm.keyPress = keyPress;
    vm.getNoUseVop = getNoUseVop;
    vm.getHelp = getHelp;
    vm.browserDetect = browserDetect;
    vm.predmCheng = predmCheng;
    vm.clickKZ = clickKZ;
    vm.clickRU = clickRU;
    vm.updateDiction = updateDiction;

    activate();

    function activate(){
        vm.rs = $sessionStorage.getData('rs');
        vm.rs.slovar = $appFactory.appData.slovar;
        vm.userData = $sessionStorage.getData('studentData');
        vm.sessionVop = $sessionStorage.getData('sessionVop');
        if (vm.sessionVop == null) {
            vm.sessionVop = {
                idSubject: 0,
                numItem: 0
            };
        }

        if (vm.userData == null){
            vm.stopTime = 1;
            removeTestData();
            $state.go("login");
        }
        $sessionStorage.setData('rs',vm.rs);
        browserDetect();
        loadSubjects();
    }

    function updateDiction(){
        vm.rs = $sessionStorage.getData('rs');
        vm.userData = $sessionStorage.getData('studentData');
    }

    function clickRU() {
        vm.rs.idLang = 1;
        $sessionStorage.setData('rs',vm.rs);
    }

    function clickKZ() {
        vm.rs.idLang = 0;
        $sessionStorage.setData('rs',vm.rs);
    }

    function exitTest(ev){
        var confirm = $mdDialog.confirm()
            .title(vm.rs.slovar[6][vm.rs.idLang])
            .textContent(vm.rs.slovar[64][vm.rs.idLang])
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok(vm.rs.slovar[63][vm.rs.idLang])
            .cancel(vm.rs.slovar[12][vm.rs.idLang]);

        $mdDialog.show(confirm).then(function() {
            $appFactory.exit(vm.userData.studentToken)
                .then(function (data) {
                    data = data.data;
                    if (data.errorCode == 0) {
                        $state.go("login");
                    } else {
                        if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                .ok(vm.rs.slovar[21][vm.rs.idLang])
                        );
                    }
                },
                function (result){
                    vm.iSloading=false;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                });
        }, function() {
        });
    }

    function predmCheng(ev){
        $mdDialog.show({
            controller: SubjectDialogCtrl,
            controllerAs: 'vm',
            templateUrl: 'app/component/subjectDialog/subjectDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        }).then(function() {
            vm.param = {
                compData: $appFactory.getCompData(),
                studentToken: vm.userData.studentToken
            };
            $appFactory.getTestSubjectList(vm.param)
                .then(function (data) {
                    vm.iSloading =true;
                    data = data.data;
                    if (data.errorCode == 0) {
                        vm.subjects = data.subjects;
                        saveSessionStorage('subjects', vm.subjects);
                        vm.subjectId = vm.subjects[0].subjectId;
                        vm.subjectData = vm.subjects[0].receivedAnswers;
                        saveVopSession();
                        getAnswersDistr();
                        loadItem(vm.subjects[0].subjectId, 1);
                        //TimerMan()
                    } else {
                        if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                .textContent(vm.errorMsg)
                                .ariaLabel(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                .ok(vm.rs.slovar[21][vm.rs.idLang])
                        );
                        if (data.errorCode == 3){
                            removeTestData();
                            $state.go("login");
                        }
                        vm.stopTime = 1;
                        removeTestData();
                        $state.go("login");
                    }
                },
                function (result){
                    vm.iSloading=false;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                });
        }, function(){
        })
    }

    function getHelp(ev){
        $mdDialog.show({
            controller: HelpCtrl,
            controllerAs: 'vm',
            templateUrl: 'app/component/help/help.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }

    function getNoUseVop(){
        vm.noUseVop = [];
        for (var i = 0; i<vm.subjects.length; i++){
            var noUse = 0;
            for (var a=0; a<vm.subjects[i].receivedAnswers.length; a++){
                if (vm.subjects[i].receivedAnswers[a].questionType==1){
                    if (vm.subjects[i].receivedAnswers[a].answer=="") noUse++;
                }else{
                    if (vm.subjects[i].receivedAnswers[a].answer.length==0) noUse++;
                }
            }
            vm.noUseVop.push(noUse);
        }
    }

    function keyPress(){
        switch (event.keyCode){
            case 37:
                prev();
                break;
            case 39:
                next();
                break;
        }
    }

    function saveVopSession(){
        vm.questions = $sessionStorage.getData('questions');
        if (vm.questions == null){
            vm.questions = [];
            for (var i=0; i<vm.subjects.length; i++){
                var questions = [];
                for (var a=0; a<vm.subjects[i].receivedAnswers.length; a++){
                    var question = {
                        questionType: 0,
                        additionalTextId: 0,
                        additionalTextUrl:'',
                        additionalTextTypeId:0,
                        questionUrl:'',
                        answers: []
                    };
                    questions.push(question);
                }

                var subject = {
                    subjectId : vm.subjects[i].subjectId,
                    question : questions
                };
                vm.questions.push(subject);
            }
            saveSessionStorage('questions', vm.questions);
        }
    }

    function saveSessionStorage(key, val){
        $sessionStorage.setData(key, val);
    }

    function removeTestData(){
        $sessionStorage.removeData('studentData');
        $sessionStorage.removeData('user');
        $sessionStorage.removeData('time');
        //----------------------------------------
        $sessionStorage.removeData('subjects');
        $sessionStorage.removeData('questions');
        $sessionStorage.removeData('noUseVop');
        $sessionStorage.removeData('sessionVop');
    }

    function pauseTest(ev){
        var confirm = $mdDialog.confirm()
            .title(vm.rs.slovar[6][vm.rs.idLang])
            .textContent(vm.rs.slovar[45][vm.rs.idLang])
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok(vm.rs.slovar[37][vm.rs.idLang])
            .cancel(vm.rs.slovar[34][vm.rs.idLang]);

        $mdDialog.show(confirm).then(function() {
            $appFactory.setPause($appFactory.getCompData(), vm.userData.studentToken)
                .then(function (data) {
                    data = data.data;
                    if (data.errorCode == 0) {
                        vm.timeLeft = data.testTimeLeft;
                        vm.stopTime = 2;
                        $state.go("pause");
                    } else {

                        if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                .ok(vm.rs.slovar[21][vm.rs.idLang])
                        );
                        if (data.errorCode == 2){
                            vm.stopTime = 1;
                            $appFactory.closeTest(vm.userData.studentToken);
                            removeTestData();
                            $state.go("login");
                        }
                    }
                },
                function (result){
                    vm.iSloading=false;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                });
        }, function() {
        });
    }

    function TimerMan(){
        if ((vm.getTimeNow<1)||(vm.timeLeft<1)){
            getTime();
            if (vm.stopTime == 0) vm.getTimeNow=60;
        }else
        {
            vm.getTimeNow--;
            vm.timeLeft--;
        }
        var t = (vm.timeLeft - (integerDivision(vm.timeLeft, 60)*60));
        if (t<10){t='0'+t}
        vm.testTime = integerDivision(vm.timeLeft, 60) + ' : ' + t;
        if (vm.stopTime == 0) {
            $timeout(TimerMan,1000)
        }
        //else{
        //    if (vm.stopTime == 1){
        //        removeTestData();
        //        $state.go("login");
        //    }
        //}
    }

    function getTimeForLeft(){
        var t = (vm.timeLeft - (integerDivision(vm.timeLeft, 60)*60));
        if (t<10){t='0'+t}
        vm.testTime = integerDivision(vm.timeLeft, 60) + ' : ' + t;
        if (vm.stopTime==0){
            //$timeout(getTimeForLeft,1000)
        }else{
            if (vm.stopTime == 1){
                removeTestData();
                $state.go("login");
            }
        }
    }

    function integerDivision(x, y){
        return (x-x%y)/y
    }

    function getOrderById(id){
        for (var i=0; i<vm.subjects.length;i++){
            if (vm.subjects[i].subjectId==id){
                return vm.subjects[i].subjectOrd-1;
            }
        }
    }

    function getTime(){
        if (vm.stopTime==0){
            $appFactory.getTimeLeft($appFactory.getCompData(), vm.userData.studentToken)
                .then(function (data) {
                    data = data.data;
                    if (data.errorCode == 0) {
                        vm.timeLeft = data.testTimeLeft;
                    } else {
                        if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                .textContent(vm.errorMsg)
                                .ariaLabel(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                .ok(vm.rs.slovar[21][vm.rs.idLang])
                        );
                        if (data.errorCode == 3){
                            vm.stopTime = 1;
                            $appFactory.closeTest(vm.userData.studentToken);
                            removeTestData();
                            $sessionStorage.setData('studentData', vm.userData);
                            $state.go("card");
                            //$state.go("login");
                        }
                        if (data.errorCode == 2){
                            vm.stopTime = 1;
                            //$appFactory.closeTest(vm.userData.studentToken);
                            removeTestData();
                            $state.go("login");
                        }
                    }
                },
                function (result){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                });
        }
    }

    function loadSubjects() {
        vm.subjects = $sessionStorage.getData('subjects');
        if (vm.subjects!=null && vm.subjects.length>0){
            vm.iSloading =true;
            vm.subjectId = vm.subjects[0].subjectId;
            vm.subjectData = vm.subjects[0].receivedAnswers;

            saveVopSession();

            getAnswersDistr();
            vm.started = $sessionStorage.getData('time');
            vm.NumVop = 1;
            vm.stopTime = 0;

            if (vm.started != 1) {
                start();
            } else {
                //TimerMan();
                if (vm.sessionVop.idSubject != 0 && vm.sessionVop.numItem != 0)
                { loadItem(vm.sessionVop.idSubject, vm.sessionVop.numItem) }
                else
                { loadItem(vm.subjects[0].subjectId, 1) }
            }

            vm.subjectId = vm.sessionVop.idSubject;
            vm.subjectData = vm.subjects[getOrderById(vm.subjectId)].receivedAnswers;

        }else{
             vm.param = {
                 compData: $appFactory.getCompData(),
                 studentToken: vm.userData.studentToken
             };
            $appFactory.getTestSubjectList(vm.param)
                .then(function (data) {
                    vm.iSloading =true;
                    data = data.data;
                    if (data.errorCode == 0) {
                        vm.subjects = data.subjects;
                        $sessionStorage.setData('studentData', vm.userData);
                        saveSessionStorage('subjects', vm.subjects);

                        vm.subjectId = vm.subjects[0].subjectId;
                        vm.subjectData = vm.subjects[0].receivedAnswers;
                        saveVopSession();
                        getAnswersDistr();
                        vm.started = $sessionStorage.getData('time');
                        vm.NumVop = 1;
                        vm.stopTime = 0;

                        if (vm.started != 1) {
                            start();
                        } else {
                            //TimerMan();
                            if (vm.sessionVop.idSubject != 0 && vm.sessionVop.numItem != 0)
                            { loadItem(vm.sessionVop.idSubject, vm.sessionVop.numItem) }
                            else
                            { loadItem(vm.subjects[0].subjectId, 1) }
                        }
                    } else {
                        if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                .textContent(vm.errorMsg)
                                .ariaLabel(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                .ok(vm.rs.slovar[21][vm.rs.idLang])
                        );
                        if (data.errorCode == 3){
                            removeTestData();
                            $state.go("login");
                        }
                        vm.stopTime = 1;
                        removeTestData();
                        $state.go("login");
                    }
                },
                function (result){
                    vm.iSloading=false;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                });
        }
    }

    // start test
    function start() {
        vm.iSloading = false;
        $appFactory.startTest($appFactory.getCompData(), vm.userData.studentToken).then(function (data) {
                data = data.data;
                vm.iSloading = true;
                if (data.errorCode == 0) {
                    //TimerMan();
                    //vm.timeLeft = data.testTimeLeft;
                    //getTimeForLeft();
                    //vm.loadItem(1, vm.NumVop);
                    if (vm.sessionVop.idSubject != 0 && vm.sessionVop.numItem != 0)
                    { loadItem(vm.sessionVop.idSubject, vm.sessionVop.numItem) }
                    else
                    { loadItem(vm.subjects[0].subjectId, 1) }

                    vm.started = 1;
                    $sessionStorage.setData('time',vm.started);
                } else {
                    if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                            .textContent(vm.errorMsg)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                    if (data.errorCode == 3){
                        removeTestData();
                        $state.go("login");
                    }
                    vm.stopTime = 1;
                    removeTestData();
                    $state.go("login");
                }
            },
            function (result){
                vm.iSloading=false;
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title(vm.rs.slovar[19][vm.rs.idLang])
                        .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                        .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                        .ok(vm.rs.slovar[21][vm.rs.idLang])
                );
            });
    }

    // load item by idSubject and numItem
    function loadItem(idSubject, numItem) {
        vm.sessionVop = {
            idSubject: idSubject,
            numItem: numItem
        };

        saveSessionStorage('sessionVop', vm.sessionVop);

        var newHash = 'anchor' + numItem;
        if ($location.hash() !== newHash) {
            $location.hash('anchor' + numItem);
        } else {
            $anchorScroll();
        }

        vm.questions = $sessionStorage.getData('questions');
        if (vm.questions[getOrderById(idSubject)].question[numItem-1].questionType!=0){
            //
        }else{
            //
        }

        if (vm.iSloading!=false){
            vm.iSloading=false;
            $appFactory.getItem(vm.userData.studentToken, idSubject, numItem).then(function (data) {
                    data = data.data;
                    vm.iSloading=true;
                    if (data.errorCode == 0) {
                        //vm.timeLeft = data.testTimeLeft;
                        //getTimeForLeft();
                        vm.subjectId = idSubject;
                        vm.NumVop = numItem;
                        vm.item.questionType = data.question.questionType;
                        vm.item.additionalTextId = data.question.additionalTextId;
                        vm.item.additionalTextTypeId = data.question.additionalTextTypeId;
                        if (vm.item.additionalTextId != 0){
                            if (vm.item.additionalTextTypeId==2)
                            {
                                vm.item.additionalText = "/" + data.question.additionalTextUrl;
                            }else
                            {
                                vm.http.get(data.question.additionalTextUrl)
                                    .success(function(_data) {
                                        vm.item.additionalText = _data;
                                    });
                            }
                        }

                        vm.http.get(data.question.questionUrl)
                            .success(function(_data) {
                                vm.item.question = _data;
                            });

                        vm.item.answers = [];
                        for (var i=0;i<data.question.answers.length;i++){
                            vm.item.answers[i] = {};
                            vm.item.answers[i].id = data.question.answers[i].answerNum;
                            vm.item.answers[i].ansText = '0';
                            getHttpText(data.question.answers[i].answerUrl, i);
                            vm.item.answers[i].isSelected = data.question.answers[i].isSelected;
                        }

                        window.scrollTo(0, 0);

                    } else {
                        if (data.errorCode == 2){
                            if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                    .textContent(vm.errorMsg)
                                    .ariaLabel(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                    .ok(vm.rs.slovar[21][vm.rs.idLang])
                            );
                            vm.stopTime = 1;
                            removeTestData();
                            $state.go("login");
                        }else{
                            if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                    .textContent(vm.errorMsg)
                                    .ariaLabel(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                    .ok(vm.rs.slovar[21][vm.rs.idLang])
                            );
                            if (data.errorCode == 3){
                                removeTestData();
                                $state.go("login");
                            }
                        }
                    }
                },
                function (result){
                    vm.iSloading=true;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                });
        }else{
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(vm.rs.slovar[6][vm.rs.idLang])
                    .textContent(vm.rs.slovar[36][vm.rs.idLang])
                    .ariaLabel(vm.rs.slovar[6][vm.rs.idLang])
                    .ok(vm.rs.slovar[21][vm.rs.idLang])
            );
            vm.iSloading=true;
        }
    }

    function prev() {
        if (vm.iSloading!=false){
            if (vm.NumVop > 1){
                vm.NumVop = vm.NumVop - 1;
                loadItem(vm.subjectId, vm.NumVop);
            }else{
                if ((getOrderById(vm.subjectId))>0){
                    vm.subjectId = vm.subjects[getOrderById(vm.subjectId)-1].subjectId;
                    loadItem(vm.subjectId, vm.subjects[getOrderById(vm.subjectId)].receivedAnswers.length);
                    vm.subjectData = vm.subjects[0].receivedAnswers;
                    vm.subjectData = vm.subjects[getOrderById(vm.subjectId)].receivedAnswers;
                    getAnswersDistr();
                }else
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[28][vm.rs.idLang])
                            .textContent(vm.rs.slovar[30][vm.rs.idLang])
                            .ariaLabel(vm.rs.slovar[30][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
            }
        }else{
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(vm.rs.slovar[6][vm.rs.idLang])
                    .textContent(vm.rs.slovar[36][vm.rs.idLang])
                    .ariaLabel(vm.rs.slovar[6][vm.rs.idLang])
                    .ok(vm.rs.slovar[21][vm.rs.idLang])
            );
        }
    }

    function next() {
        if (vm.iSloading!=false){
            if (vm.NumVop < vm.subjectData.length){
                vm.NumVop = vm.NumVop + 1;
                loadItem(vm.subjectId, vm.NumVop);
            }else{
                if ((getOrderById(vm.subjectId)+1)<vm.subjects.length){
                    vm.subjectId = vm.subjects[getOrderById(vm.subjectId)+1].subjectId;
                    loadItem(vm.subjectId, 1);
                    vm.subjectData = vm.subjects[0].receivedAnswers;
                    vm.subjectData = vm.subjects[getOrderById(vm.subjectId)].receivedAnswers;
                    getAnswersDistr();
                }else
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[28][vm.rs.idLang])
                            .textContent(vm.rs.slovar[29][vm.rs.idLang])
                            .ariaLabel(vm.rs.slovar[29][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
            }
        }else{
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(vm.rs.slovar[6][vm.rs.idLang])
                    .textContent(vm.rs.slovar[36][vm.rs.idLang])
                    .ariaLabel(vm.rs.slovar[6][vm.rs.idLang])
                    .ok(vm.rs.slovar[21][vm.rs.idLang])
            );
        }
    }
    /////////
    function buildToggler(navID) {
        return function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }
    }

    vm.toggleLeft = buildToggler('left');
    vm.isOpenLeft = function () {
        return $mdSidenav('left').isOpen();
    };

    function getHttpText(_inText,_indx){
        vm.http.get(_inText)
            .success(function(_data) {
                vm.item.answers[_indx].ansText = _data;
            });
    }

    function getAnswersDistr(){
        for (var i=0; i<vm.subjectData.length; i++){
            if (vm.subjectData[i].questionType==2){
                var tmpStringAns = '';
                for (var a=0; a<vm.subjectData[i].answer.length; a++){
                    tmpStringAns = tmpStringAns + vm.subjectData[i].answer[a];
                }
                vm.subjectData[i].answer = tmpStringAns;
            }
        }
    }

    function closeDialog(ev){
        getNoUseVop();
        $sessionStorage.setData('noUseVop', vm.noUseVop);
        $mdDialog.show({
            controller: CloseCtrl,
            controllerAs: 'vm',
            templateUrl: 'app/component/closeDialog/closeDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        }).then(function() {
        }, function(){
            vm.closeStatus = $sessionStorage.getData('closeStatus');
            if (vm.closeStatus==1 && vm.iSloading!= false){
                vm.iSloading = false;
                $appFactory.closeTest(vm.userData.studentToken).then(function (data) {
                    data = data.data;
                    if (data.errorCode == 0) {
                        vm.stopTime = 2;
                        vm.iSloading = true;
                        removeTestData();
                        $sessionStorage.setData('studentData', vm.userData);
                        $state.go("card");
                        //$state.go("login");
                    } else {
                        if (data.errorCode == 2){
                            if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                    .textContent(vm.errorMsg)
                                    .ariaLabel(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                    .ok(vm.rs.slovar[21][vm.rs.idLang])
                            );
                            vm.stopTime = 1;
                            removeTestData();
                            $state.go("login");
                        }else{
                            if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                    .textContent(vm.errorMsg)
                                    .ariaLabel(vm.rs.slovar[19][vm.rs.idLang] + ' №' + data.errorCode)
                                    .ok(vm.rs.slovar[21][vm.rs.idLang])
                            );
                            if (data.errorCode == 3){
                                removeTestData();
                                $state.go("login");
                            }
                        }
                    }
                }, function(result){
                    vm.iSloading=true;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                });
            }
        })
    }

    function browserDetect(){
        vm.browsInfo = "";
        vm.browsId = $appFactory.initDataBrowser();

        switch (vm.browsId.browser) {
            case "Chrome":
                if (vm.browsId.version<41){
                    vm.browsInfo = vm.rs.slovar[52][vm.rs.idLang]+vm.browsId.browser+' '+vm.rs.slovar[53][vm.rs.idLang];
                }
            break;
            case "Firefox":
                if (vm.browsId.version<44){
                    vm.browsInfo = vm.rs.slovar[52][vm.rs.idLang]+vm.browsId.browser+' '+vm.rs.slovar[53][vm.rs.idLang];
                }
            break;
            default:
                vm.browsInfo = vm.rs.slovar[54][vm.rs.idLang];
            break;
        }
    }
    ////////
}
;'use strict';

angular.module('untApp').component('test', {
    templateUrl: 'app/test/test.html',
    controller: TestCtrl,
    controllerAs: 'vm'
});

/**
 * Created by k.zharenov on 10.03.2016.
 */
;'use strict';
function CloseCtrl($mdDialog, $sessionStorage, $appFactory) {
    var vm = this;

    vm.$mdDialog = $mdDialog;

    vm.cancel = cancel;
    vm.confirm = confirm;
    vm.sum = '';
    vm.noShow = false;

    activate();

    function activate() {
        $sessionStorage.removeData('closeStatus');
        vm.rs = $sessionStorage.getData('rs');
        vm.noUseVop = $sessionStorage.getData('noUseVop');
        vm.subjects = $sessionStorage.getData('subjects');
        vm.noUseText = "";

        for (var i=0; i<vm.noUseVop.length; i++){
            if (vm.noUseVop[i]>0) vm.noShow = true;
        }

        for (var i=0; i<vm.subjects.length; i++){
            if (vm.rs.idLang==0){
                vm.noUseText = vm.noUseText + vm.subjects[i].subjectNameKaz + ": " + vm.noUseVop[i] + ";\n";
            }else{
                vm.noUseText = vm.noUseText + vm.subjects[i].subjectNameRus + ": " + vm.noUseVop[i] + ";\n";
            }
        }

        vm.rs.slovar = $appFactory.appData.slovar;
        vm.userData = $sessionStorage.getData('studentData');
        vm.a1 = Math.round((Math.random() * (9 - 1) + 1));
        vm.a2 = Math.round((Math.random() * (9 - 1) + 1));
        vm.trueSum = vm.a1 + vm.a2;
    };

    function cancel(){
        $sessionStorage.setData('closeStatus', 0);
        $mdDialog.cancel();
    };

    function confirm(){
        if (vm.sum.length > 0){
            if (vm.sum == vm.trueSum) {
                $sessionStorage.setData('closeStatus', 1);
                $mdDialog.cancel();
            } else {
                    vm.errorLabel = vm.rs.slovar[41][vm.rs.idLang];
            }
        } else {
            vm.errorLabel = vm.rs.slovar[41][vm.rs.idLang];
        }
    }
};
;'use strict';
function HelpCtrl($sessionStorage, $appFactory, $mdDialog, $http) {

    var vm = this;
    vm.http = $http;

    vm.iSloading = $appFactory.appData.loading;
    vm.descr = '';

    vm.cancel = cancel;

    activate();

    function activate(){
        vm.rs = $sessionStorage.getData('rs');
        vm.rs.slovar = $appFactory.appData.slovar;
        var lan = vm.rs.idLang+1;
        vm.http.get('./help/' + lan + '/help.htm')
            .success(function(_data) {
                vm.descr = _data;
                vm.iSloading = true;
            });
    }

    function cancel(){
        $mdDialog.cancel();
    }
}


angular.module('untApp').component('help', {
    templateUrl: 'app/component/help/help.html',
    controller: HelpCtrl,
    controllerAs: 'vm'
});

;'use strict';
function ItemCtrl($appFactory, $sessionStorage, $mdDialog, $document) {
    var ctrl = this;

    ctrl.rs = $sessionStorage.getData('rs');
    ctrl.rs.slovar = $appFactory.appData.slovar;

    ctrl.letter = letter;
    ctrl.select = select;
    ctrl.getRadiobtn = getRadiobtn;
    ctrl.getCheckBox = getCheckBox;
    ctrl.loadBack = loadBack;
    ctrl.audioPlayer = audioPlayer;
    ctrl.CtrladditionalTextId = 0;
    ctrl.getPredmLang = getPredmLang;

    function getPredmLang(){
        ctrl.rs = $sessionStorage.getData('rs');
    }

    function loadBack(){
        ctrl.testCtrl.subjectData = $sessionStorage.getData('tmpSubjectData');
        $sessionStorage.removeData('tmpSubjectData');
    }

    function audioPlayer(){
        ctrl.player = document.querySelector("#player");
        if (ctrl.item.additionalTextTypeId==2){
            if (ctrl.CtrladditionalTextId != ctrl.item.additionalTextId){
                ctrl.CtrladditionalTextId = ctrl.item.additionalTextId;
                ctrl.player.load();
                //ctrl.player.play();
            }
        }
    }

    function letter(idx){
        return String.fromCharCode(64 + parseInt(idx));
    }

    function getRadiobtn(){
        ctrl.item.selectedAnswerId=0;
        for (var i = 0;i<ctrl.item.answers.length; i++){
            if (ctrl.item.answers[i].isSelected!=0) ctrl.item.selectedAnswerId=ctrl.item.answers[i].id;
        }
    }

    function getCheckBox(id){
        return ctrl.item.answers[id-1].isSelected!=0;
    }

    function select(answerId){
        $sessionStorage.setData('tmpSubjectData', ctrl.testCtrl.subjectData);
        ctrl.item.selected = answerId;
        ctrl.answer = {
            subjectId: ctrl.testCtrl.subjectId,
            questionNum: ctrl.testCtrl.NumVop,
            answerOrd: answerId,
            isSelected: 0
        };

        switch (ctrl.item.questionType){
            case 1:
                if (ctrl.item.answers[answerId-1].isSelected!=1){
                    ctrl.testCtrl.subjectData[ctrl.testCtrl.NumVop-1].answer = ctrl.letter(answerId);
                    for (var i=0;i<ctrl.item.answers.length;i++){
                        ctrl.item.answers[i].isSelected=0;
                        ctrl.answer.isSelected = 0;
                    }
                    ctrl.item.answers[answerId-1].isSelected=1;
                    ctrl.answer.isSelected = 1;
                }else{
                    ctrl.item.answers[answerId-1].isSelected=0;
                    ctrl.testCtrl.subjectData[ctrl.testCtrl.NumVop-1].answer = "";
                    ctrl.answer.isSelected = 0;
                }
            break;
            case 2:
                if (ctrl.item.answers[answerId-1].isSelected!=1){
                    ctrl.testCtrl.subjectData[ctrl.testCtrl.NumVop-1].answer = ctrl.letter(answerId);
                    ctrl.item.answers[answerId-1].isSelected=1;
                    ctrl.answer.isSelected = 1;
                }else{
                    ctrl.item.answers[answerId-1].isSelected=0;
                    ctrl.testCtrl.subjectData[ctrl.testCtrl.NumVop-1].answer = "";
                    ctrl.answer.isSelected = 0;
                }
            break;
        }

        if (ctrl.item.questionType==2){
            var tmpAnsStr = "";
            ctrl.testCtrl.subjectData[ctrl.testCtrl.NumVop-1].answer = "";
            for (var i=0; i<ctrl.item.answers.length;i++){
                if (ctrl.item.answers[i].isSelected==1){
                    tmpAnsStr = tmpAnsStr + ctrl.letter(i+1);
                }
            }
            ctrl.testCtrl.subjectData[ctrl.testCtrl.NumVop-1].answer = tmpAnsStr;
        }

            $appFactory.setAnswer(ctrl.testCtrl.userData.studentToken, ctrl.answer).then(function (data) {
                data = data.data;

            if (data.errorCode == 0) {
                ctrl.testCtrl.subjects[ctrl.testCtrl.getOrderById(ctrl.testCtrl.subjectId)].receivedAnswers = ctrl.testCtrl.subjectData;
                ctrl.testCtrl.saveSessionStorage('subjects', ctrl.testCtrl.subjects);
                $sessionStorage.removeData('tmpSubjectData');

                ctrl.testCtrl.timeLeft = data.testTimeLeft;
                ctrl.testCtrl.getTimeForLeft()
            } else {
                if ((data.errorCode == 2)|| (data.errorCode == 3)){
                    loadBack();
                    if (ctrl.rs.idLang==0){ctrl.errorMsg=data.errorMsgKaz}else{ctrl.errorMsg=data.errorMsgRus};
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(ctrl.rs.slovar[19][ctrl.rs.idLang] + ' №' + data.errorCode)
                            .textContent(ctrl.errorMsg)
                            .ariaLabel(ctrl.rs.slovar[19][ctrl.rs.idLang] + ' №' + data.errorCode)
                            .ok(ctrl.rs.slovar[21][ctrl.rs.idLang])
                    );
                    $sessionStorage.removeData('studentData');
                    $state.go("login");
                }else{
                    loadBack();
                    if (ctrl.rs.idLang==0){ctrl.errorMsg=data.errorMsgKaz}else{ctrl.errorMsg=data.errorMsgRus};
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(ctrl.rs.slovar[19][ctrl.rs.idLang] + ' №' + data.errorCode)
                            .textContent(ctrl.errorMsg)
                            .ariaLabel(ctrl.rs.slovar[19][ctrl.rs.idLang] + ' №' + data.errorCode)
                            .ok(ctrl.rs.slovar[21][ctrl.rs.idLang])
                    );
                }
            }
        },
                function (result){
                    loadBack();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(ctrl.rs.slovar[19][ctrl.rs.idLang])
                            .textContent(ctrl.rs.slovar[19][ctrl.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                            .ariaLabel(ctrl.rs.slovar[19][ctrl.rs.idLang])
                            .ok(ctrl.rs.slovar[21][ctrl.rs.idLang])
                    );
                });
    }
}

angular.module('untApp').component('item', {
    templateUrl: 'app/component/item/item.html',
    controller: ItemCtrl,
    bindings: {
        item: '='
    },
    require: {
        testCtrl: '^test'
    }
});

/**
 * Created by k.zharenov on 10.03.2016.
 */
;'use strict';
function PassCtrl($mdDialog, $sessionStorage, $appFactory, $state) {
    var vm = this;

    vm.$mdDialog = $mdDialog;
    vm.iSloading = true;

    vm.cancel = cancel;
    vm.passEnter = passEnter;

    activate();

    function activate() {
        vm.rs = $sessionStorage.getData('rs');
        vm.rs.slovar = $appFactory.appData.slovar;
        vm.user = $sessionStorage.getData('user');
    };

    function cancel(){
        $mdDialog.cancel();
    };

    function passEnter(){
        var studentData =  {
            "studentTestId": vm.user.studentTestId,
            "password": vm.user.password,
            "additionalPassword": vm.user.additionalPass
        };

        if (vm.user.password.length > 0 && vm.user.additionalPass.length > 0 && vm.iSloading != false) {
            vm.iSloading = false;
            vm.response = {
                compData: $appFactory.getCompData(),
                studentData: studentData
            };
            $appFactory.login(vm.response).then(function (data) {
                    vm.iSloading = true;
                    data = data.data;
                if (data.errorCode == 0) {
                    $sessionStorage.setData('studentData', data.studentData);
                    vm.errorLabel = '';
                    $mdDialog.cancel();
                    vm.rs.idLang = data.studentData.testIdLang-1;
                    //------------------------------------------
                    $sessionStorage.removeData('subjects');
                    $sessionStorage.removeData('questions');
                    //------------------------------------------
                    switch (data.studentData.idTestStatus){
                        case 0:
                            $state.go('info');
                        break;
                        case 1:
                            $sessionStorage.setData('time', 0);
                            $state.go('test');
                        break;
                        //case 5:
                        //    $sessionStorage.setData('time', 0);
                        //    $state.go('test');
                        break;
                        //case 7:
                        //    $sessionStorage.setData('time', 0);
                        //    $state.go('test');
                        //break;
                        case 2:
                            $state.go("anketa");
                            break;
                        case 3:
                            $state.go("card");
                        break;
                        //case 9:
                        //    vm.stopTime = 2;
                        //    $state.go("pause");
                        //break;
                    }
                } else {
                    if (vm.rs.idLang==0){vm.errorLabel=data.errorMsgKaz}else{vm.errorLabel=data.errorMsgRus};
                }
            },
                function (result){
                    vm.iSloading = true;
                    vm.errorLabel = vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText;
                });

        } else {
            if (vm.iSloading != false){
                vm.errorLabel = vm.rs.slovar[8][vm.rs.idLang];
            }else {vm.errorLabel = vm.rs.slovar[36][vm.rs.idLang]}
        }
    }
};
;'use strict';
function RatingCtrl($appFactory, $sessionStorage) {
    var ctrl = this;
    ctrl.iSloading = true;

    ctrl.rs = $sessionStorage.getData('rs');
    ctrl.rs.slovar = $appFactory.appData.slovar;
    ctrl.studentToken = $sessionStorage.getData('studentData');
    ctrl.studentToken = ctrl.studentToken.studentToken;

    ctrl.firstRate = 0;
    ctrl.canselStat = 0;

    ctrl.getWordLang = function(){
        ctrl.rs = $sessionStorage.getData('rs');
    }

    ctrl.setRating = function(){
        if (ctrl.iSloading==true) {
            ctrl.iSloading = false;
            $appFactory.setRatingStatus(ctrl.studentToken, ctrl.firstRate).then(function (data) {
                    ctrl.iSloading = true;
                    data = data.data;
                    if (data.errorCode == 0) {
                        ctrl.canselStat = 1;
                    } else {
                        if (ctrl.rs.idLang==0){ctrl.errorLabel=data.errorMsgKaz}else{ctrl.errorLabel=data.errorMsgRus}
                    }
                },
                function (result){
                    ctrl.iSloading = true;
                    ctrl.errorLabel = ctrl.rs.slovar[19][ctrl.rs.idLang] + ' ' + result.status + ' ' + result.statusText;
                });
        }
    }
}

angular.module('untApp').component('rating', {
    templateUrl: 'app/component/rating/rating.html',
    controller: RatingCtrl,
    bindings: {
        rating: '='
    }
});

/**
 * Created by k.zharenov on 10.03.2016.
 */
;'use strict';
function recoverCtrl($mdDialog, $sessionStorage, $appFactory) {
    var vm = this;

    vm.$mdDialog = $mdDialog;
    vm.iSloading = true;
    vm.canselStat = 0;

    vm.cancel = cancel;
    vm.confirm = confirm;
    vm.iin = '';

    activate();

    function activate() {
        vm.rs = $sessionStorage.getData('rs');
        vm.rs.slovar = $appFactory.appData.slovar;
        vm.userData = $sessionStorage.getData('studentData');
    }

    function cancel(){
        $mdDialog.cancel();
    }

    function confirm(){
        if (vm.iin.length > 0 && vm.iSloading != false) {
            vm.iSloading = false;
            $appFactory.getRecuverPass(vm.iin).then(function (data) {
                    vm.iSloading = true;
                    data = data.data;
                    if (data.errorCode == 0) {
                        vm.errorLabel = vm.rs.slovar[101][vm.rs.idLang];
                        vm.canselStat = 1;
                    } else {
                        if (vm.rs.idLang==0){vm.errorLabel=data.errorMsgKaz}else{vm.errorLabel=data.errorMsgRus}
                    }
                },
                function (result){
                    vm.iSloading = true;
                    vm.errorLabel = vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText;
                });
        } else {
            if (vm.iSloading != false){
                vm.errorLabel = vm.rs.slovar[100][vm.rs.idLang];
            }else {vm.errorLabel = vm.rs.slovar[36][vm.rs.idLang]}
        }
    }
};
;'use strict';
function SubjectDialogCtrl($sessionStorage, $appFactory, $mdDialog) {
    var vm = this;

    vm.iSloading = $appFactory.appData.loading;
    vm.optionalSubject = -1;

    vm.errorLabel = '';

    vm.getSubjectById = getSubjectById;
    vm.proceed = proceed;
    vm.Cancel = Cancel;
    vm.openPredm = openPredm;
    vm.getPredmLang = getPredmLang;
    vm.radioClick = radioClick;
    vm.clickKZ = clickKZ;
    vm.clickRU = clickRU;
    vm.getPredmsList = getPredmsList;
    vm.selectEntSubject = selectEntSubject;

    vm.langTest = [
        { label: 'Қазақша', value: 1},
        { label: 'Русский', value: 2}
    ];

    vm.typeTest = [
        { labelRus: 'ЕНТ/КТ', labelKaz: 'ҰБТ/КТ', value: 1},
        { labelRus: 'КТ ТиПО', labelKaz: 'ТКТ ТжКБ', value: 2}
    ];
    activate();

    function  activate(){
        vm.rs = $sessionStorage.getData('rs');
        vm.rs.slovar = $appFactory.appData.slovar;
        vm.userData = $sessionStorage.getData('studentData');

        getPredmsList();
    }

    function getPredmsList(){
        vm.optionalSubject = -1;

        vm.subjectList = [];
        vm.requestParam = {
            studentToken: vm.userData.studentToken,
            testIdLang: vm.userData.testIdLang
        };
        $appFactory.getSubjectList(vm.requestParam).then(function (data) {
                data = data.data;
                if (data.errorCode == 0) {
                    vm.subjectList = data.subjects;
                    vm.subjects = $sessionStorage.getData('subjects');

                } else {
                    if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.errorMsg)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                }
            },
            function (result){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title(vm.rs.slovar[19][vm.rs.idLang])
                        .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                        .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                        .ok(vm.rs.slovar[21][vm.rs.idLang])
                );
            })
    }

    function selectEntSubject(nameKaz,nameRus){
        if(vm.rs.idLang==0){
            vm.SubjectName = nameKaz;
        }else{
            vm.SubjectName = nameRus;
        }
    }

    function radioClick(_val){
        if (_val==2){
            vm.userData.testIdLang = 2;
            //saveSessionStorage('studentData', vm.userData);
        }
        else {
            vm.userData.testIdLang = 1;
            //saveSessionStorage('studentData', vm.userData);
        }
        getPredmsList();
    }



    function clickRU() {
        vm.rs.idLang = 1;
        saveSessionStorage('rs', vm.rs);
    }

    function clickKZ() {
        vm.rs.idLang = 0;
        saveSessionStorage('rs', vm.rs);
    }

    function getPredmLang(){
        vm.rs = $sessionStorage.getData('rs');
        vm.userData = $sessionStorage.getData('studentData');
    }

     function getSubjectById(subjectId) {
        for (var i = 0; i < vm.subjectList.length; i++) {
            if (vm.subjectList[i].idSubject == subjectId) {
                if (vm.rs.idLang==1) {return vm.subjectList[i].subjectNameRus}else{return vm.subjectList[i].subjectNameKaz}
            }
        }
        return '';
    }

    function Cancel(){
        $mdDialog.cancel();
    }

    function openPredm(){
        vm.errorLabel = '';
    }

    function proceed () {
        if (vm.optionalSubject >= 0) {
            vm.requestParam = {
                studentToken: vm.userData.studentToken, /*ID сочетания ученик-тестирование*/
                lastname: vm.userData.lastname,
                firstname: vm.userData.firstname,
                patronymic: vm.userData.patronymic,
                testIdLang: vm.userData.testIdLang, /*Код языка тестирования*/
                optionalIdSubject: vm.optionalSubject /*Код профилирующего предмета*/

            }
        $appFactory.setSubject(vm.requestParam)
            .then(function (data) {
                data = data.data;
                if (data.errorCode == 0) {
                    saveSessionStorage('studentData', vm.userData);
                    $mdDialog.hide();
                } else {
                    if (vm.rs.idLang==0){vm.errorMsg=data.errorMsgKaz}else{vm.errorMsg=data.errorMsgRus}
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(vm.rs.slovar[19][vm.rs.idLang])
                            .textContent(vm.errorMsg)
                            .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                            .ok(vm.rs.slovar[21][vm.rs.idLang])
                    );
                }
            },
            function (result){
                vm.iSloading=false;
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title(vm.rs.slovar[19][vm.rs.idLang])
                        .textContent(vm.rs.slovar[19][vm.rs.idLang] + ' ' + result.status + ' ' + result.statusText)
                        .ariaLabel(vm.rs.slovar[19][vm.rs.idLang])
                        .ok(vm.rs.slovar[21][vm.rs.idLang])
                );
            });
        } else {
            vm.errorLabel = vm.rs.slovar[19][vm.rs.idLang] + ': ' + vm.rs.slovar[58][vm.rs.idLang];
        }
    }

    function saveSessionStorage(key, val){
        $sessionStorage.setData(key, val);
    }
}


;'use strict';
function SubjectListCtrl($sessionStorage, $appFactory) {
    var ctrl = this;

    ctrl.rs = $sessionStorage.getData('rs');
    ctrl.rs.slovar = $appFactory.appData.slovar;

    ctrl.loadSubject = function (subjectId) {
        ctrl.testCtrl.loadItem(subjectId, 1);
        ctrl.testCtrl.subjectData = ctrl.testCtrl.subjects[ctrl.getOrderById(subjectId)].receivedAnswers;
        ctrl.testCtrl.getAnswersDistr();
        // ctrl.testCtrl.close();
    };

    ctrl.getOrderById = function(id){
        for (var i=0; i<ctrl.testCtrl.subjects.length;i++){
            if (ctrl.testCtrl.subjects[i].subjectId==id){
                return ctrl.testCtrl.subjects[i].subjectOrd-1;
            }
        }
    };

    ctrl.getPredmLang = function(){
        ctrl.rs = $sessionStorage.getData('rs');
    }
}

angular.module('untApp').component('subjectList', {
    templateUrl: 'app/component/subjectList/subject-list.html',
    controller: SubjectListCtrl,
    bindings: {
        subjects: '='
    },
    require: {
        testCtrl: '^test'
    }
});
