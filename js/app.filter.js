angular
  .module('todoApp')
  .filter('timeify', function () {
    return function (todoString) {
      var mytime = '';
      var mydate = new Date();
      var newdate = new Date();
      var d = {
        myhours: 0,
        myminutes: 0,
        mydays: 0,
        mymonth: 0,
        myyears: 0,
        myweek: 0
      };

      var regexArray = [/ноль/, /один/, /два/, /три/, /четыре/, /пять/, /шесть/, /семь/, /восемь/, /девять/, /десять/, /одиннадцать/, /двенадцать/, /тринадцать/,
        /четырнадцать/, /пятнадцать/, /шестнадцать/, /семнадцать/, /восемнадцать/, /девятнадцать/, /двадцать/];

      var monthList = ['янв', 'фев', 'мар', 'апр', 'мая', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
      var text = todoString.toLowerCase();
      var remindTimeDefault = localStorage.getItem('remindTime');
      var remindTime;
      var dateNumbers;
      var months;
      var year;
      var month;
      var day;
      var mymonth;
      var addDays;
      var add;
      var newtime;
      var sms;

      var result = {
        answer: '',
        did: false
      };


      regexArray.forEach(function (numString, index) {
        text = text.replace(numString, ' ' + index + ' ');
      });

      function storeDatesSearchResults() {
        var dates = text.match(/(\d{1,2}.\d{1,2}.\d{4})/g);
        if (dates) {
          dateNumbers = dates[0].match(/(\d{1,4})/g);
          newdate.setDate(dateNumbers[0]);
          newdate.setMonth(dateNumbers[1] - 1);
          newdate.setFullYear(dateNumbers[2]);
          result.result.answer = dateNumbers[0] + '.' + dateNumbers[1] + '.' + dateNumbers[2];
          result.result.did = true;
        }
      }

      function storeMonthesSearchResults() {

        function generateMonthRegex() {

        }

        var monthes = text.match(/(\d{1,2} янв)|(\d{1,2} фев)|(\d{1,2} мар)|(\d{1,2} апр)|(\d{1,2} мая)|(\d{1,2} май)|(\d{1,2} июн)|(\d{1,2} июл)|(\d{1,2} авг)|(\d{1,2} сен)|(\d{1,2} окт)|(\d{1,2} ноя)|(\d{1,2} дек)/g);
        if (monthes) {
          year = text.match(/(\d{4})/g);
          month = text.match(/(янв)|(фев)|(мар)|(апр)|(мая)|(май)|(июн)|(июл)|(авг)|(сен)|(окт)|(ноя)|(дек)/g);
          day = months[0].match(/(\d{1,2})/g);

          mymonth = monthList.indexOf(month[0]);

          newdate.setDate(day[0]);
          newdate.setMonth(mymonth);
          if (year) newdate.setFullYear(year[0]);
          result.answer = day[0] + ' ' + month[0];
          result.did = true;
        }
      }

      function storeLexemsSearchResult() {
        var lexems = text.match(/(вчера)|(позавчера)|(сегодня)|(завтра)|(послезавтра)/g);
        if (lexems) {
          if (lexems[0] === 'позавчера') addDays = -2;
          if (lexems[0] === 'вчера') addDays = -1;
          if (lexems[0] === 'сегодня') addDays = 0;
          if (lexems[0] === 'завтра') addDays = +1;
          if (lexems[0] === 'послезавтра') addDays = +2;

          newdate.setDate(newdate.getDate() + addDays);
          result.answer = ' + ' + lexems[0];
          result.did = true;
        }
      }

      function storeHoursMinutesSearchResult() {
        var hoursminutes = text.match(/(\d{1,2}ч|\d{1,2} ч)|(в \d{1,2}:\d{1,2})|(в\d{1,2}:\d{1,2})|(\d{2} ми)|(\d{2}ми)|(\d{1,2} +\d{2}м)|(в +\d{1,2})|(в\d{1,2})|(\d{1,2}:\d{1,2})/g);

        if (hoursminutes) {
          if (hoursminutes.length === 1) {
            mytime = hoursminutes;
          } else {
            mytime = hoursminutes.join(' ');
          }
        }
      }

      function storeComplexInstancesSearchResult() {
        var matches = text.match(/(дней|лет|нед|год|мес|день|дня|час|мин|\d{1,2}м|\d{1,2} м)/g);
        var twodigits = text.match(/\d{1,4}/g);
        var modifier;
        var onemoretime;
        var needAnalyze;
        var matches3;
        // если "через 2 часа 30 минут"


        if (((text.indexOf('назад') !== -1) || (text.indexOf('через') !== -1)) && matches) {
          modifier = (text.indexOf('через') !== -1) ? '+' : '-';
          // только часы
          if (matches[0] === 'час' && twodigits) {
            result.answer = modifier;
            if (twodigits[0]) {
              result.answer += twodigits[0] + ' час.';
              d.myhours = modifier + twodigits[0];
            }
            if (twodigits[1]) {
              result.answer += ' ' + twodigits[1] + ' мин.';
              d.myminutes = modifier + twodigits[0];
            }
            mytime = '';
          }
          // только минуты
          if ((matches[0] === 'мин' || (matches[0][matches[0].length - 1] === 'м' && (text.indexOf('мес') === -1))) && twodigits) {
            result.answer = modifier;
            if (twodigits[0]) {
              result.answer += ' ' + twodigits[0] + ' minute';
              d.myminutes = modifier + twodigits[0];
            }
            mytime = '';
          }
          // только недели
          if (matches[0] === 'нед') {
            if (twodigits) {
              result.answer = modifier;
              if (twodigits[0]) {
                result.answer += '' + twodigits[0] + ' нед.';
                d.myweek = modifier + twodigits[0];
              }
            }
            if (text.indexOf('через нед') !== -1) {
              result.answer = '+ 1 нед.';
              d.myweek = modifier + 1;
            }
          }
          // только месяц
          if (text.indexOf('месяц') !== -1) {
            if (twodigits) {
              result.answer = modifier;
              if (twodigits[0]) {
                result.answer += '' + twodigits[0] + ' мес.';
                d.mymonth = modifier + twodigits[0];
              }
            }
            if (text.indexOf('через мес') !== -1) {
              result.answer = '+ 1 мес.';
              d.mymonth = modifier + 1;
            }
          }
          if ((text.indexOf(' год') !== -1) || (text.indexOf(' лет') !== -1)) {
            if (twodigits) {
              result.answer = modifier;
              if (twodigits[0]) {
                result.answer += '' + twodigits[0] + ' год.';
                d.myyears = modifier + twodigits[0];
              }
            }
            if (text.indexOf('через год') !== -1) {
              result.answer = '+ 1 год.';
              d.myyears = modifier + 1;
            }
          }

          if ((text.indexOf(' день') !== -1) || (text.indexOf(' дня') !== -1) || (text.indexOf(' дней') !== -1)) {
            if (twodigits) {
              result.answer = modifier;
              if (twodigits[0]) {
                result.answer += '' + twodigits[0] + ' дн.';
                d.mydays = modifier + twodigits[0];
              }
            }
            if (text.indexOf('через год') !== -1) {
              result.answer = '+ 1 дн.';
              d.mydays = modifier + 1;
            }
          }
        }


        if (mytime !== '') {
          // var time = mytime.toString().match(/(в \d{1,2})|(в\d{1,2})|(\d{1,2}:\d{1,2})/g);

          if ((matches)) {
            needAnalyze = mytime.toString().match(/(в \d{1,2} в \d{1,2})|(\d{1,2} \d{1,2}м)|(\d{1,2}ч\d{1,2}м)|(\d{1,2}ч \d{1,2}м)|(\d{1,2}:\d{1,2})/g);
            onemoretime = mytime.toString().match(/(в \d{1,2}:\d{1,2})|(в\d{1,2}:\d{1,2})/g);
            if (onemoretime) needAnalyze = false;
            if (!needAnalyze) {
              mytime = mytime.toString().replace('в ', '').replace('в', '');
              if (!onemoretime) mytime += ':00';
            } else {
              matches3 = mytime.toString().match(/\d{1,4}/g); // все двух-значные цифры
              if (matches3) {
                if (matches3.length === 1) mytime = matches3;
                else mytime = matches3.join(':');
              }
            }
          }
        }

        add = (mytime !== '') ? '[' + mytime + ']' : '';
        if ((mytime !== '')) {
          if (mytime.toString().match(/\d{1,2}:\d{1,2}/g)) {
            newtime = mytime.toString().split(':');
            mydate.setHours(parseInt(newtime[0], 10));
            mydate.setMinutes(parseInt(newtime[1], 10));
            mydate.setSeconds(0);
          } else {
            mytime = '';
          }
        }
      }

      function storeWeeksSearchResults() {
        var weekday;
        var week;

        function nextWeekDay(date, day) {
          (day = (Math.abs(+day || 0) % 7) - date.getDay()) < 0 && (day += 7);
          if (day) {
            date.setDate(date.getDate() + day);
          }
          return date;
        }

        weekday = text.match(/(понед)|(вторн)|(сред)|(четв)|(пятн)|(субб)|(воскр)/g);
        if (weekday) {
          week = 0;
          if (weekday[0] === 'понед') week = 1;
          if (weekday[0] === 'вторн') week = 2;
          if (weekday[0] === 'сред') week = 3;
          if (weekday[0] === 'четв') week = 4;
          if (weekday[0] === 'пятн') week = 5;
          if (weekday[0] === 'субб') week = 6;
          if (weekday[0] === 'воскр') week = 7;
          if (week !== 0) {
            // поиск следующего дня недели
            mydate = nextWeekDay(mydate, week);
            result.answer = weekday[0];
          }
        }
      }

      storeDatesSearchResults();
      storeMonthesSearchResults();
      storeLexemsSearchResult();
      storeHoursMinutesSearchResult();
      storeComplexInstancesSearchResult();
      storeWeeksSearchResults();

      if (result.did) {
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

      if ((result.answer === '') && (mytime === '')) mydate = '';

      if (text.toLowerCase().indexOf('смс') !== -1 || text.toLowerCase().indexOf('sms') !== -1 || text.toLowerCase().indexOf('напомни') !== -1) {
        remindTime = remindTimeDefault || 15;
        add += ' | Напомнить за ' + remindTime + ' м';
        sms = ' | Напомнить за ' + remindTime + ' м';
      } else {
        sms = '';
      }


      return {
        text: result.answer + ' ' + add,
        date: mydate,
        sms: sms
      };
    };
  })
;
