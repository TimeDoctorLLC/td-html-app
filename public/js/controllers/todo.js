angular.module("todo")
  .controller("TodoCtrl", function ($scope, localStorageService, Task, Project, Folder) {

    $scope.init = function () {

      // load tasks from the server
      Task.findAll().then(function (data) {
        // binding TaskCollection to controller
        Task.bindAll(null, $scope, 'todos');

        // load projects from the server
        Project.findAll().then(function (data) {

          // set task counters to 0
          data.forEach(function (element, index, array) {
            element.tasksCount = 0;
          });

          // increment number of tasks in a project
          Task.getAll().forEach(function (element) {
            // @todo: unsafe, refactor
            if (Object.keys(element.project).length > 0) {
              Project.get(element.project.id).tasksCount++;
            }
          });

          // binding TaskCollection to controller
          Project.bindAll(null, $scope, 'projects');
        });

        // load folders from the server
        Folder.findAll().then(function (data) {

          // set task counters to 0
          data.forEach(function (element, index, array) {
            element.tasksCount = 0;
          });

          // increment number of tasks in a folder
          Task.getAll().forEach(function (element) {

            if (element.folders.length > 0) {
              element.folders.forEach(function (taskFolder) {
                Folder.get(taskFolder.id).tasksCount++;
              });
            }
          });

          // binding TaskCollection to controller
          Folder.bindAll(null, $scope, 'folders');
        });
      });


      $scope.show = "All";
      // all projects
      $scope.currentProject = -1;
      // all folders
      $scope.currentFolder = -1;
    };

    $scope.addTask = function () {
      Task.create({name: $scope.newTodo}).then(function () {
        $scope.newTodo = "";
      });
    };

    $scope.deleteTask = function (id) {
      Task.destroy(id);
    };

    $scope.todoSortable = {
      containment: "parent",//Dont let the user drag outside the parent
      cursor: "move",//Change the cursor icon on drag
      tolerance: "pointer"//Read http://api.jqueryui.com/sortable/#option-tolerance
    };

    $scope.changeProject = function (i) {
      $scope.currentProject = i;
    };

    $scope.changeFolder = function (i) {
      $scope.currentFolder = i;
    };

    /* Filter Function for All | Incomplete | Complete */
    $scope.showFn = function (todo) {
      if ($scope.show === "All") {
        return true;
      } else if (todo.status === "closed" && $scope.show === "Complete") {
        return true;
      } else if (todo.status !== "closed" && $scope.show === "Incomplete") {
        return true;
      } else {
        return false;
      }
    };

    /* Filter by project */
    $scope.filterProject = function (element) {
      if ($scope.currentProject === -1){
        return true;
      } else {
        if (Object.keys(element.project).length > 0){
          return (element.project.id === $scope.currentProject);
        } else {
          // no project defined
          return false;
        }

      }
    };

    /* Filter by folder */
    $scope.filterFolder = function (element) {
      if ($scope.currentFolder === -1){
        return true;
      } else {
        if (element.folders.length > 0){
          return (element.folders.map(function(e){return e.id}).indexOf($scope.currentFolder) !== -1);
        } else {
          // no project defined
          return false;
        }

      }
    };

    $scope.$watch("model", function (newVal, oldVal) {
      if (newVal !== null && angular.isDefined(newVal) && newVal !== oldVal) {
        localStorageService.add("todoList", angular.toJson(newVal));
      }
    }, true);

  });