function tableDirectiveFactory() {
    var directive = {

        compile: function compile(tElement, tAttrs, transclude) {
            return function (scope, element, attrs) {

                var headerDivElem = angular.element('<div/>');
                headerDivElem.css('height', 80);
                headerDivElem.css('overflow', 'scroll');
                element.wrap(headerDivElem);

                // save original width
                element.attr("data-item-original-width", element.width());
                element.find('thead tr td').each(function(){
                    angular.element(this).attr("data-item-original-width",angular.element(this).width());
                });
                element.find('tbody tr:eq(0) td').each(function(){
                    angular.element(this).attr("data-item-original-width", angular.element(this).width());
                });

                var newTbl =  element.clone();

                // remove table header from original table
                element.find('thead tr').remove();

                // remove table body from new table
                newTbl.find('tbody tr').remove();

                element.parent().parent().prepend(newTbl);
                newTbl.wrap('<div/>');

                // replace ORIGINAL COLUMN width
                newTbl.width(newTbl.attr('data-item-original-width'));
                newTbl.find('thead tr td').each(function(){
                    $(this).width($(this).attr("data-item-original-width"));
                });
                element.width(element.attr('data-item-original-width'));
                element.find('tbody tr:eq(0) td').each(function(){
                    $(this).width($(this).attr("data-item-original-width"));
                });

            }
        }
    };
    return directive;
};
angular.module('angularComponentsApp')
    .directive('scrollTable', tableDirectiveFactory);
