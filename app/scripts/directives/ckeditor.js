(function() {
  "use strict";

    function CkEditorProvider() {
    CKEDITOR.disableAutoInline = true;

    this.$get = ['$log', function CkeditorFactory($log) {

      function Ckeditor(id, config) {
        this.id = id;
        this.config = config;
        CKEDITOR.inline(id, config);
        if (CKEDITOR.instances[id]) {
          this.instance = CKEDITOR.instances[id];
        } else {
          $log.error('Ckeditor : unable to create instance id:' + id);
        }
      }

      Ckeditor.prototype.getData = function () {
        return this.instance.getData();
      };

      Ckeditor.prototype.setData = function (data) {
        return this.instance.setData(data);
      };

      Ckeditor.prototype.on = function (eventName, fn) {
        return this.instance.on(eventName, fn);
      };

      Ckeditor.prototype.destroy = function () {
        return this.instance.destroy();
      };

      return {
        create: function (id, config) {
          var editor = new Ckeditor(id, config);
          $log.info('Ckeditor: created editor with id: ' + id);
          return editor;
        }
      };
    }];
  }
  /***
   * ckeditor directive
   * @param CKEDITOR
   * @returns {{template: string, restrict: string, require: string, link: Function}}
   * @constructor
   * @example
   * <div id='uniqId' ckeditor='config' ng-model='content'></div>
   */
  function CkEditorDirective(Ckeditor, $timeout, $parse) {
    return {
      template: '<div></div>',
      restrict: 'AE',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {
        debugger;
        var isTextArea = element[0].tagName.toLowerCase() === 'textarea',
          isReady = false,
          id = attrs.id, //TODO: if id is not provided add a unique id;
          config = $parse(attrs.ckeditor)(scope),
          data = null;

        function setModelData(){
          $timeout(function () { // for key up event
            ngModel.$setViewValue(editorInstance.getData());
          }, 0);
        }

        function onUpdateModelData(){
          isReady = false;
          editorInstance.setData(data, function () {
            setModelData();
            isReady = true;
          });
        }


        if (!isTextArea) {
          element.attr('contenteditable', true);
        }
        var editorInstance = Ckeditor.create(id, config);
        element.bind('$destroy', function () {
          editorInstance.destroy();
        });


        editorInstance.on('instanceReady', function(){
          scope.$apply(function(){
            onUpdateModelData();
          });
        });

        ngModel.$render = function getInitialModelValue(){
          data = ngModel.$viewValue || '';
          if(isReady){
            onUpdateModelData();
          }
        };
        editorInstance.on('change', setModelData);
        editorInstance.on('blur' ,setModelData);
        editorInstance.on('key', setModelData);
      }
    };
  }
  CkEditorDirective.$inject = ['Ckeditor', '$timeout', '$parse'];


  angular.module('angularComponentsApp')
    .provider('Ckeditor', CkEditorProvider)
    .directive('ckeditor', CkEditorDirective);

})();