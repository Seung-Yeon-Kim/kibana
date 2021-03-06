/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import $ from 'jquery';
import _ from 'lodash';
import angular from 'angular';
import tableCellFilterHtml from './table_cell_filter.html';

export function KbnRows($compile) {
  return {
    restrict: 'A',
    link: function ($scope, $el, attr) {
      function addCell($tr, contents, column, row) {
        function createCell() {
          return $(document.createElement('td'));
        }

        function createFilterableCell(value) {
          const $template = $(tableCellFilterHtml);
          $template.addClass('kbnTableCellFilter__hover');

          const scope = $scope.$new();

          scope.onFilterClick = (event, negate) => {
            // Don't add filter if a link was clicked.
            if ($(event.target).is('a')) {
              return;
            }

            $scope.filter({
              name: 'filterBucket',
              data: {
                data: [
                  {
                    table: $scope.table,
                    row: $scope.rows.findIndex((r) => r === row),
                    column: $scope.table.columns.findIndex((c) => c.id === column.id),
                    value,
                  },
                ],
                negate,
              },
            });
          };

          return $compile($template)(scope);
        }

        let $cell;
        let $cellContent;

        const contentsIsDefined = contents !== null && contents !== undefined;

        if (column.filterable && contentsIsDefined) {
          $cell = createFilterableCell(contents);
          // in jest tests 'angular' is using jqLite. In jqLite the method find lookups only by tags.
          // Because of this, we should change a way how we get cell content so that tests will pass.
          $cellContent = angular.element($cell[0].querySelector('[data-cell-content]'));
        } else {
          $cell = $cellContent = createCell();
        }

        // An AggConfigResult can "enrich" cell contents by applying a field formatter,
        // which we want to do if possible.
        contents = contentsIsDefined ? column.formatter.convert(contents, 'html') : '';

        if (_.isObject(contents)) {
          if (contents.attr) {
            $cellContent.attr(contents.attr);
          }

          if (contents.class) {
            $cellContent.addClass(contents.class);
          }

          if (contents.scope) {
            $cellContent = $compile($cellContent.prepend(contents.markup))(contents.scope);
          } else {
            $cellContent.prepend(contents.markup);
          }

          if (contents.attr) {
            $cellContent.attr(contents.attr);
          }
        } else {
          if (contents === '') {
            $cellContent.prepend('&nbsp;');
          } else {
            $cellContent.prepend(contents);
          }
        }

        $tr.append($cell);
      }

      $scope.$watchMulti([attr.kbnRows, attr.kbnRowsMin], function (vals) {
        let rows = vals[0];
        const min = vals[1];

        $el.empty();

        if (!Array.isArray(rows)) rows = [];

        if (isFinite(min) && rows.length < min) {
          // clone the rows so that we can add elements to it without upsetting the original
          rows = _.clone(rows);
          // crate the empty row which will be pushed into the row list over and over
          const emptyRow = {};
          // push as many empty rows into the row array as needed
          _.times(min - rows.length, function () {
            rows.push(emptyRow);
          });
        }

        rows.forEach(function (row) {
          const $tr = $(document.createElement('tr')).appendTo($el);
          $scope.columns.forEach((column) => {
            const value = row[column.id];
            addCell($tr, value, column, row);
          });
        });
      });
    },
  };
}
