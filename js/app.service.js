angular
  .module('todoApp')
  .service('todoStore', function () {
    return {
      get: function () {
        var cookieStartIndex = document.cookie.indexOf('todoList=');
        var cookieEndIndex;

        if (cookieStartIndex === -1) {
          return '';
        }

        cookieEndIndex = document.cookie.indexOf(']', cookieStartIndex + ('todoList=').length);
        if (cookieEndIndex === -1) {
          return '';
        }

        return JSON.parse(document.cookie.substring(cookieStartIndex + ('todoList=').length, cookieEndIndex + 1));
      },
      set: function (todoList, archived) {
        var time = new Date();
        time.setTime(time.getTime() + 2678400000);
        document.cookie = 'todoList=' + JSON.stringify(todoList) + '; archived=' + JSON.stringify(archived) + '; expires=' + time.toGMTString();
      }
    };
  });
