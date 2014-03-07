var todoApp = angular.module('todoApp', [])

todoApp.controller('todoController',
    function($scope) {

        if (document.cookie.indexOf("todos") == -1) {
            $scope.todos = []
        } else {
            $scope.todos = JSON.parse(getCookies("todos"));
        }

        $scope.todoAdd = function() {
            $scope.todos.push({
                'text': $scope.todoTask,
                'done': false
            });
            $scope.todoTask = '';
            $scope.saveState();
        }

        $scope.number = function() {
            var count = 0;
            angular.forEach($scope.todos, function(todo) {
                count += (!todo.done) ? 1 : 0;
            });
            return count;
        }

        $scope.saveState = function() {
            var time = new Date();
            time.setTime(time.getTime() + 2678400000);
            document.cookie = 'todos=' + JSON.stringify($scope.todos) + '; archived=' + JSON.stringify($scope.archived) + '; expires=' + time.toGMTString();
        }

        $scope.removeTask = function(id) {

            if (confirm("Вы уверены что хотите удалить задачу? Это необратимо.")) {
                $scope.todos.splice($scope.todos.indexOf(id), 1);
                $scope.saveState();
            }

        }

        $scope.archiveTasks = function() {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            $scope.archived = [];
            angular.forEach(oldTodos, function(todo) {
                (!todo.done) ? $scope.todos.push(todo) : $scope.archived.push(todo);
            });
            $scope.saveState();
        }

        $scope.alert = function(text) {
            console.log(text);
        }

        $scope.jsParseDate = function(title) {
            if (title) title = title.toLowerCase();
            title = title.replace(" одиннадцать ", " 11 ")
                .replace(/двенадцать/, " 12 ")
                .replace(/тринадцать/, " 13 ")
                .replace(/четырнадцать/, " 14 ")
                .replace(/пятнадцать/, " 15 ")
                .replace(/шестнадцать/, " 16 ")
                .replace(/восемнадцать/, " 18 ")
                .replace(/семнадцать/, " 17 ")
                .replace(/девятнадцать/, " 19 ")
                .replace(/двадцать/, " 20 ")
                .replace(/ноль/, " 0 ")
                .replace(/один/, " 1 ")
                .replace(/два/, " 2 ")
                .replace(/три/, " 3 ")
                .replace(/четыре/, " 4 ")
                .replace(/пять/, " 5 ")
                .replace(/шесть/, " 6 ")
                .replace(/семь/, " 7 ")
                .replace(/восемь/, " 8 ")
                .replace(/девять/, " 9 ")
                .replace(/десять/, " 10 ");

            $scope.alert("TITLE: " + title);

            var answer = "";
            var did = false;
            var mytime = "";
            var mydate = new Date();
            var newdate = new Date();
            var d = new Object;
            d.myhours = 0;
            d.myminutes = 0;
            d.mydays = 0;
            d.mymonth = 0;
            d.myyears = 0;
            d.myweek = 0;

            // дата в формате dd.mm.yyyy
            var dates = title.match(/(\d{1,2}.\d{1,2}.\d{4})/g);

            $scope.alert("Dates: " + dates);

            if (dates) {
                var dateNumbers = dates[0].match(/(\d{1,4})/g);
                newdate.setDate(dateNumbers[0]);
                newdate.setMonth(dateNumbers[1] - 1);
                newdate.setFullYear(dateNumbers[2]);
                answer = dateNumbers[0] + "." + dateNumbers[1] + "." + dateNumbers[2];
                did = true;
            }

            // Находим месяц
            months = title.match(/(\d{1,2} янв)|(\d{1,2} фев)|(\d{1,2} мар)|(\d{1,2} апр)|(\d{1,2} мая)|(\d{1,2} май)|(\d{1,2} июн)|(\d{1,2} июл)|(\d{1,2} авг)|(\d{1,2} сен)|(\d{1,2} окт)|(\d{1,2} ноя)|(\d{1,2} дек)/g);

            $scope.alert("months: " + months);

            if (months) {
                year = title.match(/(\d{4})/g); //найти год
                month = title.match(/(янв)|(фев)|(мар)|(апр)|(мая)|(май)|(июн)|(июл)|(авг)|(сен)|(окт)|(ноя)|(дек)/g); //найти месяц
                day = months[0].match(/(\d{1,2})/g); //найти дату

                if (month[0] == "янв") var mymonth = 1;
                if (month[0] == "фев") var mymonth = 2;
                if (month[0] == "мар") var mymonth = 3;
                if (month[0] == "апр") var mymonth = 4;
                if (month[0] == "мая") var mymonth = 5;
                if (month[0] == "май") var mymonth = 5;
                if (month[0] == "июн") var mymonth = 6;
                if (month[0] == "июл") var mymonth = 7;
                if (month[0] == "авг") var mymonth = 8;
                if (month[0] == "сен") var mymonth = 9;
                if (month[0] == "окт") var mymonth = 10;
                if (month[0] == "ноя") var mymonth = 11;
                if (month[0] == "дек") var mymonth = 12;

                newdate.setDate(day[0]);
                newdate.setMonth(mymonth - 1);
                if (year) newdate.setFullYear(year[0]);
                answer = day[0] + " " + month[0];
                did = true;
            }

            // определяем по лексеме
            lexems = title.match(/(вчера)|(позавчера)|(сегодня)|(завтра)|(послезавтра)/g);

            $scope.alert("lexems: " + lexems);

            if (lexems) {
                if (lexems[0] == "позавчера") var add_days = -2;
                if (lexems[0] == "вчера") var add_days = -1;
                if (lexems[0] == "сегодня") var add_days = 0;
                if (lexems[0] == "завтра") var add_days = +1;
                if (lexems[0] == "послезавтра") var add_days = +2;
                newdate.setDate(newdate.getDate() + add_days);
                answer = " + " + lexems[0];
                did = true;
            }

            // часы минуты
            hoursminutes = title.match(/(\d{1,2}ч|\d{1,2} ч)|(в \d{1,2}:\d{1,2})|(в\d{1,2}:\d{1,2})|(\d{2} ми)|(\d{2}ми)|(\d{1,2} +\d{2}м)|(в +\d{1,2})|(в\d{1,2})|(\d{1,2}:\d{1,2})/g);

            $scope.alert("hoursminutes: " + hoursminutes);

            if (hoursminutes) {
                if (hoursminutes.length == 1) {
                    mytime = hoursminutes;
                } else {
                    mytime = hoursminutes.join(" ");
                }
            }
            $scope.alert("mytime: " + mytime);

            //все двух-значные цифры
            var twodigits = title.match(/\d{1,4}/g);
            var modifier;
            //если "через 2 часа 30 минут"
            matches = title.match(/(дней|лет|нед|год|мес|день|дня|час|мин|\d{1,2}м|\d{1,2} м)/g);

            $scope.alert("matches: " + matches);

            if (((title.indexOf("назад") != -1) || (title.indexOf("через") != -1)) && matches) {
                if (title.indexOf("через") != -1) {
                    modifier = "+";
                } else {
                    modifier = "-";
                }
                if (matches[0] == "час") //если указаны часы и минуты
                {
                    if (twodigits) {
                        answer = modifier;
                        if (twodigits[0]) {
                            answer += twodigits[0] + " час.";
                            d.myhours = modifier + twodigits[0];
                        }
                        if (twodigits[1]) {
                            answer += " " + twodigits[1] + " мин.";
                            d.myminutes = modifier + twodigits[0];
                        }
                        mytime = ""; //это не время
                    }
                }
                if (matches[0] == "мин" || (matches[0][matches[0].length - 1] == "м" && (title.indexOf("мес") == -1))) //если указаны только минуты
                {
                    if (twodigits) {
                        answer = modifier;
                        if (twodigits[0]) {
                            answer += " " + twodigits[0] + " minute";
                            d.myminutes = modifier + twodigits[0];
                        }
                        mytime = ""; //это не время
                    }
                }
                if (matches[0] == "нед") //если указаны только недели
                {
                    if (twodigits) {
                        answer = modifier;
                        if (twodigits[0]) {
                            answer += "" + twodigits[0] + " нед.";
                            d.myweek = modifier + twodigits[0];
                        };
                    }
                    if (title.indexOf("через нед") != -1) {
                        answer = "+ 1 нед.";
                        d.myweek = modifier + 1
                    };
                }
                if (title.indexOf("месяц") != -1) //если указаны только месяцы
                {
                    if (twodigits) {
                        answer = modifier;
                        if (twodigits[0]) {
                            answer += "" + twodigits[0] + " мес.";
                            d.mymonth = modifier + twodigits[0];
                        };
                    }
                    if (title.indexOf("через мес") != -1) {
                        answer = "+ 1 мес.";
                        d.mymonth = modifier + 1;
                    };
                }
                if ((title.indexOf(" год") != -1) || (title.indexOf(" лет") != -1)) //если указаны только месяцы
                {
                    if (twodigits) {
                        answer = modifier;
                        if (twodigits[0]) {
                            answer += "" + twodigits[0] + " год.";
                            d.myyears = modifier + twodigits[0];
                        };
                    }
                    if (title.indexOf("через год") != -1) {
                        answer = "+ 1 год.";
                        d.myyears = modifier + 1;
                    };
                }
                if ((title.indexOf(" день") != -1) || (title.indexOf(" дня") != -1) || (title.indexOf(" дней") != -1)) //если указаны только месяцы
                {
                    if (twodigits) {
                        answer = modifier;
                        if (twodigits[0]) {
                            answer += "" + twodigits[0] + " дн.";
                            d.mydays = modifier + twodigits[0];
                        };
                    }
                    if (title.indexOf("через год") != -1) {
                        answer = "+ 1 дн.";
                        d.mydays = modifier + 1;
                    };
                }
            }

            $scope.alert("mytime: " + mytime);

            if (mytime != "") {
                ///анализ времени
                time = mytime.toString().match(/(в \d{1,2})|(в\d{1,2})|(\d{1,2}:\d{1,2})/g);
                if ((matches)) {
                    need_analyse = mytime.toString().match(/(в \d{1,2} в \d{1,2})|(\d{1,2} \d{1,2}м)|(\d{1,2}ч\d{1,2}м)|(\d{1,2}ч \d{1,2}м)|(\d{1,2}:\d{1,2})/g);
                    onemoretime = mytime.toString().match(/(в \d{1,2}:\d{1,2})|(в\d{1,2}:\d{1,2})/g);
                    if (onemoretime) need_analyse = false;
                    if (!need_analyse) {
                        mytime = mytime.toString().replace("в ", "").replace("в", "");
                        if (!onemoretime) mytime += ":00";
                    } else {
                        matches3 = mytime.toString().match(/\d{1,4}/g); //все двух-значные цифры
                        if (matches3)
                            if (matches3.length == 1) mytime = matches3;
                            else mytime = matches3.join(":");
                    }
                }
            }

            var add = (mytime != "") ? "[" + mytime + "]" : "";
            if ((mytime != "")) {
                if (mytime.toString().match(/\d{1,2}:\d{1,2}/g)) {
                    newtime = mytime.toString().split(":");
                    mydate.setHours(parseInt(newtime[0]), 10);
                    mydate.setMinutes(parseInt(newtime[1], 10));
                    mydate.setSeconds(0);
                } else {
                    mytime = "";
                }
            }



            if (did) {
                newdate.setHours(mydate.getHours() + parseInt(d.myhours, 10));
                newdate.setMinutes(mydate.getMinutes() + parseInt(d.myminutes, 10));
                newdate.setSeconds(0);
                mydate = newdate;
            } else {
                mydate.setHours(mydate.getHours() + parseInt(d.myhours, 10));
                mydate.setMinutes(mydate.getMinutes() + parseInt(d.myminutes, 10));
                mydate.setSeconds(0);
            }


            mydate.setDate(mydate.getDate() + parseInt(d.mydays, 10) + parseInt(d.myweek * 7, 10));
            mydate.setMonth(mydate.getMonth() + parseInt(d.mymonth, 10));
            mydate.setYear(mydate.getFullYear() + parseInt(d.myyears, 10));
            weekday = title.match(/(понед)|(вторн)|(сред)|(четв)|(пятн)|(субб)|(воскр)/g);
            if (weekday) {
                week = 0;
                if (weekday[0] == "понед") week = 1;
                if (weekday[0] == "вторн") week = 2;
                if (weekday[0] == "сред") week = 3;
                if (weekday[0] == "четв") week = 4;
                if (weekday[0] == "пятн") week = 5;
                if (weekday[0] == "субб") week = 6;
                if (weekday[0] == "воскр") week = 7;
                if (week != 0) {
                    //поиск следующего дня недели
                    mydate = nextWeekDay(mydate, week);
                    answer = weekday[0];
                }
            }

            if ((answer == "") && (mytime == "")) mydate = "";
            if (title.toLowerCase().indexOf("смс") != -1 || title.toLowerCase().indexOf("sms") != -1 || title.toLowerCase().indexOf("напомни") != -1) {
                var remind_time_default = localStorage.getItem("remind_time");
                remind_time = remind_time_default ? remind_time_default : 15;
                add += " | Напомнить за " + remind_time + " м";
                var sms = " | Напомнить за " + remind_time + " м";
            } else {
                var sms = "";
            }

            $scope.alert("mytime: " + mydate);

            return {
                title: answer + " " + add,
                date: mydate,
                sms: sms
            };

            function nextWeekDay(date, day) { //поиск следующего дня недели
                (day = (Math.abs(+day || 0) % 7) - date.getDay()) < 0 && (day += 7);
                return day && date.setDate(date.getDate() + day), date;
            };
        }


    });

angular.module('todoApp').directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter, {
                        'event': event
                    });
                });
                event.preventDefault();
            }
        });
    };
});




function getCookies(name) {
    var cIndex = document.cookie.indexOf(name);
    if (cIndex == -1) {
        return ''
    };

    cIndex = document.cookie.indexOf(name + "=");
    if (cIndex == -1) {
        return ''
    };

    var cEndIndex = document.cookie.indexOf(']', cIndex + (name + '=').length);

    if (cEndIndex == -1) {
        cEndIndex == document.cookie.length;
    }

    return document.cookie.substring(cIndex + (name + '=').length, cEndIndex + 1);
}