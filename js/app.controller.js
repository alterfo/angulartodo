angular
  .module('todoApp')
  .controller('TodoController', ['$scope', 'todoStore', '$filter',
    function ($scope, todoStore, $filter) {
      $scope.demoData = function () {
        return [{
          text: 'eHealth report ждет до пятницы 12:00',
          done: false,
          date: '4/4/2014 12:00:00 PM'
        }, {
          text: 'через неделю достать кота из стиралки',
          done: false,
          date: '4/10/2014 6:29:00 PM'
        }, {
          text: 'Время определяется автоматически',
          done: false,
          date: ''
        }, {
          text: 'Можно кликнуть на запись чтобы ее отредактировать',
          done: false,
          date: ''
        }];
      };

      $scope.todoList = (document.cookie.indexOf('todoList') === -1) ? $scope.demoData() : todoStore.get();

      $scope.addTodoItem = function () {
        $scope.todoList.push({
          text: $scope.todoInput,
          done: false,
          date: $filter('timeify')($scope.todoInput).date.toLocaleString()
        });
        $scope.todoInput = '';
        $scope.saveState();
      };

      $scope.saveTodoList = function (todo) {
        todo.date = $filter('timeify')(todo.text).date.toLocaleString();
        $scope.saveState();
      };

      $scope.numDone = function () {
        var count = 0;
        angular.forEach($scope.todoList, function (todo) {
          count += (!todo.done) ? 1 : 0;
        });
        return count;
      };

      $scope.saveState = function () {
        todoStore.set($scope.todoList, $scope.archived);
      };

      $scope.removeTodoItem = function (id) {
        if (confirm('Вы уверены что хотите удалить задачу? Это необратимо.')) {
          $scope.todoList.splice($scope.todoList.indexOf(id), 1);
          $scope.saveState();
        }
      };

      $scope.archiveTodoItems = function () {
        var oldTodos = $scope.todoList;
        $scope.todoList = [];
        $scope.archived = [];
        angular.forEach(oldTodos, function (todo) {
          (!todo.done) ? $scope.todoList.push(todo) : $scope.archived.push(todo);
        });
        $scope.saveState();
      };
    }]);
